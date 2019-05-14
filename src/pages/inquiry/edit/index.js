/* eslint-disable no-script-url */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Card,
  Tabs,
  Button,
  Popconfirm,
  message,
  DatePicker,
  Select,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import { checkPhone, chechEmail } from '@/utils/utils';

const { TabPane } = Tabs;
const { Search } = Input;
const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class CreateForm extends PureComponent {
  skuColumns = [
    {
      title: '行号',
      dataIndex: 'LineID',
      width: 50,
    },
    {
      title: 'SKU',
      dataIndex: 'SKU',
      editable: true,
      inputType: 'text',
    },
    {
      title: '产品描述',
      dataIndex: 'SKUName',
      editable: true,
      inputType: 'text',
    },
    {
      title: '品牌',
      dataIndex: 'BrandName',
      editable: true,
      inputType: 'text',
    },
    {
      title: '名称',
      dataIndex: 'ProductName',
      editable: true,
      inputType: 'text',
    },
    {
      title: '型号',
      dataIndex: 'ManufactureNO',
    },
    {
      title: '参数',
      dataIndex: 'Parameters',
    },
    {
      title: '包装',
      dataIndex: 'Package',
    },
    {
      title: '采购员',
      dataIndex: 'Purchaser',
    },
    {
      title: '数量',
      width: 100,
      dataIndex: 'Quantity',
    },
    {
      title: '单位',
      width: 80,
      dataIndex: 'Unit',
    },
    {
      title: '要求交期',
      dataIndex: 'DueDate',
    },
    {
      title: '询价最终价格',
      dataIndex: 'InquiryPrice',
    },
    {
      title: '销售建议价格',
      dataIndex: 'Price',
    },
    {
      title: '询价最终交期',
      dataIndex: 'InquiryDueDate',
    },
    {
      title: '询价备注',
      dataIndex: 'InquiryComment',
    },
    {
      title: '询价行总计',
      dataIndex: 'InquiryLineTotal',
    },
    {
      title: '销售行总计',
      dataIndex: 'LineTotal',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record.key)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  addressColumns = [
    {
      title: '序号',
      width: 80,
      dataIndex: 'OrderID',
    },
    {
      title: '来源类型',
      dataIndex: 'BaseType',
    },
    {
      title: '来源单号',
      dataIndex: 'BaseEntry',
    },
    {
      title: '附件代码',
      dataIndex: 'AttachmentCode',
    },
    {
      title: '附件描述',
      dataIndex: 'AttachmentName',
    },
    {
      title: '附件路径',
      dataIndex: 'AttachmentPath',
    },

    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record.key)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      formVals: props.formVals,
      tabIndex: '1',
      LinkManmodalVisible: false,
      AddressmodalVisible: false,
      addressVal: {
        OrderID: '',
        AddressID: '',
        ProvinceID: '',
        Province: '',
        CityID: '',
        City: '',
        AreaID: '',
        Area: '',
        StreetID: '',
        Street: '',
        Address: '',
        UserName: '',
        ReceiverPhone: '',
      },
      linkManVal: {
        Name: '',
        CellphoneNO: '',
        PhoneNO: '',
        Email: '',
        Position: '',
        Saler: '',
        CompanyCode: '',
      },
    };
    this.formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
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

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formVals: values,
      });

      dispatch({
        type: 'tableList/fetch',
        payload: values,
      });
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableList/add',
      payload: {
        desc: fields.desc,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableList/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  handleUpdateModalVisible = (flag, record, modalkey, valkey) => {
    this.setState({
      [modalkey]: !!flag,
      [valkey]: record,
    });
  };

  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      this.handleAdd(fieldsValue);
    });
  };

  handleModalVisible = flag => {
    this.setState({
      LinkManmodalVisible: !!flag,
      AddressmodalVisible: !!flag,
    });
  };

  tabChange = tabIndex => {
    this.setState({ tabIndex });
  };

  rightButton = tabIndex => {
    if (tabIndex === '1') {
      return (
        <Button icon="plus" style={{ marginLeft: 8 }} type="primary" onClick={this.addLinkMan}>
          添加新物料
        </Button>
      );
    }
    if (tabIndex === '3') {
      return (
        <Button icon="plus" style={{ marginLeft: 8 }} type="primary" onClick={this.addLinkMan}>
          添加新附件
        </Button>
      );
    }
    return null;
  };

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

  addLinkMan = () => {
    this.setState({
      LinkManmodalVisible: true,
      linkManVal: {
        Name: '',
        CellphoneNO: '',
        PhoneNO: '',
        Email: '',
        Position: '',
        Saler: '',
        CompanyCode: '',
      },
    });
  };

  addAddressInfo = () => {
    this.setState({
      AddressmodalVisible: true,
      addressVal: {
        OrderID: '',
        AddressID: '',
        ProvinceID: '',
        Province: '',
        CityID: '',
        City: '',
        AreaID: '',
        Area: '',
        StreetID: '',
        Street: '',
        Address: '',
        UserName: '',
        ReceiverPhone: '',
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      form,
    } = this.props;
    const {
      formVals,
      tabIndex,
      LinkManmodalVisible,
      linkManVal,
      AddressmodalVisible,
      addressVal,
    } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 10 },
        lg: { span: 6 },
      },
    };
    const linkmanParentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };
    const addressParentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };
    const skucolumns = this.skuColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: true,
        }),
      };
    });

    return (
      <Fragment>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row gutter={8}>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CardCode" {...this.formLayout} label="客户ID">
                {getFieldDecorator('CardCode', {
                  rules: [{ required: true, message: '请输入客户名称！' }],
                  initialValue: formVals.CardCode,
                })(
                  <Search
                    placeholder="input search text"
                    onSearch={value => console.log(value)}
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="DocEntry" {...this.formLayout} label="单号">
                {getFieldDecorator('DocEntry', {
                  initialValue: formVals.DocEntry,
                })(<Input disabled placeholder="单号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CardName" {...this.formLayout} label="客户名称">
                {getFieldDecorator('CardName', {
                  rules: [{ required: true, message: '请输入客户名称！' }],
                  initialValue: formVals.CardName,
                })(
                  <Search
                    placeholder="input search text"
                    onSearch={value => console.log(value)}
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="DocDate" {...this.formLayout} label="单据日期">
                {getFieldDecorator('date-time-picker', { rules: [{ type: 'object' }] })(
                  <DatePicker style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="BankAccount" {...this.formLayout} label="联系人">
                {getFieldDecorator('BankAccount', {
                  rules: [{ required: true, message: '请输入联系人！' }],
                  initialValue: formVals.BankAccount,
                })(
                  <Search
                    placeholder="input search text"
                    onSearch={value => console.log(value)}
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="OrderType" {...this.formLayout} label="订单类型">
                {getFieldDecorator('OrderType', {
                  initialValue: formVals.OrderType,
                })(
                  <Select placeholder="请选择">
                    <Option value="1">男</Option>
                    <Option value="2">女</Option>
                    <Option value="3">不详</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="NumAtCard" {...this.formLayout} label="客户参考号">
                {getFieldDecorator('NumAtCard', {
                  initialValue: formVals.NumAtCard,
                })(<Input placeholder="请输入客户参考号" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="DutyNo" {...this.formLayout} label="状态">
                <span>状态</span>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Tabs tabBarExtraContent={this.rightButton(tabIndex)} onChange={this.tabChange}>
          <TabPane tab="物料" key="1">
            <StandardTable data={{ list: formVals.MDM01 }} rowKey="LineID" columns={skucolumns} />
          </TabPane>
          <TabPane tab="常规" key="2">
            <StandardTable
              data={{ list: formVals.MDM02 }}
              rowKey="OrderID"
              columns={this.addressColumns}
            />
          </TabPane>
          <TabPane tab="附件" key="3">
            <StandardTable
              data={{ list: formVals.MDM02 }}
              rowKey="OrderID"
              columns={this.addressColumns}
            />
          </TabPane>
        </Tabs>
      </Fragment>
    );
  }
}
/* eslint react/no-multi-comp:0 */
@connect(({ tableList, loading }) => ({
  tableList,
  loading: loading.models.rule,
}))
@Form.create()
class InquiryEdit extends PureComponent {
  state = {
    formValues: {
      MDM01: [
        {
          LineID: 0,
          LineComment: 'string',
          SLineStatus: 'string',
          PLineStatus: 'string',
          Closed: 'string',
          ClosedBy: 'string',
          SKU: 'string',
          SKUName: 'string',
          BrandName: 'string',
          ProductName: 'string',
          ManufactureNO: 'string',
          Parameters: 'string',
          Package: 'string',
          Purchaser: 'string',
          Quantity: 0,
          Unit: 'string',
          DueDate: '2019-05-14T00:48:28.938Z',
          InquiryPrice: 0,
          Price: 0,
          InquiryDueDate: '2019-05-14T00:48:28.938Z',
          InquiryComment: 'string',
          InquiryLineTotal: 0,
          LineTotal: 0,
          TI_Z02604: [
            {
              DocEntry: 0,
              OrderID: 0,
              ItemLine: 0,
              CreateDate: '2019-05-14T00:48:28.939Z',
              UpdateDate: '2019-05-14T00:48:28.939Z',
              CreateUser: 'string',
              UpdateUser: 'string',
              BaseType: 'string',
              BaseEntry: 0,
              BaseLineID: 0,
              AttachmentCode: 'string',
              AttachmentName: 'string',
              AttachmentPath: 'string',
            },
          ],
        },
      ],
    },
  };

  componentDidMount() {}

  render() {
    const { formValues } = this.state;
    return (
      <Card>
        <CreateForm formVals={formValues} />
      </Card>
    );
  }
}

export default InquiryEdit;
