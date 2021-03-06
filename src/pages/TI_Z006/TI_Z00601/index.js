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
  message,
  AutoComplete,
  Icon,
  Divider,
  Modal,
} from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import router from 'umi/router';
import StandardTable from '@/components/StandardTable';
import AddressInfo from '../components/address';
import LinkMan from '../components/linkman';
import CardSource from '@/components/Select/CardSource';
import SendEmail from '@/components/Order/SendEmail';
import ClientAsk from '@/components/Order/TI_Z026';
import OdlnordnFetch from '@/components/Order/OdlnordnFetch';
import OinvorinFetch from '@/components/Order/OinvorinFetch';
import OrderFetch from '@/components/Order/OrderFetch';
import OrctovpmFetch from '@/components/Order/OrctovpmFetch';
import PrintHistory from '@/components/Order/PrintHistory';
import MDMCommonality from '@/components/Select';
import MyPageHeader from '../components/pageHeader';
import MyIcon from '@/components/MyIcon';
import Text from '@/components/Text';
import { getName } from '@/utils/utils';

const { TabPane } = Tabs;
const { Option } = AutoComplete;
const FormItem = Form.Item;

@connect(({ companyEdit, loading, global }) => ({
  companyEdit,
  global,
  loading: loading.models.rule,
}))
@Form.create()
class CompanyEdit extends PureComponent {
  linkmanColumns = [
    {
      title: 'ID',
      dataIndex: 'UserID',
      width: 50,
    },
    {
      title: '姓名',
      width: 80,
      dataIndex: 'Name',
    },
    {
      title: '手机号码',
      width: 130,
      dataIndex: 'CellphoneNO',
    },
    {
      title: '电话号码',
      width: 100,
      dataIndex: 'PhoneNO',
    },
    {
      title: 'Email',
      width: 200,
      dataIndex: 'Email',
      render: text => <Text text={text} />,
    },
    {
      title: '职位',
      width: 80,
      dataIndex: 'Position',
    },
    {
      title: '销售',
      width: 100,
      dataIndex: 'Saler',
      render: text => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, text)}</span>;
      },
    },
    {
      title: '交易公司',
      width: 150,
      dataIndex: 'CompanyCode',
      render: text => {
        const {
          global: { Company },
        } = this.props;
        return <Text text={getName(Company, text)} />;
      },
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() =>
              this.handleUpdateModalVisible(true, record, 'LinkManmodalVisible', 'linkManVal')
            }
          >
            <MyIcon type="iconedit" />
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.addQrCode(record)}>
            <Icon type="qrcode" />
          </a>
        </Fragment>
      ),
    },
  ];

  addressColumns = [
    {
      title: 'ID',
      width: 50,
      dataIndex: 'AddressID',
    },
    {
      title: '地址描述',
      width: 200,
      dataIndex: 'AddressName',
    },
    {
      title: '收货人姓名',
      width: 100,
      dataIndex: 'UserName',
    },
    {
      title: '手机号码',
      width: 100,
      dataIndex: 'ReceiverPhone',
    },
    {
      title: '收货地址',
      key: 'address',
      width: 200,
      render: (text, record) => (
        <Fragment>
          <span>{`${record.Province + record.City + record.Area}`}</span>
          <span>{`${record.Address}`}</span>
        </Fragment>
      ),
    },

    {
      title: '操作',
      width: 50,
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() =>
              this.handleUpdateModalVisible(true, record, 'AddressmodalVisible', 'addressVal')
            }
          >
            <MyIcon type="iconedit" />
          </a>
        </Fragment>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        Code: '',
        Name: '',
        OpeningBank: '',
        BankAccount: '',
        DutyNo: '',
        Laddress: '',
        LPhone: '',
        CreditCode: '',
        Status: '1',
        CardType: '',
        CusSource: '',
        PayMent: '',
        LogisticsCompany: '',
      },
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
      dataSource: [],
    };
    this.formLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['PayMent', 'Trnsp', 'Saler', 'Card'],
          Key: 's',
        },
      },
    });
    this.getSingle();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'companyEdit/save',
      payload: {
        companyDetail: {
          Code: '',
          Name: '',
          OpeningBank: '',
          BankAccount: '',
          DutyNo: '',
          Laddress: '',
          LPhone: '',
          CreditCode: '',
          Status: '1',
          CardType: '',
          CusSource: '',
          PayMent: '',
          LogisticsCompany: '',
          TI_Z00602List: [],
          TI_Z00603List: [],
        },
      },
    });
  }

  getSingle() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.Code) {
      dispatch({
        type: 'companyEdit/fetch',
        payload: {
          Content: {
            Code: query.Code,
          },
        },
      });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.companyEdit.companyDetail !== prevState.formVals) {
      return {
        formVals: nextProps.companyEdit.companyDetail,
      };
    }
    return null;
  }

  addQrCode = record => {
    const { CellphoneNO, Name, Position } = record;
    const { formVals } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'companyEdit/qrcode',
      payload: {
        Content: {
          PhoneNo: CellphoneNO,
          Name,
          Position,
          CardName: formVals.Name,
          CardCode: formVals.Code,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          Modal.success({
            title: '请用微信扫描如下二维码进行关注绑定',
            content: (
              <div style={{ textAlign: 'center', margin: 20, marginLeft: 0 }}>
                <img
                  alt="二维码"
                  src={`http://pic.wktmro.com/qrcode.ashx?c=http://wechat.wktmro.com/bind?DocEntry=${
                    response.Content.DocEntry
                  }`}
                />
              </div>
            ),
          });
        }
      },
    });
  };

  handleLinkmanSubmit = fields => {
    const { dispatch } = this.props;
    const { formVals } = this.state;
    this.setState({
      linkManVal: { ...fields },
    });
    dispatch({
      type: 'companyEdit/linkman',
      payload: {
        Content: {
          ...fields,
          Code: formVals.Code,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('保存成功');
          this.handleModalVisible();
          this.getSingle();
        }
      },
    });
  };

  handleAddressSubmit = fields => {
    const { dispatch } = this.props;
    const { formVals } = this.state;
    // eslint-disable-next-line no-param-reassign
    delete fields.address;
    this.setState({
      addressVal: { ...fields },
    });
    dispatch({
      type: 'companyEdit/address',
      payload: {
        Content: {
          ...fields,
          Code: formVals.Code,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('保存成功');
          this.handleModalVisible();
          this.getSingle();
        }
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formVals } = this.state;
    dispatch({
      type: 'companyEdit/address',
      payload: {
        Content: {
          ...fields,
          Code: formVals.Code,
        },
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

  handleModalVisible = flag => {
    this.setState({
      LinkManmodalVisible: !!flag,
      AddressmodalVisible: !!flag,
    });
  };

  saveHandle = () => {
    // 保存主数据
    const { form, dispatch } = this.props;
    const { formVals } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'companyEdit/add',
        payload: {
          Content: {
            ...formVals.Content,
            ...fieldsValue,
            Status: fieldsValue.Status ? '1' : '2',
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('添加成功');
            router.push(`/main/TI_Z006/detail?Code=${response.Content.Code}`);
          }
        },
      });
    });
  };

  updateHandle = () => {
    // 更新主数据
    const { form, dispatch } = this.props;
    const { formVals } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'companyEdit/update',
        payload: {
          Content: {
            ...formVals,
            ...fieldsValue,
            Status: fieldsValue.Status ? '1' : '2',
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('更新成功');
            this.getSingle();
          }
        },
      });
    });
  };

  checkExist = value => {
    const { dispatch } = this.props;
    if (value) {
      dispatch({
        type: 'companyEdit/exist',
        payload: {
          Content: {
            SearchText: value,
            SearchKey: 'Name',
            ShowAll: 'Y',
          },
          page: 1,
          rows: 30,
          sidx: 'Code',
          sord: 'Desc',
        },
        callback: response => {
          if (response && response.Status === 200) {
            if (response.Content) {
              this.setState({
                dataSource: response.Content.rows,
              });
            }
          }
        },
      });
    }
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

  addLinkMan = () => {
    const {
      global: { currentUser },
    } = this.props;
    this.setState({
      LinkManmodalVisible: true,
      linkManVal: {
        Name: '',
        CellphoneNO: '',
        PhoneNO: '',
        Email: '',
        Position: '',
        Saler: currentUser.Owner,
        CompanyCode: '',
      },
    });
  };

  addAddressInfo = () => {
    this.setState({
      AddressmodalVisible: true,
      addressVal: {
        OrderID: 0,
        AddressID: 0,
        ProvinceID: '',
        Province: '',
        CityID: '',
        City: '',
        AreaID: '',
        Area: '',
        Address: '',
        UserName: '',
        ReceiverPhone: '',
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      global,
      location,
      global: { PayMent, Trnsp },
    } = this.props;
    const CardList = global.Card ? global.Card : [];
    const {
      formVals,
      tabIndex,
      LinkManmodalVisible,
      linkManVal,
      AddressmodalVisible,
      addressVal,
      dataSource,
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
      handleSubmit: this.handleLinkmanSubmit,
      handleModalVisible: this.handleModalVisible,
    };
    const addressParentMethods = {
      handleSubmit: this.handleAddressSubmit,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Card bordered={false}>
        <MyPageHeader {...location} />
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row gutter={8}>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Code" {...this.formLayout} label="客户ID">
                <span>{formVals.Code}</span>
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Name" {...this.formLayout} label="客户名称">
                {getFieldDecorator('Name', {
                  rules: [{ required: true, message: '请输入客户名称！' }],
                  initialValue: formVals.Name,
                })(
                  <AutoComplete
                    style={{ width: '100%' }}
                    onSearch={this.checkExist}
                    placeholder="请输入客户名称"
                  >
                    {dataSource.map(item => (
                      <Option value={item.Name} key={item.Code}>
                        {item.Name}
                      </Option>
                    ))}
                  </AutoComplete>
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="OpeningBank" {...this.formLayout} label="营业执照开户行">
                {getFieldDecorator('OpeningBank', {
                  initialValue: formVals.OpeningBank,
                })(<Input placeholder="请输入营业执照开户行！" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="BankAccount" {...this.formLayout} label="营业执照账户">
                {getFieldDecorator('BankAccount', {
                  initialValue: formVals.BankAccount,
                })(<Input placeholder="请输入营业执照账户" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Laddress" {...this.formLayout} label="营业执照地址">
                {getFieldDecorator('Laddress', {
                  initialValue: formVals.Laddress,
                })(<Input placeholder="请输入营业执照地址" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="LPhone" {...this.formLayout} label="营业执照电话">
                {getFieldDecorator('LPhone', {
                  initialValue: formVals.LPhone,
                })(<Input placeholder="请输入营业执照电话" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CreditCode" {...this.formLayout} label="营业执照信用代码">
                {getFieldDecorator('CreditCode', {
                  initialValue: formVals.CreditCode,
                })(<Input placeholder="请输入营业执照信用代码" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CusSource" {...this.formLayout} label="来源">
                {getFieldDecorator('CusSource', {
                  rules: [{ required: true, message: '请选择客户来源！' }],
                  initialValue: formVals.CusSource,
                })(<CardSource initialValue={formVals.CusSource} />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="PayMent" {...this.formLayout} label="付款条款">
                {getFieldDecorator('PayMent', {
                  rules: [{ required: true, message: '请选择付款条款！' }],
                  initialValue: formVals.PayMent,
                })(<MDMCommonality initialValue={formVals.PayMent} data={PayMent} />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CardType" {...this.formLayout} label="客户类型">
                {getFieldDecorator('CardType', {
                  rules: [{ required: true, message: '请选择客户类型！' }],
                  initialValue: formVals.CardType,
                })(<MDMCommonality initialValue={formVals.CardType} data={CardList} />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="LogisticsCompany" {...this.formLayout} label="默认物流公司">
                {getFieldDecorator('LogisticsCompany', {
                  rules: [{ required: true, message: '请输入默认物流公司！' }],
                  initialValue: formVals.LogisticsCompany,
                })(<MDMCommonality initialValue={formVals.LogisticsCompany} data={Trnsp} />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Status" {...this.formLayout} label="状态">
                {getFieldDecorator('Status', {
                  valuePropName: 'checked',
                  initialValue: formVals.Status === '1',
                })(<Switch checkedChildren="开启" unCheckedChildren="禁用" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>

        {formVals.Code ? (
          <Fragment>
            <Tabs onChange={this.tabChange} animated={false}>
              <TabPane tab="联系人" key="1">
                <StandardTable
                  data={{ list: formVals.TI_Z00602List }}
                  rowKey="UserID"
                  scroll={{ x: 1000 }}
                  columns={this.linkmanColumns}
                />
              </TabPane>
              <TabPane tab="收货地址" key="2">
                <StandardTable
                  data={{ list: formVals.TI_Z00603List }}
                  rowKey="AddressID"
                  scroll={{ x: 800 }}
                  columns={this.addressColumns}
                />
              </TabPane>
              <TabPane tab="收付款单" key="3">
                <OrctovpmFetch QueryType="2" QueryKey={formVals.Code} />
              </TabPane>
              <TabPane tab="客户询价单" key="4">
                <ClientAsk QueryType="3" QueryKey={formVals.Code} />
              </TabPane>
              <TabPane tab="销售订单物料查询" key="6">
                <OrderFetch QueryType="4" QueryKey={formVals.Code} />
              </TabPane>
              <TabPane tab="交货退货物料查询" key="7">
                <OdlnordnFetch QueryType="4" QueryKey={formVals.Code} />
              </TabPane>
              <TabPane tab="发票贷项物料查询" key="8">
                <OinvorinFetch QueryType="4" QueryKey={formVals.Code} />
              </TabPane>
              <TabPane tab="邮件发送记录" key="9">
                <SendEmail QueryType="5" QueryKey={formVals.Code} />
              </TabPane>
              <TabPane tab="打印记录" key="10">
                <PrintHistory QueryType="5" QueryKey={formVals.Code} />
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
        ) : null}
        <FooterToolbar>
          {formVals.Code ? (
            <Fragment>
              {this.rightButton(tabIndex)}
              <Button onClick={this.updateHandle} type="primary">
                更新
              </Button>
            </Fragment>
          ) : (
            <Button onClick={this.saveHandle} type="primary">
              保存
            </Button>
          )}
        </FooterToolbar>
      </Card>
    );
  }
}

export default CompanyEdit;
