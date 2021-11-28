const Router = require('express').Router
const userController = require('../controllers/userController')
const router = new Router()
const authMiddleware = require('../middlewares/auth')

router.post('/registration',userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

module.exports = router