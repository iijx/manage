import React from 'react';
import { Row, Col } from 'antd';
import '../../styles/Login.css';

import LoginForm from './LoginForm';

class Login extends React.Component {
    render() {
        
        return (
            <Row className="login-page" type="flex" align="middle">
                <Col span="8"></Col>
                <Col span="8">
                    <LoginForm />
                </Col>
                <Col span="8"></Col>
            </Row>
        )
    }
}

export default Login;