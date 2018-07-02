import React from 'react';
import { Table } from 'antd';


class UserList extends React.Component {
    constructor() {
        super()
        this.state = {
            userList: []
        }
    }
    componentDidMount() {
        this._getUserList();
    }
    _getUserList() {
        this.$http.get('/tinydec/api/users')
            .then(res => {
                console.log('users res => ', res)
                this.setState({
                    userList: res.result.map( item => ({ id: item._id, openid: item.openid, created: item.meta.created}))
                })
            })
            .catch(err => console.log(err))
    }


    render() {
        const columns = [
            { title: 'openid', dataIndex: 'openid', key: 'openid'},
            { title: 'createdAt', dataIndex: 'created', key: 'created',  },
        ];

        return (
            <Table columns={columns} rowKey="id" dataSource={this.state.userList}/>
        )
    }
}

export default UserList;