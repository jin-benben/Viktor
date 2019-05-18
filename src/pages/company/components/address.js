import React, { PureComponent } from 'react';
import { Row, Form, Input, Modal, Select } from 'antd';
import Address from '@/components/Address';
import { checkPhone, chechEmail } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@Form.create()
class AddressInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formVals: {},
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

  validatorPhone = (rule, value, callback) => {
    if (value && !checkPhone(value)) {
      callback(new Error('手机号格式不正确'));
    } else {
      callback();
    }
  };

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
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleSubmit({ ...formVals, ...fieldsValue, ...fieldsValue.address });
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
            <FormItem key="UserName" {...this.formLayout} label="收货人姓名">
              {getFieldDecorator('UserName', {
                rules: [{ required: true, message: '请输入姓名！' }],
                initialValue: formVals.UserName,
              })(<Input placeholder="请输入姓名" />)}
            </FormItem>
          </Row>
          <Row>
            <FormItem key="ReceiverPhone" {...this.formLayout} label="手机号">
              {getFieldDecorator('ReceiverPhone', {
                rules: [
                  { required: true, message: '请输入手机号！' },
                  {
                    validator: this.validatorPhone,
                  },
                ],
                initialValue: formVals.ReceiverPhone,
              })(<Input addonBefore={prefixSelector} placeholder="请输入手机号" />)}
            </FormItem>
          </Row>
          <Row>
            <FormItem key="address" {...this.formLayout} label="地址">
              {getFieldDecorator('address', {
                rules: [{ required: true, message: '请选择地址！' }],
                initialValue: formVals.ReceiverPhone,
              })(<Address {...formVals} />)}
            </FormItem>
          </Row>
          <Row>
            <FormItem key="Address" {...this.formLayout} label="详细地址">
              {getFieldDecorator('Address', {
                rules: [{ required: true, message: '请输入详细地址！' }],
                initialValue: formVals.Address,
              })(<TextArea placeholder="请输入详细地址" />)}
            </FormItem>
          </Row>
        </Form>
      </Modal>
    );
  }
}
export default AddressInfo;
