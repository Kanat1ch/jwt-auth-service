import $api from "../http"
import { AxiosResponse } from 'axios'

export default class UserService {
    static fetchUsers(): Promise<AxiosResponse> {
        return $api.get('/users')
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
}