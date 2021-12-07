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

    static sendActivationMail(): Promise<AxiosResponse> {
        return $api.post('/activate')
    }

    static sendVerificationCode(verifyingService: string): Promise<AxiosResponse> {
        return $api.post('/send-verify', { verifyingService })
    }

    static checkVerificationCode(verifyingService: string, code: string): Promise<AxiosResponse> {
        return $api.post('/check-verify', { verifyingService, code })
    }
}