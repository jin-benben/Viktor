import React, { PureComponent } from 'react';
import { Card, Button, Form, Row, Input, message, Badge, Modal } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import UEditor from '@/components/Ueditor';
import OrderAttachUpload from '@/components/Modal/OrderAttachUpload';
import Attachment from '@/components/Attachment/other';

const FormItem = Form.Item;

@connect(({ sendEmail, loading }) => ({
  sendEmail,
  loading,
  sendLoading: loading.effects['sendEmail/saveSend'],
  sendAgainLoading: loading.effects['sendEmail/saveAgainSend'],
}))
@Form.create()
class PrintPage extends PureComponent {
  state = {
    sendDetail: {
      TI_Z04702: [],
    }, // 发送内容
    isEdit: false, // 是否可编辑
    isAgain: false, // 是否再次发送
    attachmentVisible: false,
    uploadmodalVisible: false,
    DocEntry: 0, // 发送失败后单号
  };

  componentDidMount() {
    const {
      location: { query },
      dispatch,
    } = this.props;
    if (query.BaseEntry && query.Code) {
      dispatch({
        type: 'sendEmail/getEmail',
        payload: {
          Content: {
            ...query,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            this.setState({
              sendDetail: {
                ...response.Content,
                TI_Z04702: response.Content.TI_Z04702List,
              },
            });
          }
        },
      });
    }
  }

  sendEmailHandle = () => {
    const {
      dispatch,
      location: { query },
      form,
    } = this.props;
    const { sendDetail, isAgain, DocEntry } = this.state;
    const { Code, Name } = query;
    const { BaseEntry, BaseType, HtmlTemplateCode, PaperHTMLString, TI_Z04702 } = sendDetail;

    form.validateFields((err, fieldsValue) => {
      const { HtmlString, Title, ToList, CCList, BccList, From } = fieldsValue;
      if (err) return;
      const sendData = {
        BaseEntry,
        BaseType,
        Body: `${PaperHTMLString + HtmlString}</div>`,
        HtmlTemplateCode,
        From,
        ToList,
        Title,
        CCList,
        BccList,
        EmailTemplateCode: Code,
        EmailTemplateName: Name,
        TI_Z04702,
      };
      if (!isAgain) {
        dispatch({
          type: 'sendEmail/saveSend',
          payload: {
            Content: {
              ...sendData,
            },
          },
          callback: response => {
            if (response && response.Status === 200) {
              message.success('发送成功');
              router.push(`/base/sendEmail/detail?DocEntry=${response.Content.DocEntry}`);
            } else if (response) {
              this.setState({ DocEntry: response.Content.DocEntry, isAgain: true });
            }
          },
        });
      } else {
        dispatch({
          type: 'sendEmail/saveAgainSend',
          payload: {
            Content: {
              ...sendData,
              DocEntry,
            },
          },
          callback: response => {
            if (response && response.Status === 200) {
              message.success('发送成功');
              router.push(`/base/sendEmail/detail?DocEntry=${DocEntry}`);
            }
          },
        });
      }
    });
  };

  handleModalVisible = flag => {
    this.setState({
      attachmentVisible: !!flag,
      uploadmodalVisible: !!flag,
    });
  };

  // 获取上传成功附件，插入到对应数组
  handleSubmit = fieldsValue => {
    const { AttachmentPath, AttachmentCode, AttachmentName, AttachmentExtension } = fieldsValue;
    const { sendDetail } = this.state;
    sendDetail.TI_Z04702.push({
      AttachmentPath,
      AttachmentCode,
      AttachmentName,
      AttachmentExtension,
    });
    this.setState({
      sendDetail: { ...sendDetail },
      uploadmodalVisible: false,
    });
  };

  lookAttach = () => {
    this.setState({
      attachmentVisible: true,
    });
  };

  openUpload = () => {
    this.setState({
      uploadmodalVisible: true,
    });
  };

  sendEmailTestHandle = () => {
    const {
      dispatch,
      location: { query },
      form,
    } = this.props;
    const { sendDetail } = this.state;
    const { Code, Name } = query;
    const { BaseEntry, BaseType, HtmlTemplateCode, PaperHTMLString } = sendDetail;

    form.validateFields((err, fieldsValue) => {
      const { HtmlString, Title, ToList, From } = fieldsValue;
      if (err) return;
      const sendData = {
        BaseEntry,
        BaseType,
        Body: `${PaperHTMLString + HtmlString}</div>`,
        HtmlTemplateCode,
        From,
        ToList,
        Title,
        CCList: '',
        BccList: '',
        EmailTemplateCode: Code,
        EmailTemplateName: Name,
      };
      dispatch({
        type: 'sendEmail/sendTest',
        payload: {
          Content: {
            ...sendData,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('发送成功');
          }
        },
      });
    });
  };

