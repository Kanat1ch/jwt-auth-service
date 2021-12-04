import { SET_LOADING, SET_USER, SET_USER_ERRORS, UPDATE_USER, INIT_APP, SET_USER_UPDATED, SET_USER_UPDATED_FAILED, REMOVE_ERRORS } from '../../actionTypes'

const initialState = {
    init: false,
    user: {},
    isAuth: false,
    errors: {},
    status: '',
    loadingComponent: null,
};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case INIT_APP:
        return {
            ...state,
            init: action.init
        }
        case SET_USER:
            return {
                ...state,
                user: action.user,
                isAuth: action.isAuth,
                errors: {},
                status: action.status,
            }
        case SET_USER_UPDATED:
            return {
                ...state,
                user: action.user,
                errors: {},
                status: action.status,
            }
        case SET_USER_UPDATED_FAILED:
                return {
                    ...state,
                    errors: action.errors,
                    status: action.status
                }
        case SET_USER_ERRORS:
            return {
                ...state,
                user: {},
                isAuth: action.isAuth,
                errors: action.errors,
                status: action.status
            }
        case SET_LOADING:
            return {
                ...state,
                loadingComponent: action.loading,
            }
        case UPDATE_USER:
            return {
                ...state,
                user: action.user,
            }
        case REMOVE_ERRORS:
            return {
                ...state,
                errors: {},
                status: ''
            }
        default:
            return state
    }
}