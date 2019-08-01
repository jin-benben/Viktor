// 单据附件上传

import React, { PureComponent } from 'react';
import { Form, Input, Modal } from 'antd';
import Upload from './upload';

const { TextArea } = Input;
const FormItem = Form.Item;

@Form.create()
class OrderAttachUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      attachmentList: [],
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  // 文件上传成功后回调
  uploadSuccess = fileList => {
    this.setState({
      attachmentList: fileList,
      attachmentName:fileList[0].response.FileName
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
    const { attachmentList,attachmentName } = this.state;
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
        if (err || !attachmentList.length) return;
        const { AttachmentName } = fieldsValue;
        const newattachmentList = attachmentList.map(file => {
          const { FilePath, FileCode, Extension,FileName } = file.response;
          return {
            AttachmentPath: FilePath,
            AttachmentCode: FileCode,
            AttachmentName:AttachmentName||FileName,
            AttachmentExtension: Extension,
          };
        });
        handleSubmit(newattachmentList);
      });
    };
    return (
      <Modal
        width={640}
        maskClosable={false}
        destroyOnClose
        title="上传附件"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <FormItem key="AttachmentName" {...this.formLayout} label="附件描述">
            {getFieldDecorator('AttachmentName',{initialValue:attachmentName})(<TextArea placeholder="请输入附件描" />)}
          </FormItem>
          <FormItem key="AttachmentPath" {...this.formLayout} label="上传附件">
            <Upload multiple onChange={this.uploadSuccess} Folder={Folder} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
export default OrderAttachUpload;
