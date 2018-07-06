import React from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Radio, Row, Col, Checkbox, Table, Switch, Select, Icon, Modal, Divider } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

class ArticleManage extends React.Component {
    constructor() {
        super()
        this.state = {
            tags: [],
            filterInfo: {
                tag: {},
                subtags: [],
            },
            columns: [
                { title: 'title', dataIndex: 'title', key: 'title' },
                { title: 'viewed', dataIndex: 'view', key: 'viewed' },
                { title: 'isShow', dataIndex: 'isShow', key: 'isShow', render: (isShow) => <Switch checked={isShow} /> },
                { title: 'tag', dataIndex: 'tag', key: 'tag', render: (record, index) => record ? (<span>{record.tag}</span>) : <Icon type="plus" /> },
                { title: 'subtags', dataIndex: 'subtags', key: 'subtags', render: (text, record, index) => (<span>{text || '/'}</span>) },
                {
                    title: 'action', key: 'action', render: (text, record, index) => (
                        <span>
                            <a href="javascript:;" onClick={this.deleteBtn.bind(this, record, index)}>Delete</a>
                            <Divider type="vertical" />
                            <a href="javascript:;" onClick={this.setTagForItem.bind(this, index)}>SetTag</a>
                        </span>
                    )
                },
            ],
            articleList: [],
            isShowTagSetModal: false,
            curOperatingItemIndex: -1, // 正在操作项（这里为某篇文章）
            setTagModal: {
                tag: {},
                subtags: []

            }
        }
    }
    componentDidMount() {
        this._loadData();
        this._getTags();
        this._getArticleList();
    }
    _loadData() {
        Promise.all([this._getArticleList(), this._getTags()])
            .then(res => {
                console.log('all res', res)
                let articleList = res[0];
                let tags = res[1];
                articleList.forEach(article => {
                    article.tag = tags.find(tag => tag.id === article.tag)
                });
                this.setState({
                    articleList,
                    tags,
                    filterInfo: { tag: tags[0] || {}, subtags: [] }
                })
            })
    }
    articleFormat(item) {
        return {
            id: item._id,
            html: item.html,
            createdTime: item.cteatedTime,
            updatedTime: item.updatedTime,
            isShow: item.isShow,
            title: item.title,
            tag: item.tag,
            subtags: item.subtags,
        }
    }
    _getArticleList() {
        return Axios.get('/blog/api/article')
            .then(res => {
                console.log('get articlelist res =>', res.data.result instanceof Array);
                if (res.data.result.length > 0) {
                    return res.data.result.map(this.articleFormat);
                } else return []
            })
    }
    _getTags() {
        return Axios.get('/blog/api/tag')
            .then(res => {
                console.log('get tag res =>', res.data.result instanceof Array);
                if (res.data.result.length > 0) {
                    return res.data.result.map(item => ({
                        id: item._id,
                        tag: item.tag,
                        subtags: item.subtags,
                    }));
                } else return []
            })
    }
    handleSubtagsCheckedChange() {

    }
    deleteBtn(item, index) {
        Axios.delete(`/blog/api/article?id=${item._id}`)
            .then(res => {
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
    hideTagSetModal() {
        if (this.state.isShowTagSetModal) {
            this.setState({ isShowTagSetModal: false })
        }
    }
    setTagForItem(index) {
        const item = { ...this.state.articleList[index] };

        this.setState({
            isShowTagSetModal: true,
            curOperatingItemIndex: index,
            setTagModal: {
                tag: item.tag || {},
                subtags: item.subtags || []
            }
        })
    }

    getSubtagsByTag(id) {
        if (!id) return [];
        return this.state.tags.find(item => item.id === id).subtags;
    }
    setTagModal_tagChange(e) {
        const tagItem = { ...this.state.tags.find(item => item.id === e.target.value) };
        this.setState({
            setTagModal: { tag: { id: tagItem.id, tag: tagItem.tag }, subtags: [] }
        })
    }
    setTagModal_subtagsChange(_subtags) {
        this.setState({
            setTagModal: { ...this.state.setTagModal, subtags: _subtags }
        })
    }
    tagSubmit() {
        // 检查是否变化
        let article = this.state.articleList[this.state.curOperatingItemIndex];
        console.log(article)
        let { tag, subtags } = this.state.setTagModal;
        if (article.tag && article.tag.id === tag.id && article.subtags.length === subtags.length && (() => {
            for (let i = 0; i < subtags.length; i++) {
                if (subtags[i] !== article.subtags[i]) return false;
            }
            return true;
        })) {
            console.log('没有变化')
            this.setState({ isShowTagSetModal: false })
        } else {
            let index = this.state.curOperatingItemIndex;
            Axios.post('/blog/api/article_update', {
                id: this.state.articleList[this.state.curOperatingItemIndex].id,
                tag: this.state.setTagModal.tag.id,
                subtags: this.state.setTagModal.subtags,
            }).then(res => {
                console.log(res);
                if (res.data.success) {
                    let _result = this.articleFormat(res.data.result);
                    _result.tag = this.state.tags.find(item => item.id === _result.tag);
                    let _articleList = [...this.state.articleList];
                    _articleList[index] = _result;
                    this.setState({
                        isShowTagSetModal: false,
                        articleList: _articleList,
                    })
                }
            })
        }
    }
    filter_tagChange(e) {
        let tagid = e.target.value;
        let { id, tag, subtags } = this.state.tags.find(item => item.id === tagid);
        this.setState({
            filterInfo: {
                tag: { id, tag },
                subtags
            }
        })
    }
    render() {
        return (
            <section>
                <Modal title="设置标签" closable={false} destroyOnClose={true} maskClosable={false} visible={this.state.isShowTagSetModal} onCancel={this.hideTagSetModal.bind(this)} onOk={this.tagSubmit.bind(this)}>
                    <Row>
                        <Col span="4">目录: </Col>
                        <Col span="20">
                            <RadioGroup value={this.state.setTagModal.tag.id || ''} onChange={this.setTagModal_tagChange.bind(this)}>
                                {
                                    this.state.tags.map(item => {
                                        return <RadioButton key={item.id} value={item.id}>{item.tag}</RadioButton>
                                    })
                                }
                            </RadioGroup>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col span="4">标签: </Col>
                        <Col span="20">
                            <CheckboxGroup options={this.getSubtagsByTag.bind(this, this.state.setTagModal.tag.id)()} value={this.state.setTagModal.subtags} onChange={this.setTagModal_subtagsChange.bind(this)} />
                        </Col>
                    </Row>
                </Modal>
                <Card title="文章管理" extra={<Link to="/manage/article/add">新建文章</Link>}>
                    <Row style={{ margin: '30px 0' }}>
                        <Col span={4}>一级标签：</Col>
                        <Col span={20}>
                            <RadioGroup defaultValue="" onChange={this.filter_tagChange.bind(this)}>
                                {
                                    this.state.tags.map(item => {
                                        return <RadioButton key={item.id} value={item.id}>{item.tag}</RadioButton>
                                    })
                                }
                            </RadioGroup>
                        </Col>
                    </Row>
                    <Row style={{ margin: '40px 0' }}>
                        <Col span={4}>二级标签：</Col>
                        <Col span={20}>
                            <CheckboxGroup options={this.getSubtagsByTag.bind(this, this.state.filterInfo.tag.id || '')()} value={this.state.filterInfo.subtags} onChange={this.handleSubtagsCheckedChange.bind(this)} />
                        </Col>
                    </Row>
                    <Table pagination={{ pageSize: 20 }} columns={this.state.columns} rowKey="id" dataSource={this.state.articleList} />
                </Card>
            </section>
        )
    }
}

export default ArticleManage;