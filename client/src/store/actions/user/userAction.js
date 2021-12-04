import axios from 'axios'
import { API_URL } from '../../../http'
import AuthService from '../../../services/AuthService'
import UserService from '../../../services/UserService'
import { SET_LOADING, SET_USER, SET_USER_ERRORS, SET_USER_UPDATED, SET_USER_UPDATED_FAILED, UPDATE_USER, INIT_APP, REMOVE_ERRORS } from '../../actionTypes'

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

export function deleteUser() {
    return async (dispatch) => {
        try {
            dispatch(loading('delete'))
            await UserService.delete()
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

export function edit(formData) {
    return async (dispatch) => {
        try {
            dispatch(loading('edit'))
            const response = await UserService.edit(formData)
            localStorage.setItem('token', response.data.accessToken)
            dispatch(editSuccess(response.data))
        } catch (e) {
            dispatch(editFailed(e.response.data, 'error'))
        } finally {
            dispatch(loading(null))
        }
    }
}

export function updateAvatar(image) {
    return async (dispatch) => {
        try {
            const response = await UserService.uploadAvatar(image)
            dispatch(updateUserSuccess(response.data))
        } catch (e) {
            console.log(e)
        }
    }
}

export function sendActivationMail() {
    return async () => {
        try {
            await UserService.sendActivationMail()
        } catch (e) {
            console.log(e)
        }
    }
}

export function sendVerificationCode() {
    return async () => {
        try {
            await UserService.sendVerificationCode()
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

export function editSuccess(user) {
    return {
        type: SET_USER_UPDATED,
        user,
        status: 'edited'
    }
}

export function editFailed(errors, status) {
    return {
        type: SET_USER_UPDATED_FAILED,
        errors,
        status: status
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
        type: SET_USER_ERRORS,
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

export function updateUserSuccess(user) {
    return {
        type: UPDATE_USER,
        user
    }
}

export function setInit(init) {
    return {
        type: INIT_APP,
        init
    }
}

export function removeErrors() {
    return {
        type: REMOVE_ERRORS
    }
}
