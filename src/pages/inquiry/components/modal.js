import React, { PureComponent } from 'react';

import { Icon, Form, Input, Modal, Upload } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;

@Form.create()
class UpdateLoad extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      AttachmentPath: '',
      AttachmentCode: '',
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.response.Status === 200) {
      const { FilePath, FileCode } = info.file.response;
      this.setState({
        AttachmentPath: FilePath,
        AttachmentCode: FileCode,
      });
    }
  };

  clearState = () => {
    this.setState({
      AttachmentPath: '',
      AttachmentCode: '',
    });
  };

  render() {
    const {
      form,
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      handleSubmit,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 10 },
      },
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleSubmit({ ...this.state, ...fieldsValue });
        this.clearState();
      });
    };
    return (
      <Modal
        width={640}
        destroyOnClose
        title="上传附件"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <FormItem key="AttachmentName" {...this.formLayout} label="附件描述">
            {getFieldDecorator('AttachmentName')(<TextArea placeholder="请输入附件描" />)}
          </FormItem>
          <FormItem key="AttachmentPath" {...this.formLayout} label="上传附件">
            <Upload
              action="http://117.149.160.231:9301/MDMPicUpload/PictureUpLoad"
              listType="picture-card"
              data={{ UserCode: 'jinwentao', Folder: 'TI_Z026', Tonken: '22233' }}
              onChange={this.handleChange}
            >
              {uploadButton}
            </Upload>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
export default UpdateLoad;
