const Router = require('express').Router
const userController = require('../controllers/userController')
const router = new Router()
const authMiddleware = require('../middlewares/auth')
const uploadMiddleware = require('../middlewares/upload')

router.post('/registration',userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/activate', authMiddleware, userController.sendMessage)
router.post('/upload', authMiddleware, uploadMiddleware.single('avatar'), userController.upload)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

module.exports = router