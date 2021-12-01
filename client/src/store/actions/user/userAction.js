import axios from 'axios'
import { API_URL } from '../../../http'
import AuthService from '../../../services/AuthService'
import UserService from '../../../services/UserService'
import { SET_LOADING, SET_USER, SET_ERRORS, SET_AVATAR, SET_INIT } from '../../actionTypes'

export function login(username, password) {
    return async (dispatch) => {
        try {
            dispatch(loading('login'))
            const response = await AuthService.login(username, password)
            localStorage.setItem('token', response.data.accessToken)
            dispatch(loginSuccess(response.data))
        } catch (e) {
            dispatch(authFailed(e.response.data, 'error'))
        } finally {
            dispatch(loading(null))
        }
    }
}

export function registration(username, email, password) {
    return async (dispatch) => {
        try {
            dispatch(loading('registration'))
            const response = await AuthService.registration(username, email, password)
            localStorage.setItem('token', response.data.accessToken)
            dispatch(loginSuccess(response.data))
        } catch (e) {
            dispatch(authFailed(e.response.data, 'error'))
        } finally {
            dispatch(loading(null))
        }
    }
}

export function logout() {
    return async (dispatch) => {
        try {
            dispatch(loading('logout'))
            await AuthService.logout()
            localStorage.removeItem('token')
            dispatch(logoutSuccess())
        } catch (e) {
            console.log(e)
        } finally {
            dispatch(loading(null))
        }
    }
}

export function isAuth() {
    return async (dispatch) => {
        try {
            dispatch(loading('auth'))
            const response = await axios.get(`${API_URL}/refresh`, { withCredentials: true })
            localStorage.setItem('token', response.data.accessToken)
            dispatch(loginSuccess(response.data))
        } catch (e) {
            dispatch(authFailed(e.response.data, 'unauthorized'))
        } finally {
            dispatch(loading(null))
            dispatch(setInit(true))
        }
    }
}

export function updateAvatar(image) {
    return async (dispatch) => {
        try {
            const response = await UserService.uploadAvatar(image)
            dispatch(updateAvatarSuccess(response.data.file.filename))
        } catch (e) {
            console.log(e)
        }
    }
}

export function loginSuccess(user) {
    return {
        type: SET_USER,
        user,
        isAuth: true,
        status: 'success'
    }
}

export function logoutSuccess() {
    return {
        type: SET_USER,
        user: {},
        isAuth: false,
        status: 'success'
    }
}

export function authFailed(errors, status) {
    return {
        type: SET_ERRORS,
        errors,
        isAuth: false,
        status: status
    }
}

export function loading(loadingComponent) {
    return {
        type: SET_LOADING,
        loading: loadingComponent
    }
}

export function updateAvatarSuccess(image) {
    return {
        type: SET_AVATAR,
        image
    }
}

export function setInit(init) {
    return {
        type: SET_INIT,
        init
    }
}
