import $api from "../http"
import { AxiosResponse } from 'axios'

export default class UserService {
    static fetchUsers(): Promise<AxiosResponse> {
        return $api.get('/users')
    }
}