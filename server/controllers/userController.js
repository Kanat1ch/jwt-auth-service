const UserService = require('../services/userService')
const MailService = require('../services/mailService')
const SmsService = require('../services/smsService')
const ApiError = require('../exceptions/apiError')

class UserController {
    async registration(req, res, next) {
        try {
            const { username, email, password } = req.body

            const userData = await UserService.registration(username, email, password)

            if (userData.errors) {
                throw ApiError.BadRequest('Registration error', userData.errors)
            }

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.status(201).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body
            const userData = await UserService.login(username, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.status(201).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.status(200).json({ message: 'Successfully logout' })
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.user
            const { refreshToken } = req.cookies
            await UserService.delete(id, refreshToken)
            res.clearCookie('refreshToken')
            res.status(200).json({ message: 'Account successfully deleted' })
        } catch (e) {
            next(e)
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const activationLink = req.params.link
            await UserService.verifyEmail(activationLink)
            return res.redirect(`${process.env.CLIENT_URL}/profile/verified`)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const userData = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.status(201).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async edit(req, res, next) {
        try {
            const { user, body: formData } = req
            const userData = await UserService.edit(user, formData)

            if (userData.errors) {
                throw ApiError.BadRequest('Edition error', userData.errors)
            }
            
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.status(201).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async isExist(req, res, next) {
        try {
            const { dataToValidate, currentUserID: userID } = req.body
            const hasErrors = await UserService.isDataAlreadyExist(dataToValidate, userID)
            
            return res.status(200).json({ errors: hasErrors })
        } catch (e) {
            next(e)
        }
    }

    async upload(req, res, next) {
        try {
            const { file, user: { id } } = req
            const userData = await UserService.updateAvatar(id, file)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.status(201).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async sendMessage(req, res, next) {
        try {
            const { email, activationLink } = req.user
            await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
            return res.status(201).json({messge: 'Activation link successfully sended'})
        } catch (e) {
            next(e)
        }
    }

    async sendVerifyCode(req, res, next) {
        try {
            const { phone } = req.user
            await SmsService.sendVerifyCode(`+7${phone.replace(/\D/g,'')}`)
            return res.status(201).json({messge: 'Verify code successfully sended'})
        } catch (e) {
            next(e)
        }
    }

    async checkVerifyCode(req, res, next) {
        try {
            const { user, body: { code } } = req
            const userData = await UserService.verifyPhone(user, code)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.status(201).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getUsers(req, res, next) {
        try {
            res.json(['User 1', 'User 2'])
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()