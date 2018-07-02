
import url from '../../utils/url';
import $http from '../../utils/request';

const initValue = (() => {
    let token = localStorage.getItem('token') || '';
    if (token) {
        return {
            username: localStorage.getItem('username') || '',
            isLogin: true,
            token,
        }
    } else return {
        isLogin: false,
        token: '',
        username: ''
    }
})();

// actionTypes
export const types = {
    LOGIN: 'auth_login',
    LOGOUT: 'auth_logout'
}

// action
export const actions = {
    _login: (obj) => ({
        type: types.LOGIN,
        token: obj.token,
        username: obj.username,
    }),
    login: (username, password) => {
        return dispatch => {
            return $http.post( url.login(), { username, password }).then(res => {
                localStorage.setItem('token', res.result.token);
                localStorage.setItem('username', res.result.username);
                dispatch(actions._login(res.result))
            })

        }
    }
}

// reducer
export default (state = initValue, action) => {
    
    switch( action.type ) {

        case types.LOGIN:
            return {...state, isLogin: true, token: action.token};
            
        case types.LOGOUT:
            return { ...state, isLogin: false, token: ''}

        default: return state;
    }
}