import React from 'react'

import { Card, Form, Input, Icon, Button, Upload, message } from 'antd';
const Dragger = Upload.Dragger
const FormItem = Form.Item;
class AddArticle extends React.Component {
    constructor() {
        super();
        this.state = {
            fileList: []
        }
    }
    render() {
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 20 },
            },
          };
          const props = {
            name: 'file',
            multiple: true,
            action: '//jsonplaceholder.typicode.com/posts/',
            onChange(info) {
              const status = info.file.status;
              if (status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
              } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                  fileList: [...fileList, file],
                }));
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    /** SVG 文件内容 */
                    var contents = e.target.result;
                    console.log('contents', contents);
                };
                
                fileReader.readAsText(file);

                return false;
              },
          };
        return (
            <Card title="新建文章">
                <Form onSubmit={this.handleSubmit} style={{ maxWidth: 600}}>
                    <FormItem {...formItemLayout} label="title">
                        <Input />
                    </FormItem>
                    <FormItem {...formItemLayout} label="tags">
                        <Input />
                    </FormItem>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                    </Dragger>
                    <FormItem wrapperCol={{ sm: {span: 24, offset: 0}}} style={{ textAlign: 'center', margin: '20px auto'}}>
                        <Button type="primary" htmlType="submit">submit</Button>
                    </FormItem>
                </Form>
            </Card>
        )
    }
}

export default AddArticle;