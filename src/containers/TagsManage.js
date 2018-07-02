import React from 'react'
import Axios from 'axios';

import { Card, Radio, Icon, Row, Col, Tag, Button, Modal, Input  } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class TagsManage extends React.Component {
    constructor() {
        super()
        this.state = {
            tags: [],
            isShowAddTagModal: false,
            tagSubmitting: false,
            isShowAddCateModal: false,
            cateSubmitting: false,
            tagNameInput: '',
            curOperateTagType: 'tag', // tag or subtag
            selectedTag: {},
            subtags: [],

        }
    }
    componentDidMount() {
        this._getTags();
    }
    _updateSubtags() {
        if ( this.state.selectedTag._id) {
            const tagObj = this.state.tags.find( item => item.tag === this.state.selectedTag.tag );
            this.setState({
                subtags: tagObj.subtags || []
            })
        }
        else return;
    }
    _getTags() {
        Axios.get('/blog/api/tag')
            .then( res => {
                console.log('get tag res =>', res.data.result instanceof Array);
                if (res.data.result.length > 0) {
                    this.setState({
                        tags: res.data.result || [],
                        selectedTag: res.data.result[0]
                    }, this._updateSubtags)
                }
            })
    }
    hideAddTagModal() {
        this.setState({
            isShowAddTagModal: false,
        })
    }
    showAddTagModal(tag_or_subtag) {

        this.setState({
            isShowAddTagModal: true,
            curOperateTagType: tag_or_subtag
        })
    }
    
    handleTagSubmit() {
        this.setState({
            tagSubmitting: true,
        })
        if ( this.state.curOperateTagType === 'tag' ) {
            Axios.post('/blog/api/tag', { tag: this.state.tagNameInput })
                .then (res => {
                    console.log('post tag res => ',res)
                    if (res.data.success) {
                        this.setState({
                            tagSubmitting: false,
                            tags: res.data.result
                        })
                        this.hideAddTagModal();
                    }
                })
        } else if ( this.state.curOperateTagType === 'subtag' ) {
            Axios.put('/blog/api/tag', {
                id: this.state.selectedTag._id,
                subtags: [...this.state.subtags, this.state.tagNameInput],
            }).then(res => {
                if ( res.data.success ) {
                    this.setState({
                        tags: res.data.result,
                        tagSubmitting: false,
                    }, this._updateSubtags)
                    this.hideAddTagModal();
                }
            })
        }

        
    }
   // 新增 tag 按钮
    handleAddTagBtnClick( tag_or_subtag ) {
        if ( this.state.isShowAddTagModal ) return;
        else this.showAddTagModal(tag_or_subtag);
    }
  
    handleTagNameChange(e) {
        this.setState({
            tagNameInput: e.target.value
        })
    }
    // 切换当前 tag
    handleSelectedTagChange(e) {
        let _selectedTag = this.state.tags.find( item => item._id === e.target.value );
        this.setState({ selectedTag:  _selectedTag }, this._updateSubtags);
    }
    // 删除 tag
    handleDeleteTag() {
        Axios.delete(`/blog/api/tag?id=${this.state.selectedTag._id}`)
            .then( res => {
                if (res.data.success) {
                    this.setState({
                        tags: res.data.result,
                        selectedTag: res.data.result.length > 0 ? res.data.result[0] : {}
                    }, this._updateSubtags)
                } else {
                    console.log('error', res.data)
                }
            })
    }
    render() {
        return (
            <section>
                <Modal title="Modal" visible={this.state.isShowAddTagModal} onOk={this.hideAddTagModal.bind(this)} onCancel={this.hideAddTagModal.bind(this)} okText="确认" cancelText="取消"
                    footer={[
                        <Button key="back" onClick={this.hideAddTagModal.bind(this)}>取消</Button>,
                        <Button key="submit" type="primary" loading={this.state.tagSubmitting} onClick={this.handleTagSubmit.bind(this)}>提交</Button>,
                      ]}
                    >
                    <Input name="tagName" placeholder="请输入标签名称" value={this.state.tagNameInput} onChange={this.handleTagNameChange.bind(this)}/>
                </Modal>
                <Card title="标签管理" extra={<span onClick={ this.handleAddTagBtnClick.bind(this, 'tag') }>新增类目</span>}>
                    <Row  style={{ margin: '30px 0'}}>
                        <Col span={4}>一级标签：</Col>
                        <Col span={18}>
                            {
                                this.state.tags.length > 0 ?
                                    <RadioGroup defaultValue={this.state.selectedTag._id || ''} onChange={this.handleSelectedTagChange.bind(this)} >
                                        {
                                            this.state.tags.map( item => {
                                                return <RadioButton key={item._id} value={item._id}>{item.tag}</RadioButton>
                                            })
                                        }
                                    </RadioGroup>
                                : <div>暂无标签</div>
                            }
                        </Col>
                        <Col span={2}>
                            <Button onClick={this.handleDeleteTag.bind(this)}>删除</Button>
                        </Col>
                    </Row>
                    <Row style={{ margin: '40px 0'}}>
                        <Col span={4}>二级标签：</Col>
                        <Col span={20}>
                        <Icon type="tags" style={{ fontSize: 20, color: '#08c'}}/>
                            <span>&nbsp;:&nbsp;&nbsp;</span>
                            {
                                this.state.subtags.map( item => <Tag key={item} closable="true" >{item}</Tag> )
                            }
                            <Button type="primary" shape="circle" icon="plus" onClick={this.handleAddTagBtnClick.bind(this, 'subtag')}></Button>
                        </Col>
                    </Row>
                    
                </Card>
            </section>
        )
    }
}

export default TagsManage;