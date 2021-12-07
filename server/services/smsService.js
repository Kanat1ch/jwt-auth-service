const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
const ApiError = require('../exceptions/apiError')

class SmsService {
    async sendVerifyCode(phone) {
        try {
            const message = await client.verify.services(process.env.TWILIO_SERVIVE).verifications.create({
                to: phone,
                channel: 'sms',
            })
        } catch (e) {
            console.log(e)
        }
    }

    async checkVerifyCode(phone, code) {
        try {
            const message = await client.verify.services(process.env.TWILIO_SERVIVE).verificationChecks.create({
                to: phone,
                code
            })
            if (!message.valid) {
                return false
            }
            return true
        } catch (e) {
            throw ApiError.BadRequest('Invalid code')
        }
    }
}

module.exports = new SmsService()