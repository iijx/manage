import React from 'react';
import axios from 'axios';

var instance = axios.create({ 
    // baseURL: 'https://www.iijx.site',
    timeout: 20000,
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
    }
});

//请求拦截
// instance.interceptors.request.use( () => {

// })

// 响应拦截
instance.interceptors.response.use( res => {
    console.log('interceptor res', res)
    if (res.status === '401') {
        // BrowserRouter.push('/login')
    }
    return res.data;

}, err => {
    if (err && err.response) {
        switch( err.response.status) {
            case 401: 
                return Promise.reject({error: '请登录后继续'});
            default: return Promise.reject({error: '未知错误'})
        }
    }
    return err;
})



React.Component.prototype.$http = instance;

export default instance;