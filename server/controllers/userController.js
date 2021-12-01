const UserService = require('../services/userService')
const ApiError = require('../exceptions/apiError')

class UserController {
    async registration(req, res, next) {
        try {
            const { username, email, password } = req.body

            const userData = await UserService.registration(username, email, password)

            if (userData.errors) {
                throw ApiError.BadRequest('Authorization error', userData.errors)
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

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await UserService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
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

    async upload(req, res, next) {
        try {
            const { file, user: { id } } = req
            const avatar = await UserService.updateAvatar(id, file)
            return res.status(201).json(avatar)
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