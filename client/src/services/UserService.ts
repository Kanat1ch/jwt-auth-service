import $api from "../http"
import { AxiosResponse } from 'axios'

export default class UserService {
    static fetchUsers(): Promise<AxiosResponse> {
        return $api.get('/users')
    }

    static edit(formData: any): Promise<AxiosResponse> {
        return $api.post('/edit', formData)
    }

    static delete(): Promise<AxiosResponse> {
        return $api.post('/delete')
    }

    static uploadAvatar(data: any): Promise<AxiosResponse> {
        return $api.post('/upload', data, {
            headers: {
                "content-type": "multipart/form-data"
            }
        })
    }

    static async updatePassword(password: string): Promise<AxiosResponse> {
        return $api.post('/update-password', { password })
    }

    static sendActivationMail(): Promise<AxiosResponse> {
        return $api.post('/activate')
    }

    static sendVerificationCode(verifyingService: string): Promise<AxiosResponse> {
        return $api.post('/send-verify', { verifyingService })
    }

    static checkVerificationCode(verifyingService: string, code: string): Promise<AxiosResponse> {
        return $api.post('/check-verify', { verifyingService, code })
    }

    static sendResetCode(verifyingService: string, data: string): Promise<AxiosResponse> {
        return $api.post('/send-reset', { verifyingService, data })
    }

    static checkResetCode(verifyingService: string, data: string, code: string): Promise<AxiosResponse> {
        return $api.post('/check-reset', { verifyingService, data, code })
    }

    static async isPasswordEqual(password: string): Promise<AxiosResponse> {
        return $api.post('/is-password-equal', { password })
    }
}