import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Select, Button, message, Tabs, Modal } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { templateType, parameterType } from '@/utils/publicData';
import { getName } from '@/utils/utils';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ templateDetail, loading, global }) => ({
  templateDetail,
  global,
  loading: loading.models.templateDetail,
  addloading: loading.effects['templateDetail/add'],
  updateloading: loading.effects['templateDetail/update'],
}))
@Form.create()
class TemplateDetail extends PureComponent {
  columns = [
    {
      title: '序号',
      width: 80,
      dataIndex: 'OrderID',
    },
    {
      title: '名称',
      width: 100,
      dataIndex: 'Name',
    },
    {
      title: '参数类型',
      dataIndex: 'PrintType',
      width: 100,
      render: text => <span>{getName(parameterType, text)}</span>,
    },
    {
      title: '模板内容',
      dataIndex: 'HTML',
      render: text => (
        <Ellipsis tooltip lines={5}>
          {text}
        </Ellipsis>
      ),
    },
  ];

  state = {
    templatdetail: {},
    modalVisible: false,
    activeKey: '1',
  };

  componentDidMount() {
    this.getDetail();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.templateDetail.templatdetail !== prevState.templatdetail) {
      return {
        templatdetail: nextProps.templateDetail.templatdetail,
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
        type: 'templateDetail/fetch',
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
        type: 'templateDetail/add',
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
        type: 'templateDetail/update',
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

  // 弹窗show&hiden
  handleModalVisible = flag => {
    this.setState({ modalVisible: !!flag });
  };

  // 添加参数
  okHandle = () => {
    const { form } = this.props;
    const {
      templatdetail,
      templatdetail: { Code, TI_Z04902 },
    } = this.state;
    const last = TI_Z04902[TI_Z04902.length - 1];
    const OrderID = last === undefined ? 1 : last.OrderID + 1;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      Object.assign(templatdetail, {
        TI_Z04902: [...TI_Z04902, { OrderID, ...fieldsValue, Code }],
      });
      this.setState({ templatdetail: { ...templatdetail } });
    });
  };

  // tab change
  onChange = activeKey => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  remove = targetKey => {
    console.log(targetKey);
  };

  render() {
    const {
      form: { getFieldDecorator },
      addloading,
      updateloading,
    } = this.props;
    const { templatdetail, modalVisible, activeKey } = this.state;
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
        <Form key="main" {...formItemLayout}>
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
              <FormItem key="Type" {...formLayout} label="模板类型">
                {getFieldDecorator('Type', {
                  rules: [{ required: true, message: '请选择模板类型！' }],
                  initialValue: templatdetail.Type,
                })(
                  <Select placeholder="请选择模板类型！" style={{ width: '100%' }}>
                    {templateType.map(option => (
                      <Option key={option.Key} value={option.Key}>
                        {option.Value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
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
              <FormItem key="HTML" {...TemplateformLayout} label="模板内容">
                {getFieldDecorator('HTML', {
                  initialValue: templatdetail.HTML,
                  rules: [{ required: true, message: '请输入模板内容' }],
                })(<TextArea rows={8} placeholder="请输入模板内容" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {templatdetail.TI_Z04902.map(pane => (
            <TabPane tab={pane.ParameterName} key={pane.ParameterType}>
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
            </TabPane>
          ))}
        </Tabs>

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
          <Button type="primary" onClick={this.addParameter}>
            添加参数
          </Button>
        </FooterToolbar>
        <Modal
          width={640}
          destroyOnClose
          title="添加参数"
          visible={modalVisible}
          onOk={this.okHandle}
          onCancel={() => this.handleModalVisible(false)}
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
      </Card>
    );
  }
}

export default TemplateDetail;
