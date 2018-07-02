import React from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Radio, Row, Col, Checkbox, Table, Switch } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class ArticleManage extends React.Component {
    constructor() {
        super()
        this.state = {
            tags: [],
            subtags: [],
            subtagsChecked: [],
            isCheckedAll: false,
            columns: [
                { title: 'title', dataIndex: 'title', key: 'title'},
                { title: 'viewed', dataIndex: 'view', key: 'viewed'},
                { title: 'isShow', dataIndex: 'isShow', key: 'isShow', render: (isShow) => <Switch checked={isShow} /> },
                { title: 'action', key: 'action', render: (text, record, index) => (<a href="javascript:;" onClick={this.deleteBtn.bind(this, record, index)}>Delete</a>) }
            ],
            articleList: []
        }
    }
    componentDidMount() {
        this._getTags();
        this._getArticleList();
    }
    
    _getArticleList() {
        Axios.get('/blog/api/article')
            .then(res => {
                console.log('get articlelist res =>', res.data.result instanceof Array);
                if (res.data.result.length > 0) {
                    this.setState({
                        articleList: res.data.result,
                        // tags: res.data.result || [],
                        // selectedTag: res.data.result[0].tag
                    })
                }
            })
    }
    _getTags() {
        Axios.get('/blog/api/tag')
            .then(res => {
                console.log('get tag res =>', res.data.result instanceof Array);
                if (res.data.result.length > 0) {
                    this.setState({
                        tags: res.data.result || [],
                        selectedTag: res.data.result[0].tag
                    })
                }
            })
    }
    handleSubtagsCheckedChange() {

    }
    deleteBtn(item, index) {
        Axios.delete(`/blog/api/article?id=${item._id}`)
            .then( res => {
                console.log(res);
                if (res.data.success) {
                    console.log(index);
                    let _articleList = [...this.state.articleList]
                    _articleList.splice(index, 1)
                    this.setState({
                        articleList: _articleList
                    })
                }
            })
    }
    handleCheckedAll() {

    }
    render() {
        return (
            <section>
                <Card title="文章管理" extra={<Link to="/manage/article/add">新建文章</Link>}>
                    <Row  style={{ margin: '30px 0'}}>
                        <Col span={4}>一级标签：</Col>
                        <Col span={20}>
                            <RadioGroup>
                                <RadioButton key={0} value='全部'>全部</RadioButton>
                                {
                                    this.state.tags.map(item => {
                                        return <RadioButton key={item.tag} value={item.tag}>{item.tag}</RadioButton>
                                    })
                                }
                            </RadioGroup>
                        </Col>
                    </Row>
                    <Row style={{ margin: '40px 0'}}>
                        <Col span={4}>二级标签：</Col>
                        <Col span={20}>
                            <Checkbox onChange={this.handleCheckedAll.bind(this)} checked={this.state.isCheckedAll}>Check all</Checkbox>
                            <CheckboxGroup options={this.state.subtags} value={this.state.subtagsChecked} onChange={this.handleSubtagsCheckedChange.bind(this)} />
                        </Col>
                    </Row>
                    <Table columns={this.state.columns} rowKey="_id" dataSource={this.state.articleList}/>
                </Card>
            </section>
        )
    }
}

export default ArticleManage;