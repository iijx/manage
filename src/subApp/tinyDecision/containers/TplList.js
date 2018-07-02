import React from 'react';
import { Table } from 'antd';


class UserList extends React.Component {
    constructor() {
        super()
        this.state = {
            tplList: []
        }
    }
    componentDidMount() {
        this.$http.get('/tinydec/api/all_tpls')
            .then(res => {
                this.setState({
                    tplList: res.result.map( item => ({ 
                        id: item._id, 
                        question: item.question,
                        options: item.options,
                        maxLotteryTimes: item.maxLotteryTimes,
                        showOptions: `[ ${item.options.join(' , ')} ]`,
                        userOpenid: item.uid, 
                        created: item.meta.created})
                    )
                })
            })
            .catch(err => console.log(err))
    }


    render() {
        const columns = [
            { title: 'question', dataIndex: 'question', key: 'question'},
            { title: 'options', dataIndex: 'showOptions', key: 'showOptions'},
            { title: 'maxLotteryTimes', dataIndex: 'maxLotteryTimes', key: 'maxLotteryTimes' },
            { title: 'userOpenid', dataIndex: 'userOpenid', key: 'userOpenid',  },
            { title: 'created', dataIndex: 'created', key: 'created',  },
        ];

        return (
            <Table columns={columns} rowKey="id" dataSource={this.state.tplList}/>
        )
    }
}

export default UserList;