const User = require('../models/User')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const TokenService = require('./tokenService')
const UserDto = require('../dtos/userDto')
const ApiError = require('../exceptions/apiError')
const fs = require('fs')
const path = require('path')
const SmsService = require('./smsService')
const MailService = require('./mailService')

class UserService {
    async registration(username, email, password) {
        const errors = await this.isDataAlreadyExist({
            username,
            email,
            password
        }, null)

        if (errors) {
            return { errors }
        }

        const hashPassword = await bcrypt.hash(password, 5)

        const user = await User.create({ username, email, password: hashPassword})

        return await this.generateAndSaveToken(user)
    }

    async sendCode(service, data) {
        if (service === 'email') {
            await MailService.sendActivationMail(data)
        }

        if (service === 'phone') {
            await SmsService.sendVerifyCode(`+7${data.replace(/\D/g,'')}`)
        }
    }

    async verifyCode(service, user, code) {
        const userFromDB = await User.findById(user.id)
        let isValid = false
        switch (service) {
            case 'phone':
                isValid = await SmsService.checkVerifyCode(`+7${user.phone.replace(/\D/g,'')}`, code)
                userFromDB.phoneVerified = true
                break
            case 'email':
                isValid = await MailService.checkVerifyCode(user.email, code)
                userFromDB.mailVerified = true
        }
        if (isValid) {
            await userFromDB.save()
            return await this.generateAndSaveToken(userFromDB)
        }
        throw ApiError.BadRequest('Invalid code')
    }

    async login(username, password) {
        const user = await User.findOne({ $or: [{ username }, { email: username }] })

        if (!user) {
            throw ApiError.BadRequest('Credentials not valid')
        }

        const isPasswordEqual = await bcrypt.compare(password, user.password)
        if (!isPasswordEqual) {
            throw ApiError.BadRequest('Credentials not valid')
        }

        return await this.generateAndSaveToken(user)
    }

    async generateAndSaveToken(user) {
        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({ ...userDto })
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, data: userDto }
    }

    async logout(refreshtoken) {
       return await TokenService.removeToken(refreshtoken)
    }

    async delete(id, refreshtoken) {
        await User.findOneAndDelete({ _id: id })
        return await TokenService.removeToken(refreshtoken)
     }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await TokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await User.findById(userData.id)
        return await this.generateAndSaveToken(user)
    }

    async edit(userData, formData) {
        const user = await User.findById(userData.id)

        const errors = await this.isDataAlreadyExist(formData, userData.id)
        if (errors) {
            return { errors }
        }

        for (const [key, value] of Object.entries(formData)) {
            user[key] = value
        }

        user.save()
        return await this.generateAndSaveToken(user)
    }

    async updateAvatar(id, file) {
        const user = await User.findById(id)
        if (user.image !== 'empty.png') {
            fs.unlinkSync(path.join(__dirname, '..', 'static', 'images', user.image))
        }
        user.image = file.filename
        await user.save()
        return await this.generateAndSaveToken(user)
    }

    async isDataAlreadyExist(dataToValidate, userID) {
        const errors = []
        const dataToValidateArray = Object.entries(dataToValidate)

        for (const [key, value] of dataToValidateArray) {
            if (key === 'email') {
                const candidate = await User.findOne({ email: value })
                if (candidate && (userID ? candidate._id.toString() !== userID : true)) {
                    errors.push('email')
                }
            }

            if (key === 'username') {
                const candidate = await User.findOne({ username: value })
                if (candidate && (userID ? candidate._id.toString() !== userID : true)) {
                    errors.push('username')
                }
            }

            if (key === 'phone' && value) {
                const candidate = await User.findOne({ phone: value })
                if (candidate && (userID ? candidate._id.toString() !== userID : true)) {
                    errors.push('phone')
                }
            }
        }

        if (errors.length) {
            return errors
        }

        return false
    }
}

module.exports = new UserService()