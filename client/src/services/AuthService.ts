import $api, { API_URL } from "../http"
import axios, { AxiosResponse } from 'axios'
import { AuthResponse } from "../types/AuthResponse"

export default class AuthService {
    static async login(username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post('/login', { username, password })
    }

    static async registration(username: string, email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post('/registration', { username, email, password })
    }

    static async isExist(dataToValidate: any, currentUserID: string | null = null): Promise<AxiosResponse> {
        return $api.post('/is-exist', { dataToValidate, currentUserID })
    }
    
    static async logout(): Promise<void> {
        return $api.post('/logout')
    }

    static async linked(userData: string): Promise<AxiosResponse> {
        return axios.post('/linked', { userData }, {
            baseURL: API_URL,
        })
    }
}