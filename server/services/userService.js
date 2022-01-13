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
        const userData = await User.findOne({ $or: [{ username: data }, { email: data }, { phone: data }] })

        if (service === 'email') {
            await MailService.sendActivationMail(userData.email)
        }

        if (service === 'phone') {
            await SmsService.sendVerifyCode(`+7${userData.phone.replace(/\D/g,'')}`)
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
                userFromDB.emailVerified = true
        }
        if (isValid) {
            await userFromDB.save()
            return await this.generateAndSaveToken(userFromDB)
        }
        throw ApiError.BadRequest('Invalid code')
    }

    async checkResetCode(verifyingService, data, code) {
        const userFromDB = await User.findOne({ $or: [{ username: data }, { email: data }, { phone: data }] })
        let isValid = false
        switch (verifyingService) {
            case 'phone':
                isValid = await SmsService.checkVerifyCode(`+7${userFromDB.phone.replace(/\D/g,'')}`, code)
                break
            case 'email':
                isValid = await MailService.checkVerifyCode(userFromDB.email, code)
        }
        if (isValid) {
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
            if ((key === 'email' || key === 'phone') && value !== user[key]) {
                user[`${key}Verified`] = false
            }

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

    async updatePassword(id, password) {
        const user = await User.findById(id)
        const hashPassword = await bcrypt.hash(password, 5)
        user.password = hashPassword
        await user.save()
    }

    async isDataAlreadyExist(dataToValidate, userID) {
        const errors = []
        const dataToValidateArray = Object.entries(dataToValidate)

        for (const [key, value] of dataToValidateArray) {

            const needToValidate = ['username', 'email', 'phone']

            if (needToValidate.includes(key) && value) {
                const candidate = await User.findOne({ [key]: value })
                if (candidate && (userID ? candidate._id.toString() !== userID : true)) {
                    errors.push(key)
                }
            } 
        }

        if (errors.length) {
            return errors
        }

        return false
    }

    async isPasswordEqual(id, password) {
        const user = await User.findById(id)

        const isPasswordEqual = await bcrypt.compare(password, user.password)

        if (!isPasswordEqual) {
            throw ApiError.BadRequest('Incorrect password')
        }
    }

    async linked(userData) {
        const linked = ['email']

        const isPhone = /^\d+$/.test(userData) && userData.length === 10
        const phone = isPhone ? `(${userData.slice(0, 3)}) ${userData.slice(3, 6)}-${userData.slice(6, 8)}-${userData.slice(8)}` : userData

        const user = await User.findOne({ $or: [{ username: userData }, { email: userData }, { phone }] })
        
        if (!user) {
            throw ApiError.BadRequest('User with this credentials was not found')
        }

        if (user.phone) {
            linked.push('phone')
        }
        return linked
    }
}

module.exports = new UserService()