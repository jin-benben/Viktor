import React, { PureComponent } from 'react';
import { Row, Form, Input, Modal, Select, Checkbox } from 'antd';
import Address from '@/components/Address';
import { validatorPhone } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@Form.create()
class AddressInfo extends PureComponent {
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
        // eslint-disable-next-line no-param-reassign
        fieldsValue.DefaultContacts = fieldsValue.DefaultContacts ? 'T' : 'F';
        handleSubmit({ ...formVals, ...fieldsValue });
      });
    };
    return (
      <Modal
        width={640}
        destroyOnClose
        maskClosable={false}
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
            <FormItem key="CellphoneNO" {...this.formLayout} label="手机号">
              {getFieldDecorator('CellphoneNO', {
                rules: [
                  { required: true, message: '请输入手机号！' },
                  {
                    validator: validatorPhone,
                  },
                ],
                initialValue: formVals.CellphoneNO,
              })(<Input addonBefore={prefixSelector} placeholder="请输入手机号" />)}
            </FormItem>
          </Row>
          <Row>
            <FormItem key="address" {...this.formLayout} label="地址">
              {getFieldDecorator('address', {
                rules: [{ required: true, message: '请选择地址！' }],
                initialValue: formVals.ReceiverPhone,
              })(<Address />)}
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
          <Row>
            <FormItem key="DefaultContacts" {...this.formLayout} label="默认地址">
              {getFieldDecorator('DefaultContacts', {
                valuePropName: 'checked',
                initialValue: formVals.DefaultContacts === 'T',
              })(<Checkbox />)}
            </FormItem>
          </Row>
        </Form>
      </Modal>
    );
  }
}
export default AddressInfo;
