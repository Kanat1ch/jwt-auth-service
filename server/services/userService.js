const User = require('../models/User')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const MailService = require('./mailService')
const TokenService = require('./tokenService')
const UserDto = require('../dtos/userDto')
const ApiError = require('../exceptions/apiError')
const validator = require('validator')

class UserService {
    async registration(username, email, password) {
        const errors = {}

        const candidateWithUsername = await User.findOne({ username })
        const candidateWithEmail = await User.findOne({ email })

        const isCorrectUsername = validator.isLength(username, { min: 3, max: 20 })
        const isCorrectEmail = validator.isEmail(email)
        const isCorrectPassword = validator.isLength(password, { min: 6, max: 30 })

        if (candidateWithUsername) {
            errors.username = 'A user with this username address already exists'
        }

        if (candidateWithEmail) {
            errors.email = 'A user with this e-mail address already exists'
        }

        if (!isCorrectUsername) {
            errors.username = 'Username must be from 3 to 20 symbols'
        }

        if (!isCorrectEmail) {
            errors.email = 'Enter the correct E-mail address'
        }

        if (!isCorrectPassword) {
            errors.password = 'Password must be from 3 to 20 symbols'
        }


        if (Object.keys(errors).length) {
            return { errors: errors }
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const activationLink = uuid.v4()

        const user = await User.create({ username, email, password: hashPassword, activationLink })
        await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        return await this.generateAndSaveToken(user)
    }

    async activate(activationLink) {
        const user = await User.findOne({ activationLink })

        if (!user) {
            throw ApiError.BadRequest('Unavailable activation link')
        }

        user.isActivated = true
        await user.save()
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

        return { ...tokens, user: userDto }
    }

    async logout(refreshtoken) {
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
}

module.exports = new UserService()