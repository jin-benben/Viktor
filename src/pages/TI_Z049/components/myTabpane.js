import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Select } from 'antd';
import { parameterType } from '@/utils/publicData';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    const { tabChange } = props;
    if (tabChange) {
      tabChange(allValues);
    }
  },
})
class MyTabpane extends PureComponent {
  constructor(props) {
    super(props);
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
  }

  render() {
    const {
      form: { getFieldDecorator },
      pane,
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

    return (
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
              })(<TextArea rows={4} placeholder="请输入HTML文本！" />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default MyTabpane;
