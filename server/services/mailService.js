const nodemailer = require('nodemailer')
const generateCode = require('../lib/code')
const User = require('../models/User')

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to) {
        const code = generateCode(6)
        const user = await User.findOne({ email: to })
        user.code = code
        await user.save()

        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на сайте Auth',
            text: '',
            html: `
                <div style="
                    width: 100%;
                    height: 400px;
                    background-color: #D9AFD9;
                    background-image: linear-gradient(210deg, #D9AFD9 0%, #97D9E1 100%);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                ">
                    <h1 style="color: #eee; font-size: 50px; text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);"><span style="color: #1890ff;">Auth</span>Service</h1>
                    <div style="color: #fff; background-color: #1890ff; font-size: 20px; font-weight: 700; padding: 15px 30px; text-decoration: none; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2)">${code}</div>
                </div>
            `
        })
    }

    async checkVerifyCode(email, code) {
        const user = await User.findOne({ email })

        if (user.code === code) {
            user.code = ''
            await user.save()
            return true
        } else {
            return false
        }
    }
}

module.exports = new MailService()