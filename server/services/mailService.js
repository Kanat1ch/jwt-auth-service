const nodemailer = require('nodemailer')

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

    async sendActivationMail(to, link) {
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
                    <a style="color: #fff; background-color: #1890ff; font-size: 20px; font-weight: 700; padding: 15px 30px; text-decoration: none; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2)" href="${link}">Активировать аккаунт</a>
                </div>
            `
        })
    }
}

module.exports = new MailService()