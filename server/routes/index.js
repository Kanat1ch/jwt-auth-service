const Router = require('express').Router
const userController = require('../controllers/userController')
const router = new Router()
const authMiddleware = require('../middlewares/auth')
const uploadMiddleware = require('../middlewares/upload')

router.post('/registration',userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/is-exist', userController.isExist)
router.post('/activate', authMiddleware, userController.sendMessage)
router.post('/send-verify', authMiddleware, userController.sendVerifyCode)
router.post('/check-verify', authMiddleware, userController.checkVerifyCode)
router.post('/edit', authMiddleware, userController.edit)
router.post('/upload', authMiddleware, uploadMiddleware.single('avatar'), userController.upload)
router.post('/delete', authMiddleware, userController.delete)
router.get('/activate/:link', userController.verifyEmail)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

module.exports = router