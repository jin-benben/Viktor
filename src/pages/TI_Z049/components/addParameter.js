import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Select, Modal } from 'antd';
import { parameterType } from '@/utils/publicData';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@Form.create()
class AddParameter extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
      form,
      modalVisible,
      pane,
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
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const TemplateformLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    };

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        handleSubmit({ ...fieldsValue });
      });
    };
    return (
      <Modal
        width={960}
        destroyOnClose
        title="添加参数"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="ParameterCode" {...formLayout} label="参数代码">
                {getFieldDecorator('ParameterCode', {
                  initialValue: pane.ParameterCode,
                  rules: [{ required: true, message: '请输入参数代码' }],
                })(<Input placeholder="请输入参数代码" />)}
              </FormItem>
            </Col>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="ParameterName" {...formLayout} label="参数名称">
                {getFieldDecorator('ParameterName', {
                  rules: [{ required: true, message: '请输入参数名称！' }],
                  initialValue: pane.ParameterName,
                })(<Input placeholder="请输入参数名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="ParameterType" {...formLayout} label="参数类型">
                {getFieldDecorator('ParameterType', {
                  rules: [{ required: true, message: '请选择参数类型！' }],
                  initialValue: pane.ParameterType,
                })(
                  <Select placeholder="请选择参数类型！" style={{ width: '100%' }}>
                    {parameterType.map(option => (
                      <Option key={option.Key} value={option.Key}>
                        {option.Value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={20} md={20} sm={24}>
              <FormItem key="HTML" {...TemplateformLayout} label="HTML文本">
                {getFieldDecorator('HTML', {
                  rules: [{ required: true, message: '请输入HTML文本！' }],
                  initialValue: pane.HTML,
                })(<TextArea rows={14} placeholder="请输入HTML文本！" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
export default AddParameter;
