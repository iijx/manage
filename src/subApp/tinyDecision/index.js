import React from 'react';
import { Card, Tabs , Modal, Input} from 'antd';

import UserList from './containers/UserList';
import QuestionList from './containers/QuestionList';
import TplList from './containers/TplList';

const TabPane = Tabs.TabPane;


class TinyDecisionIndex extends React.Component {
    constructor() {
        super()
        this.state = {
            isShowLoginModal: false,
            userName: '',
            password: ''
        }
    }
    componentDidMount() {

    }
    loginBtn() {
        this.setState({
            isShowLoginModal: true,
        })
    }
    hideLoginModal() {
        this.setState({
            isShowLoginModal: false,
        })
    }
    login() {

    }
    userNameChange() {

    }

    render() {
        return (
            <section>
                <Modal title="Modal" visible={this.state.isShowLoginModal} onOk={this.login.bind(this)} onCancel={this.hideLoginModal.bind(this)} okText="确认" cancelText="取消">
                    <Input name="userName" placeholder="请输入用户名" value={this.state.userName} onChange={this.userNameChange.bind(this)}/>
                    <Input name="password" placeholder="请输入密码" value={this.state.password} onChange={this.userNameChange.bind(this)}/>
                </Modal>
                <Card title="小决定管理" extra={<span onClick={ this.loginBtn.bind(this) }>登录</span>}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="用户列表" key="1">
                            <UserList />
                        </TabPane>
                        <TabPane tab="问题列表" key="2">
                            <QuestionList />
                        </TabPane>
                        <TabPane tab="模板列表" key="3">
                            <TplList />
                        </TabPane>
                    </Tabs>
                </Card>
            </section>
        )
    }
}

export default TinyDecisionIndex;