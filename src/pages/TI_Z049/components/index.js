import React, { PureComponent } from 'react';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

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
        handleSubmit({ ...formVals, ...fieldsValue });
      });
    };
    return (
      <Modal
        width={640}
        destroyOnClose
        title="添加参数"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <FormItem key="ParameterCode" {...this.formLayout} label="参数代码">
            {getFieldDecorator('ParameterCode', {
              rules: [{ required: true, message: '请输入参数代码' }],
            })(<Input placeholder="请输入参数代码" />)}
          </FormItem>
          <FormItem key="ParameterType" {...this.ParameterName} label="参数名称">
            {getFieldDecorator('ParameterType', {
              rules: [{ required: true, message: '请输入参数名称！' }],
            })(<Input placeholder="请输入参数名称" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
export default AddressInfo;