  render() {
    const { sendDetail, isEdit, attachmentVisible, uploadmodalVisible, isAgain } = this.state;
    const {
      form: { getFieldDecorator },
      sendLoading,
      sendAgainLoading,
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
    const formLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
    };
    const uploadmodalMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Card bordered={false}>
        <Form {...formItemLayout}>
          <Row gutter={8}>
            <FormItem key="From" {...formLayout} label="发件人">
              {getFieldDecorator('From', {
                initialValue: sendDetail.From,
                rules: [{ required: true, message: '请输入发件人' }],
              })(<Input placeholder="请输入发件人" />)}
            </FormItem>
          </Row>
          <Row gutter={8}>
            <FormItem key="ToList" {...formLayout} label="收件人">
              {getFieldDecorator('ToList', {
                initialValue: sendDetail.ToList,
                rules: [{ required: true, message: '请输入收件人' }],
              })(<Input placeholder="请输入收件人" />)}
            </FormItem>
          </Row>
          <Row>
            <FormItem key="CCList" {...formLayout} label="抄送人">
              {getFieldDecorator('CCList', {
                initialValue: sendDetail.CCList,
              })(<Input placeholder="请输入抄送人" />)}
            </FormItem>
          </Row>
          <Row>
            <FormItem key="BccList" {...formLayout} label="密抄邮箱">
              {getFieldDecorator('BccList', {
                // rules: [{ required: true, message: '请输入密抄邮箱！' }],
                initialValue: sendDetail.BccList,
              })(<Input placeholder="请输入密抄邮箱" />)}
            </FormItem>
          </Row>

          <Row>
            <FormItem key="Title" {...formLayout} label="主题">
              {getFieldDecorator('Title', {
                rules: [{ required: true, message: '请输入主题！' }],
                initialValue: sendDetail.Title,
              })(<Input placeholder="请输入主题" />)}
            </FormItem>
          </Row>
          <Row>
            <FormItem key="Title" {...formLayout} label="附件">
              <Badge count={sendDetail.TI_Z04702.length} showZero>
                <Button
                  type="primary"
                  shape="circle"
                  onClick={this.openUpload}
                  icon="upload"
                  title="上传附件"
                />
              </Badge>
              <Button
                style={{ marginLeft: 16 }}
                type="primary"
                onClick={this.lookAttach}
                shape="circle"
                icon="eye"
                title="查看附件"
              />
            </FormItem>
          </Row>
          <Row>
            <div style={{ display: isEdit ? 'block' : 'none' }}>
              <FormItem key="HtmlString" {...formLayout} label="内容">
                {getFieldDecorator('HtmlString', {
                  rules: [{ required: true, message: '请输入内容！' }],
                })(<UEditor initialValue={sendDetail.HtmlString} />)}
              </FormItem>
            </div>
            <div style={{ display: !isEdit ? 'block' : 'none' }}>
              <FormItem key="HtmlString" {...formLayout} label="内容">
                <div dangerouslySetInnerHTML={{ __html: sendDetail.HtmlString }} />
              </FormItem>
            </div>
          </Row>
        </Form>
        <FooterToolbar>
          {!isEdit ? (
            <Button onClick={() => this.setState({ isEdit: true })} type="primary">
              编辑内容
            </Button>
          ) : (
            <Button onClick={() => this.setState({ isEdit: false })} type="primary">
              完成
            </Button>
          )}
          {isAgain ? (
            <Button loading={sendAgainLoading} onClick={this.sendEmailHandle} type="primary">
              再次发送
            </Button>
          ) : (
            <Button loading={sendLoading} onClick={this.sendEmailHandle} type="primary">
              保存并发送
            </Button>
          )}
          {/* <Button onClick={this.sendEmailTestHandle} type="primary">
            发送测试
          </Button>
          (发送测试，请注意收件人邮箱) */}
        </FooterToolbar>
        <Modal
          width={960}
          destroyOnClose
          title="物料行附件"
          visible={attachmentVisible}
          onOk={() => this.handleModalVisible(false)}
          onCancel={() => this.handleModalVisible(false)}
        >
          <Attachment dataSource={sendDetail.TI_Z04702} />
        </Modal>
        <OrderAttachUpload {...uploadmodalMethods} modalVisible={uploadmodalVisible} />
      </Card>
    );
  }
}
export default PrintPage;
