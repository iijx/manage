import * as ActionTypes from './types.js';

export default {
    login: (token) => {
        return {
            type: ActionTypes.LOGIN,
            token,
        }
    },
    logout: () => {
        return {
            type: ActionTypes.LOGOUT
        }
    }
}