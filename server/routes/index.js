const Router = require('express').Router
const userController = require('../controllers/userController')
const router = new Router()
const authMiddleware = require('../middlewares/auth')
const uploadMiddleware = require('../middlewares/upload')

router.post('/registration',userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/is-exist', userController.isExist)
router.post('/send-verify', authMiddleware, userController.sendVerifyCode)
router.post('/check-verify', authMiddleware, userController.checkVerifyCode)
router.post('/send-reset', userController.sendResetCode)
router.post('/check-reset', userController.checkResetCode)
router.post('/edit', authMiddleware, userController.edit)
router.post('/is-password-equal', authMiddleware, userController.isPasswordEqual)
router.post('/update-password', authMiddleware, userController.updatePassword)
router.post('/upload', authMiddleware, uploadMiddleware.single('avatar'), userController.upload)
router.post('/delete', authMiddleware, userController.delete)
router.post('/linked', userController.linked)
router.get('/refresh', userController.refresh)

module.exports = router