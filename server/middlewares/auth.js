const ApiError = require('../exceptions/apiError')
const TokenService = require('../services/tokenService')

module.exports = function (req, res, next) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            next(ApiError.UnauthorizedError())
        }

        const accessToken = authHeader.split(' ')[1]
        if (!accessToken) {
            next(ApiError.UnauthorizedError())
        }

        const userData = TokenService.validateAccessToken(accessToken)
        if (!userData) {
            next(ApiError.UnauthorizedError())
        }

        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}