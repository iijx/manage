import React from 'react'
import { Route, Switch, Link, withRouter, Redirect } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {connect} from 'react-redux';

import TagsManage from './TagsManage';
import ArticleManage from './ArticleManage';
import AddArticle from './AddArticle';
import TinyDecisionIndex from '../subApp/tinyDecision';
const { Sider, Content } = Layout;

class Home extends React.Component {
  
  render() {
    const { auth, match } = this.props;
    if (auth && !auth.isLogin) {
      return <Redirect to={{pathname: '/manage/login', state: { from: this.props.location }}}/>
    }
    return (
        <Layout>
          <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1"><Link to={`${match.url}/tags`}>标签管理</Link></Menu.Item>
              <Menu.Item key="2"><Link to={`${match.url}/article`}>文章管理</Link></Menu.Item>
              <Menu.Item key="3"><Link to={`${match.url}/tinydecision`}>小决定</Link></Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ marginLeft: 200, minHeight: '100vh' }}>
            <Content style={{ margin: '24px 16px 0' }}>
              <Switch>
                <Route path={`${match.url}/tags`} component={TagsManage} />
                <Route path={`${match.url}/article/add`} component={AddArticle} />
                <Route path={`${match.url}/article`} component={ArticleManage} />
                <Route path={`${match.url}/tinydecision`} component={TinyDecisionIndex} />
              </Switch>
            </Content>
          </Layout>
        </Layout>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    auth: state.auth
  }

}

export default withRouter(connect(mapStateToProps, () => { return {}})(Home));