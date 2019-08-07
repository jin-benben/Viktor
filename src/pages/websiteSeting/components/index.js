// 单据附件上传

import React, {Component } from 'react';
import { Form, Input, Modal,Switch } from 'antd';
import {connect} from 'dva'
import MDMCommonality from '@/components/Select';
import Upload from './upload';

const { TextArea } = Input;
const FormItem = Form.Item;

@connect(({  global }) => ({
  global
}))
@Form.create()
class OrderAttachUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataItem:{
        Type: "",
        IsShow: "",
        Code: "",
        CoverPicture:"",
        AttachmentName: "",
        AttachmentPath: "",
        AttachmentExtension: ""
      }
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentWillReceiveProps(nextProps){
     const {dataItem}=this.props
     if(nextProps.dataItem!==dataItem){
       this.setState({
         dataItem:{
           ...nextProps.dataItem
         }
       })
     }
  }

  // 文件上传成功后回调
  uploadSuccess = fileList => {
    const {dataItem}=this.state
    if(fileList.length){
      const { FilePath, FileCode, Extension, FileName } = fileList[0].response;
      Object.assign(dataItem,{
        AttachmentPath: FilePath,
        Code: FileCode,
        AttachmentName: FileName,
        AttachmentExtension: Extension,
      })
      this.setState({dataItem});
    }
  };

  coverPictureUpload = fileList => {
    const {dataItem}=this.state
    if(fileList.length){
      const { FilePath } = fileList[0].response;
      Object.assign(dataItem,{
        CoverPicture: FilePath,
      })
      this.setState({dataItem});
    }
   
  };

  

  render() {
    const {
      form,
      form: { getFieldDecorator },
      Folder,
      modalVisible,
      handleModalVisible,
      handleSubmit, global: { TI_Z01802 }
    } = this.props;
    const { dataItem } = this.state;
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
        handleSubmit({...dataItem,...fieldsValue,IsShow:fieldsValue.IsShow?"Y":"N"});
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
          <FormItem key="IsShow" {...this.formLayout} label="是否开启">
            {getFieldDecorator('IsShow', {
              initialValue: dataItem.IsShow === 'Y',
              valuePropName: 'checked',
            })(<Switch />)}
          </FormItem>
          <FormItem key="Type" {...this.formLayout} label="分类">
            {getFieldDecorator('Type',{initialValue:dataItem.Type})(<MDMCommonality initialValue={dataItem.Type} data={TI_Z01802} />)}
          </FormItem>
          <FormItem key="AttachmentName" {...this.formLayout} label="附件描述">
            {getFieldDecorator('AttachmentName', { initialValue: dataItem.AttachmentName })(
              <TextArea placeholder="请输入附件描" />
            )}
          </FormItem>
          <FormItem key="AttachmentPath" {...this.formLayout} label="上传附件">
            <Upload onChange={this.uploadSuccess} Folder={Folder} />
          </FormItem>
          {
             Folder==="TI_Z056"?(
              <FormItem key="CoverPicture" {...this.formLayout} label="图片">
                <Upload onChange={this.coverPictureUpload} Folder={Folder} />
              </FormItem>
             ):""
          }
        </Form>
      </Modal>
    );
  }
}
export default OrderAttachUpload;
