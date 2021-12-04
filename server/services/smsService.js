const client = require('twilio')('AC1a0386e4d46e9e4d4f72d8ffaadc8672', '474786ce3b691f9933c9a65a761998ed')
const ApiError = require('../exceptions/apiError')

class SmsService {
    async sendVerifyCode(phone) {
        try {
            const message = await client.verify.services('VAe6b755d167cfb889ca2fe6019725d6ad').verifications.create({
                to: phone,
                channel: 'sms',
            })
        } catch (e) {
            console.log(e)
        }
    }

    async checkVerifyCode(phone, code) {
        try {
            const message = await client.verify.services('VAe6b755d167cfb889ca2fe6019725d6ad').verificationChecks.create({
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