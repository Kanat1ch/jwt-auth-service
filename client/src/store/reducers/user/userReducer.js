import { SET_LOADING, SET_USER, SET_ERRORS, SET_AVATAR, SET_INIT } from '../../actionTypes'

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
        case SET_INIT:
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
        case SET_ERRORS:
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
        case SET_AVATAR:
            return {
                ...state,
                user: {
                    ...state.user,
                    data: {
                        ...state.user.data,
                        image: action.image
                    }
                }
            }
        default:
            return state
    }
}