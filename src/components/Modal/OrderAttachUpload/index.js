// 单据附件上传

import React, { PureComponent } from 'react';
import { Form, Input, Modal } from 'antd';
import Upload from '@/components/Upload';

const { TextArea } = Input;
const FormItem = Form.Item;

@Form.create()
class OrderAttachUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      AttachmentPath: '',
      AttachmentCode: '',
      AttachmentName: '',
      AttachmentExtension: '',
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  // 文件上传成功后回调
  uploadSuccess = ({ FilePath, FileCode, Extension, FileName }) => {
    this.setState({
      AttachmentPath: FilePath,
      AttachmentCode: FileCode,
      AttachmentName: FileName,
      AttachmentExtension: Extension,
    });
  };

  render() {
    const {
      form,
      form: { getFieldDecorator },
      Folder,
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

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleSubmit({ ...this.state, ...fieldsValue });
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
            <Upload onChange={this.uploadSuccess} Folder={Folder} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
export default OrderAttachUpload;
