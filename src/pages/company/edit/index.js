/* eslint-disable no-script-url */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Card,
  Switch,
  Tabs,
  Button,
  Popconfirm,
  message,
  Divider,
  Select,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import AddressInfo from '../components/address';
import styles from './style.less';
import LinkMan from '../components/linkman';
import { checkPhone, chechEmail } from '@/utils/utils';

const { TabPane } = Tabs;

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class CreateForm extends PureComponent {
  linkmanColumns = [
    {
      title: 'ID',
      dataIndex: 'LineID',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'Name',
    },
    {
      title: '手机号码',
      dataIndex: 'CellphoneNO',
    },
    {
      title: '电话号码',
      dataIndex: 'PhoneNo',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
    },
    {
      title: '职位',
      dataIndex: 'Position',
    },
    {
      title: '销售',
      dataIndex: 'Saler',
    },
    {
      title: '交易公司',
      dataIndex: 'CompanyCode',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() =>
              this.handleUpdateModalVisible(true, record, 'LinkManmodalVisible', 'linkManVal')
            }
          >
            修改
          </a>
          <Divider type="vertical" />
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record.key)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  addressColumns = [
    {
      title: 'ID',
      width: 80,
      dataIndex: 'AddressID',
    },
    {
      title: '收货人姓名',
      dataIndex: 'UserName',
    },
    {
      title: '手机号码',
      dataIndex: 'ReceiverPhone',
    },
    {
      title: '收货地址',
      key: 'address',
      render: (text, record) => (
        <Fragment>
          <span>{`${record.Province + record.City + record.Area + record.Street}`}</span>
          <span>{`${record.Address}`}</span>
        </Fragment>
      ),
    },

    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() =>
              this.handleUpdateModalVisible(true, record, 'AddressmodalVisible', 'addressVal')
            }
          >
            修改
          </a>
          <Divider type="vertical" />
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
      labelCol: { span: 10 },
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
          新建联系人
        </Button>
      );
    }
    if (tabIndex === '2') {
      return (
        <Button icon="plus" style={{ marginLeft: 8 }} type="primary" onClick={this.addAddressInfo}>
          新建收货地址
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
              <FormItem key="Code" {...this.formLayout} label="客户ID">
                <span>{formVals.Code}</span>
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Name" {...this.formLayout} label="客户名称">
                {getFieldDecorator('Department', {
                  rules: [{ required: true, message: '请输入客户名称！' }],
                  initialValue: formVals.Name,
                })(<Input placeholder="请输入客户名称" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="OpeningBank" {...this.formLayout} label="营业执照开户行">
                {getFieldDecorator('OpeningBank', {
                  rules: [{ required: true, message: '请输入营业执照开户行！' }],
                  initialValue: formVals.OpeningBank,
                })(<Input placeholder="请输入营业执照开户行！" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="BankAccount" {...this.formLayout} label="营业执照账户">
                {getFieldDecorator('BankAccount', {
                  rules: [{ required: true, message: '请输入营业执照账户！' }],
                  initialValue: formVals.BankAccount,
                })(<Input placeholder="请输入营业执照账户" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="DutyNo" {...this.formLayout} label="营业执照税号">
                {getFieldDecorator('DutyNo', {
                  rules: [{ required: true, message: '请输入营业执照税号！' }],
                  initialValue: formVals.DutyNo,
                })(<Input placeholder="请输入营业执照税号" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Laddress" {...this.formLayout} label="营业执照地址">
                {getFieldDecorator('Laddress', {
                  rules: [{ required: true, message: '请输入营业执照地址！' }],
                  initialValue: formVals.Laddress,
                })(<Input placeholder="请输入营业执照地址" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="LPhone" {...this.formLayout} label="营业执照电话">
                {getFieldDecorator('LPhone', {
                  rules: [{ required: true, message: '请输入营业执照电话！' }],
                  initialValue: formVals.LPhone,
                })(<Input placeholder="请输入营业执照电话" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CreditCode" {...this.formLayout} label="营业执照信用代码">
                {getFieldDecorator('CreditCode', {
                  rules: [{ required: true, message: '请输入营业执照信用代码！' }],
                  initialValue: formVals.CreditCode,
                })(<Input placeholder="请输入营业执照信用代码" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CusSource" {...this.formLayout} label="来源">
                {getFieldDecorator('CusSource', {
                  initialValue: formVals.CusSource,
                })(
                  <Select placeholder="请选择性别">
                    <Option value="1">男</Option>
                    <Option value="2">女</Option>
                    <Option value="3">不详</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="PayMent" {...this.formLayout} label="付款条款">
                {getFieldDecorator('PayMent', {
                  initialValue: formVals.PayMent,
                })(
                  <Select placeholder="请选择">
                    <Option value="Y">是</Option>
                    <Option value="N">否</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CardType" {...this.formLayout} label="客户类型">
                {getFieldDecorator('CardType', {
                  initialValue: formVals.CardType,
                })(
                  <Select placeholder="请选择">
                    <Option value="1">正常</Option>
                    <Option value="2">问题</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="LogisticsCompany" {...this.formLayout} label="默认物流公司">
                {getFieldDecorator('LogisticsCompany', {
                  rules: [{ required: true, message: '请选择交易主体！' }],
                  initialValue: formVals.LogisticsCompany,
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Status" {...this.formLayout} label="状态">
                {getFieldDecorator('Status', {
                  initialValue: formVals.Status,
                })(<Switch checkedChildren="开启" unCheckedChildren="禁用" defaultChecked />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Tabs tabBarExtraContent={this.rightButton(tabIndex)} onChange={this.tabChange}>
          <TabPane tab="联系人" key="1">
            <StandardTable
              data={{ list: formVals.MDM01 }}
              rowKey="OrderID"
              columns={this.linkmanColumns}
            />
          </TabPane>
          <TabPane tab="收货地址" key="2">
            <StandardTable
              data={{ list: formVals.MDM02 }}
              rowKey="OrderID"
              columns={this.addressColumns}
            />
          </TabPane>
        </Tabs>
        <LinkMan
          {...linkmanParentMethods}
          formVals={linkManVal}
          modalVisible={LinkManmodalVisible}
        />
        <AddressInfo
          {...addressParentMethods}
          formVals={addressVal}
          modalVisible={AddressmodalVisible}
        />
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
class CompanyEdit extends PureComponent {
  state = {
    formValues: {
      Code: 'C00001',
      Name: '',
      OpeningBank: '',
      BankAccount: '',
      DutyNo: '',
      Laddress: '',
      LPhone: '',
      CreditCode: '',
      Status: '',
      CardType: '',
      CusSource: '',
      PayMent: '',
      LogisticsCompany: '',
      UpdateTimestamp: '',
      Tagging: '',
      MDM01: [
        {
          Code: '001',
          OrderID: '1',
          UserID: '0914',
          CreateDate: '',
          UpdateDate: '',
          CreateUser: '',
          UpdateUser: '',
          Name: '晋文涛',
          CellphoneNO: '17682310914',
          PhoneNO: '8888888',
          Email: '528325291@qq.com',
          Position: '前端工程师',
          Saler: '马云',
          CompanyCode: '阿里巴巴',
        },
      ],
      MDM02: [
        {
          Code: '',
          OrderID: '',
          AddressID: '',
          CreateDate: '',
          UpdateDate: '',
          CreateUser: '',
          UpdateUser: '',
          ProvinceID: '',
          Province: '浙江省',
          CityID: '',
          City: '绍兴市',
          AreaID: '',
          Area: '越城区',
          StreetID: '',
          Street: '灵芝镇',
          Address: '解放大道158号',
          UserName: '晋文涛',
          ReceiverPhone: '17682310914',
        },
      ],
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableList/fetch',
    });
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                icon="plus"
                style={{ marginLeft: 8 }}
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              >
                新建
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { formValues } = this.state;
    return (
      <Card>
        <CreateForm formVals={formValues} />
      </Card>
    );
  }
}

export default CompanyEdit;
