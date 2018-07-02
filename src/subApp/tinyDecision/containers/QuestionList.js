import React from 'react';
import { Table } from 'antd';


class UserList extends React.Component {
    constructor() {
        super()
        this.state = {
            questionList: []
        }
    }
    componentDidMount() {
        this.$http.get('/tinydec/api/all_questions')
            .then(res => {
                console.log('users res => ', res)
                this.setState({
                    questionList: res.result.map( item => ({ 
                        id: item._id, 
                        question: item.question,
                        options: item.options,
                        showOptions: `[ ${item.options.join(' , ')} ]`,
                        isResolved: item.isResolved + '',
                        resolvedValue: item.resolvedValue,
                        userOpenid: item.uid, 
                        resolvedTime: item.resolvedTime,
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
            { title: 'isResolved', dataIndex: 'isResolved', key: 'isResolved' },
            { title: 'resolvedValue', dataIndex: 'resolvedValue', key: 'resolvedValue' },
            { title: 'userOpenid', dataIndex: 'userOpenid', key: 'userOpenid',  },
            { title: 'created', dataIndex: 'created', key: 'created',  },
        ];

        return (
            <Table columns={columns} rowKey="id" dataSource={this.state.questionList}/>
        )
    }
}

export default UserList;