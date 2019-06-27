import React, { PureComponent } from 'react';
import { Card, Button, Form, Row, Input, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import UEditor from '@/components/Ueditor';

const FormItem = Form.Item;

@connect(({ sendEmail, loading }) => ({
  sendEmail,
  loading,
}))
@Form.create()
class PrintPage extends PureComponent {
  state = {
    sendDetail: {}, // 发送内容
    isEdit: false, // 是否可编辑
    isAgain: false, // 是否再次发送
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
      });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.sendEmail.sendDetail !== prevState.sendDetail) {
      return {
        sendDetail: nextProps.sendEmail.sendDetail,
      };
    }
    return null;
  }

  sendEmailHandle = () => {
    const {
      dispatch,
      location: { query },
      form,
    } = this.props;
    const { sendDetail, isAgain, DocEntry } = this.state;
    const { Code, Name } = query;
    const { BaseEntry, BaseType, HtmlTemplateCode, PaperHTMLString } = sendDetail;

    form.validateFields((err, fieldsValue) => {
      const { HtmlString, Title, ToList, CCList, From } = fieldsValue;
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
        EmailTemplateCode: Code,
        EmailTemplateName: Name,
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
              router.push(`/base/sendEmail/detail?DocEntry=${response.Content.DocEntry}`);
            }
          },
        });
      }
    });
  };

  render() {
    const { sendDetail, isEdit } = this.state;
    const {
      form: { getFieldDecorator },
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
                rules: [{ required: true, message: '请输入抄送人！' }],
                initialValue: sendDetail.CCList,
              })(<Input placeholder="请输入抄送人" />)}
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

          <Button onClick={this.sendEmailHandle} type="primary">
            保存并发送
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}
export default PrintPage;
