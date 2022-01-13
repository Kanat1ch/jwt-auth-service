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

    async sendVerifyCode(req, res, next) {
        try {
            const { verifyingService } = req.body
            const { email, phone } = req.user

            let data = null
            switch (verifyingService) {
                case 'email':
                    data = email
                    break
                case 'phone':
                    data = phone
                    break
            }

            await UserService.sendCode(verifyingService, data)
            return res.status(201).json({ messge: 'Verify code successfully sended' })
        } catch (e) {
            next(e)
        }
    }

    async checkVerifyCode(req, res, next) {
        try {
            const { user, body: { verifyingService, code } } = req
            const userData = await UserService.verifyCode(verifyingService, user, code)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.status(201).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async isPasswordEqual(req, res, next) {
        try {
            const { body: {password}, user: {id} } = req
            await UserService.isPasswordEqual(id, password)
            return res.status(201).json('Password is valid')
        } catch (e) {
            next(e)
        }
    }

    async updatePassword(req, res, next) {
        try {
            const { body: {password}, user: {id} } = req
            await UserService.updatePassword(id, password)
            return res.status(201).json({ message: 'Password has been successfully changed' })
        } catch (e) {
            next(e)
        }
    }

    async linked(req, res, next) {
        try {
            const { userData } = req.body
            const linked = await UserService.linked(userData)
            return res.status(201).json({ linked })
        } catch (e) {
            next(e)
        }
    }

    async sendResetCode(req, res, next) {
        try {
            const { verifyingService, data } = req.body

            await UserService.sendCode(verifyingService, data)
            return res.status(201).json({ messge: 'Reset code successfully sended' })
        } catch (e) {
            next(e)
        }
    }

    async checkResetCode(req, res, next) {
        try {
            const { verifyingService, data, code } = req.body

            const userData = await UserService.checkResetCode(verifyingService, data, code)
            return res.status(201).json(userData)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()