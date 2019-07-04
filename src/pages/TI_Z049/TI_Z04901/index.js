/* eslint-disable no-script-url */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  Table,
  Divider,
  Popconfirm,
  Tabs,
} from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import AddParameter from '../components/addParameter';
import { templateType, parameterType, formItemLayout, formLayout } from '@/utils/publicData';
import { getName } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

@connect(({ templateDetail, loading, global }) => ({
  templateDetail,
  global,
  loading: loading.models.templateDetail,
  addloading: loading.effects['templateDetail/add'],
  updateloading: loading.effects['templateDetail/update'],
}))
@Form.create()
class TemplateDetail extends Component {
  columns = [
    {
      title: '序号',
      width: 80,
      dataIndex: 'OrderID',
    },
    {
      title: '参数代码',
      width: 100,
      dataIndex: 'ParameterCode',
    },
    {
      title: '参数名称',
      width: 100,
      dataIndex: 'ParameterName',
    },
    {
      title: '参数类型',
      dataIndex: 'ParameterType',
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
    {
      title: '操作',
      render: (text, record, index) => (
        <Fragment>
          <a onClick={() => this.changeParameter(record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(index)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  state = {
    templatdetail: {},
    modalVisible: false,
    isAdd: true,
    pane: {
      ParameterCode: '',
      ParameterName: '',
      ParameterType: '',
      HTML: '',
    },
  };

  componentDidMount() {
    this.getDetail();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateDetail/save',
      payload: {
        templatdetail: {
          Code: '',
          Name: '',
          Type: '',
          Comment: '',
          CreateDate: new Date(),
          HTML: '',
          TI_Z04902: [],
        },
      },
    });
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

  // 修改参数
  changeParameter = record => {
    this.setState({
      pane: {
        ...record,
      },
      modalVisible: true,
      isAdd: false,
    });
  };

  // 删除参数
  handleDelete = index => {
    const { templatdetail } = this.state;
    const newArr = [...templatdetail.TI_Z04902];
    newArr.splice(index, 1);
    Object.assign(templatdetail, { TI_Z04902: [...newArr] });
    this.setState({ templatdetail });
  };

  // 添加参数
  addNewParams = () => {
    this.setState({
      modalVisible: true,
      isAdd: true,
      pane: {
        ParameterCode: '',
        ParameterName: '',
        ParameterType: '',
        HTML: '',
      },
    });
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
            router.push(`/base/TI_Z049/detail?Code=${response.Content.Code}`);
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
  addTabpane = fieldsValue => {
    const {
      templatdetail,
      isAdd,
      templatdetail: { Code, TI_Z04902 },
    } = this.state;
    const last = TI_Z04902[TI_Z04902.length - 1];
    const OrderID = last === undefined ? 1 : last.OrderID + 1;
    if (!isAdd) {
      const newsParams = TI_Z04902.map(item => {
        if (item.ParameterCode === fieldsValue.ParameterCode) {
          return {
            ...fieldsValue,
            OrderID: item.OrderID,
          };
        }
        return item;
      });
      Object.assign(templatdetail, {
        TI_Z04902: [...newsParams],
      });
    } else {
      Object.assign(templatdetail, {
        TI_Z04902: [...TI_Z04902, { OrderID, ...fieldsValue, Code }],
      });
    }

    this.setState({
      templatdetail: { ...templatdetail },
      modalVisible: false,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      addloading,
      updateloading,
    } = this.props;
    const { templatdetail, modalVisible, pane } = this.state;

    const addParentMethods = {
      handleSubmit: this.addTabpane,
      handleModalVisible: this.handleModalVisible,
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
            <Col lg={10} md={12} sm={24}>
              <FormItem key="PaperHTML" {...formLayout} label="打印纸张HTML">
                {getFieldDecorator('PaperHTML', {
                  initialValue: templatdetail.PaperHTML,
                })(<TextArea rows={2} placeholder="请输入打印纸张HTML" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Tabs defaultActiveKey="1">
          <TabPane tab="模板内容" key="1">
            <FormItem key="HTML">
              {getFieldDecorator('HTML', {
                initialValue: templatdetail.HTML,
                rules: [{ required: true, message: '请输入模板内容' }],
              })(<TextArea rows={8} placeholder="请输入模板内容" />)}
            </FormItem>
          </TabPane>
          <TabPane tab="参数列表" key="2">
            <Table
              bordered
              dataSource={templatdetail.TI_Z04902}
              rowKey="OrderID"
              pagination={false}
              columns={this.columns}
            />
          </TabPane>
        </Tabs>
        ,
        <AddParameter pane={pane} {...addParentMethods} modalVisible={modalVisible} />
        <FooterToolbar>
          {templatdetail.Code ? (
            <Fragment>
              <Button loading={updateloading} type="primary" onClick={this.updateHandle}>
                更新
              </Button>
              <Button type="primary" onClick={this.addNewParams}>
                添加参数
              </Button>
            </Fragment>
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

export default TemplateDetail;
