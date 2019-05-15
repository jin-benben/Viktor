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
  Icon,
  Popconfirm,
  message,
  DatePicker,
  Select,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import EditableFormTable from '@/components/EditableFormTable';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
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
      fixed: 'left',
      width: 50,
    },
    {
      title: 'SKU',
      dataIndex: 'SKU',
      width: 100,
      inputType: 'text',
    },
    {
      title: '产品描述',
      dataIndex: 'SKUName',
      inputType: 'textArea',
      width: 100,
      editable: true,
    },
    {
      title: '品牌',
      width: 100,
      dataIndex: 'BrandName',
      inputType: 'text',
      editable: true,
    },
    {
      title: '名称',
      dataIndex: 'ProductName',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '型号',
      width: 100,
      dataIndex: 'ManufactureNO',
      inputType: 'text',
      editable: true,
    },
    {
      title: '参数',
      width: 100,
      dataIndex: 'Parameters',
      inputType: 'text',
      editable: true,
    },
    {
      title: '包装',
      width: 100,
      dataIndex: 'Package',
      inputType: 'text',
      editable: true,
    },
    {
      title: '采购员',
      width: 100,
      dataIndex: 'Purchaser',
      editable: true,
    },
    {
      title: '数量',
      width: 100,
      inputType: 'text',
      dataIndex: 'Quantity',
      editable: true,
    },
    {
      title: '单位',
      width: 80,
      inputType: 'text',
      dataIndex: 'Unit',
      editable: true,
    },
    {
      title: '要求交期',
      width: 150,
      inputType: 'date',
      dataIndex: 'DueDate',
      editable: true,
    },
    {
      title: '询价最终价格',
      width: 100,
      inputType: 'text',
      dataIndex: 'InquiryPrice',
      editable: true,
    },
    {
      title: '销售建议价格',
      width: 100,
      inputType: 'text',
      dataIndex: 'Price',
      editable: true,
    },
    {
      title: '询价最终交期',
      width: 150,
      inputType: 'date',
      dataIndex: 'InquiryDueDate',
      editable: true,
    },
    {
      title: '询价备注',
      width: 100,
      inputType: 'textArea',
      dataIndex: 'InquiryComment',
      editable: true,
    },
    {
      title: '询价行总计',
      width: 100,
      dataIndex: 'InquiryLineTotal',
    },
    {
      title: '销售行总计',
      width: 100,
      dataIndex: 'LineTotal',
    },
    {
      title: '操作',
      fixed: 'right',
      width: 50,
      render: (text, record) => (
        <Fragment>
          <Icon
            title="上传附件"
            className="icons"
            style={{ color: '#08c', marginRight: 5 }}
            type="cloud-upload"
          />
          <Icon
            title="删除行"
            className="icons"
            type="delete"
            theme="twoTone"
            onClick={() => this.deleteLine(record)}
          />
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
        <Button size="small" style={{ border: 'none' }} onClick={() => this.deleteLine(record)}>
          <Icon title="删除行" type="delete" theme="twoTone" />
        </Button>
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

  rowChange = record => {
    const { data } = this.state;
    data.map(item => {
      if (item.key === record.key) {
        return record;
      }
      return item;
    });
    // console.log(data)
    this.setState({ data }, () => {
      console.log(data);
    });
  };

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
            <EditableFormTable
              rowChange={this.rowChange}
              rowKey="LineID"
              scroll={{ x: 1800 }}
              columns={this.skuColumns}
              data={formVals.MDM01}
            />
          </TabPane>
          <TabPane tab="常规" key="2">
            ii
          </TabPane>
          <TabPane tab="附件" key="3">
            <StandardTable
              data={{ list: formVals.TI_Z02603 }}
              rowKey="OrderID"
              columns={this.addressColumns}
            />
          </TabPane>
        </Tabs>
        <FooterToolbar>
          <Button type="primary">保存</Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}
/* eslint react/no-multi-comp:0 */
@connect(({ inquiryEdit, loading }) => ({
  inquiryEdit,
  loading: loading.models.rule,
}))
@Form.create()
class InquiryEdit extends PureComponent {
  componentDidMount() {}

  render() {
    const {
      inquiryEdit: { inquiryDetail },
    } = this.props;
    return (
      <Card>
        <CreateForm formVals={inquiryDetail} />
      </Card>
    );
  }
}

export default InquiryEdit;
