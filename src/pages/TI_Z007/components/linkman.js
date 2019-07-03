import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Modal, Checkbox } from 'antd';
import { chechEmail } from '@/utils/utils';

const FormItem = Form.Item;
@Form.create()
class LinkManFrom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formVals: props.formVals,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.formVals !== prevState.formVals) {
      return {
        formVals: nextProps.formVals,
      };
    }
    return null;
  }

  validatorEmail = (rule, value, callback) => {
    if (value && !chechEmail(value)) {
      callback(new Error('邮箱格式不正确'));
    } else {
      callback();
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      form,
      modalVisible,
      handleModalVisible,
      handleSubmit,
    } = this.props;
    const { formVals } = this.state;
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
        // eslint-disable-next-line no-param-reassign
        fieldsValue.DefaultContacts = fieldsValue.DefaultContacts ? 'T' : 'F';
        handleSubmit({ ...formVals, ...fieldsValue });
      });
    };
    return (
      <Modal
        width={640}
        destroyOnClose
        title="联系人编辑"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <Row>
            <Col span={12}>
              <FormItem key="Name" {...this.formLayout} label="姓名">
                {getFieldDecorator('Name', {
                  rules: [{ required: true, message: '请输入姓名！' }],
                  initialValue: formVals.Name,
                })(<Input placeholder="请输入姓名" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="CellphoneNO" {...this.formLayout} label="手机号">
                {getFieldDecorator('CellphoneNO', {
                  initialValue: formVals.CellphoneNO,
                })(<Input placeholder="请输入手机号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem key="Email" {...this.formLayout} label="邮箱">
                {getFieldDecorator('Email', {
                  rules: [
                    { required: true, message: '请输入邮箱' },
                    { validator: this.validatorEmail },
                  ],
                  initialValue: formVals.Email,
                })(<Input placeholder="请输入邮箱" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="Position" {...this.formLayout} label="职位">
                {getFieldDecorator('Position', {
                  initialValue: formVals.Position,
                })(<Input placeholder="请输入职位" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem key="PhoneNO" {...this.formLayout} label="电话">
                {getFieldDecorator('PhoneNO', {
                  rules: [{ required: true, message: '请输入电话' }],
                  initialValue: formVals.PhoneNO,
                })(<Input placeholder="请输入电话" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem key="DefaultContacts" {...this.formLayout} label="默认联系人">
                {getFieldDecorator('DefaultContacts', {
                  valuePropName: 'checked',
                  initialValue: formVals.DefaultContacts === 'T',
                })(<Checkbox />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
export default LinkManFrom;
