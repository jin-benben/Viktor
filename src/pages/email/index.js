import React, { PureComponent } from 'react';
import { Card, Button, Form, Row, Input } from 'antd';
import { connect } from 'dva';
import UEditor from '@/components/Ueditor';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';

const FormItem = Form.Item;

@connect(({ sendEmail, loading }) => ({
  sendEmail,
  loading,
}))
@Form.create()
class PrintPage extends PureComponent {
  state = {
    sendDetail: {},
  };

  componentDidMount() {
    const {
      location: { query },
      dispatch,
    } = this.props;
    if (query.DocEntry) {
      dispatch({
        type: 'sendEmail/singlefetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
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

  sendEmailHandle = () => {};

  render() {
    const { sendDetail } = this.state;
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
            <FormItem key="Body" {...formLayout} label="内容">
              {getFieldDecorator('Body', {
                rules: [{ required: true, message: '请输入内容！' }],
                initialValue: sendDetail.Body,
              })(<UEditor content={sendDetail.Body} />)}
            </FormItem>
          </Row>
        </Form>
        <FooterToolbar>
          <Button onClick={this.sendEmailHandle} type="primary">
            发送
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}
export default PrintPage;
