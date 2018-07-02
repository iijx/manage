import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from "redux";
import { actions as authAction } from '../../reducers/modules/auth.js';

import { Card, Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

const STATUS = {
    REGISTER: 'register',
    LOGIN: 'login'
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            redirectToReferrer: false, // 是否从重定向到之前的页面
            status: STATUS.LOGIN,
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log('nextprops', nextProps)
        const isLoggedIn = !!nextProps.token;
        if (isLoggedIn) {
            this.setState({
                redirectToReferrer: true
            });
        }
    }
    _login() {
        this.$http.post('/tinydec/api/admin_login', {
            username: this.state.username,
            password: this.state.password
        }).then(res => {
            console.log(res)
            if (res.success) {
                localStorage.setItem('token', res.result.token);

            }
            // let result = res.data;
            // if (result.success) {
            //    localStorage.setItem('token', result.token);
            //    this.setState({
            //        redirectToReferrer: true
            //    })
            // } 
        })
    }
    _register() {
        this.$http.post('/tinydec/api/admin_register', {
            username: this.state.username,
            password: this.state.password
        }).then(res => {
            console.log('register res:', res);
        })
    }
    switchRegisterOrLogin() {
        if (this.state.status === STATUS.REGISTER) {
            this.setState({
                status: STATUS.LOGIN
            })
        } else if (this.state.status === STATUS.LOGIN) {
            this.setState({
                status: STATUS.REGISTER
            })
        }
    }
    inputChange(e) {
        if (e.target.name === 'username') {
            this.setState({
                username: e.target.value
            })
        }

        else if (e.target.name === 'password') {
            this.setState({
                password: e.target.value
            })
        }
    }

    submitBtn() {
        if (this.state.status === STATUS.LOGIN) {
            // this._login()
            this.props.login(this.state.username, this.state.password);
        }

        else if (this.state.status === STATUS.REGISTER) {
            this._register();
        }
    }
    render() {
        console.log('loginfrom props', this.props)
        const { from } = this.props.location.state || { from: { pathname: "/" } };
        const title = this.state.status === STATUS.LOGIN ? '登录' : '注册';
        if (this.state.redirectToReferrer) {
            return <Redirect to={from} />
        }
        return (
            <Card title={title}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} name="username" type="text" value={this.state.username} onChange={this.inputChange.bind(this)} placeholder="Username" />
                    </FormItem>
                    <FormItem>
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} name="password" type="password" value={this.state.password} onChange={this.inputChange.bind(this)} placeholder="Password" />
                    </FormItem>
                    <FormItem>
                        <Checkbox>Remember me</Checkbox>
                        {/* <a className="login-form-forgot" href="">Forgot password</a> */}
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }} onClick={this.submitBtn.bind(this)}>{title}</Button>
                        Or <a href="javascript:;" onClick={this.switchRegisterOrLogin.bind(this)}>{this.state.status === STATUS.LOGIN ? 'register now!' : 'Login'}</a>
                    </FormItem>
                </Form>
            </Card>
        );
    }
}


const mapStateToProps = ( state, props ) => {
    return state.auth;
} 

const mapDispatchToProps = dispatch => {
    return {
        ...bindActionCreators(authAction, dispatch)
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm));