import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Select, Button, message } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import { printType, printOrderType } from '@/utils/publicData';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ printTemplateDetail, loading, global }) => ({
  printTemplateDetail,
  global,
  loading: loading.models.printTemplateDetail,
  addloading: loading.effects['printTemplateDetail/add'],
  updateloading: loading.effects['printTemplateDetail/update'],
}))
@Form.create()
class PrintTemplateDetail extends PureComponent {
  state = {
    templatdetail: {},
  };

  componentDidMount() {
    this.getDetail();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.printTemplateDetail.templatdetail !== prevState.templatdetail) {
      return {
        templatdetail: nextProps.printTemplateDetail.templatdetail,
      };
    }
    return null;
  }

  // 获取单据详情
  getDetail = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.Code) {
      dispatch({
        type: 'printTemplateDetail/fetch',
        payload: {
          Content: {
            Code: query.Code,
          },
        },
      });
    }
  };

  handleChange = content => {
    const { templatdetail } = this.state;
    Object.assign(templatdetail, { HtmlTemplateCode: content });
    this.setState({ templatdetail });
  };

  // 保存主数据
  addHandle = () => {
    const { form, dispatch } = this.props;
    const { templatdetail } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'printTemplateDetail/add',
        payload: {
          Content: {
            ...templatdetail,
            ...fieldsValue,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('添加成功');
            router.push(`/sellabout/TI_Z026/detail?DocEntry=${response.Content.DocEntry}`);
          }
        },
      });
    });
  };

  // 更新主数据
  updateHandle = () => {
    const { form, dispatch } = this.props;
    const { templatdetail } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'printTemplateDetail/update',
        payload: {
          Content: {
            ...templatdetail,
            ...fieldsValue,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('更新成功');
            this.getDetail();
          }
        },
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      addloading,
      updateloading,
    } = this.props;
    const { templatdetail } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 10 },
        lg: { span: 10 },
      },
    };
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const TemplateformLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    };
    return (
      <Card bordered={false}>
        <Form {...formItemLayout}>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="Code" {...formLayout} label="模板ID">
                {getFieldDecorator('Code', {
                  initialValue: templatdetail.Code,
                  rules: [{ required: true, message: '请输入模板ID' }],
                })(<Input disabled={templatdetail.Code !== ''} placeholder="请输入模板ID" />)}
              </FormItem>
            </Col>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="Name" {...formLayout} label="模板名称">
                {getFieldDecorator('Name', {
                  initialValue: templatdetail.Name,
                  rules: [{ required: true, message: '请输入模板名称' }],
                })(<Input placeholder="请输入模板名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="BaseType" {...formLayout} label="单据类型">
                {getFieldDecorator('BaseType', {
                  rules: [{ required: true, message: '请选择单据类型！' }],
                  initialValue: templatdetail.BaseType,
                })(
                  <Select placeholder="请选择单据类型！" style={{ width: '100%' }}>
                    {printOrderType.map(option => (
                      <Option key={option.Key} value={option.Key}>
                        {option.Value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="PrintType" {...formLayout} label="打印类型">
                {getFieldDecorator('PrintType', {
                  rules: [{ required: true, message: '请选择打印类型！' }],
                  initialValue: templatdetail.PrintType,
                })(
                  <Select placeholder="请选择打印类型！" style={{ width: '100%' }}>
                    {printType.map(option => (
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
            <Col lg={10} md={12} sm={24}>
              <FormItem key="Comment" {...formLayout} label="备注">
                {getFieldDecorator('Comment', {
                  initialValue: templatdetail.Comment,
                })(<TextArea rows={2} placeholder="请输入备注" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={20} md={20} sm={24}>
              <FormItem key="HtmlTemplateCode" {...TemplateformLayout} label="模板内容">
                {getFieldDecorator('HtmlTemplateCode', {
                  initialValue: templatdetail.HtmlTemplateCode,
                  rules: [{ required: true, message: '请输入模板内容' }],
                })(<TextArea rows={8} placeholder="请输入模板内容" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>

        <FooterToolbar>
          {templatdetail.Code ? (
            <Button loading={updateloading} type="primary" onClick={this.updateHandle}>
              更新
            </Button>
          ) : (
            <Button loading={addloading} type="primary" onClick={this.addHandle}>
              保存
            </Button>
          )}
        </FooterToolbar>
      </Card>
    );
  }
}

export default PrintTemplateDetail;
