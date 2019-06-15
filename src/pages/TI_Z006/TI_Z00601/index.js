/* eslint-disable no-script-url */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Card, Switch, Tabs, Button, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import AddressInfo from '../components/address';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import LinkMan from '../components/linkman';
import CardSource from '@/components/Select/CardSource';
import MDMCommonality from '@/components/Select';
import router from 'umi/router';
import { getName } from '@/utils/utils';

const { TabPane } = Tabs;

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
      dataIndex: 'Name',
    },
    {
      title: '手机号码',
      dataIndex: 'CellphoneNO',
    },
    {
      title: '电话号码',
      dataIndex: 'PhoneNO',
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
      render: text => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, text)}</span>;
      },
    },
    {
      title: '交易公司',
      dataIndex: 'CompanyCode',
      render: text => {
        const {
          global: { Company },
        } = this.props;
        return <span>{getName(Company, text)}</span>;
      },
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
      dataIndex: 'AddressName',
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
          <span>{`${record.Province + record.City + record.Area}`}</span>
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

  handleLinkmanSubmit = fields => {
    const { dispatch } = this.props;
    const { formVals } = this.state;
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
                })(<Input placeholder="请输入客户名称" />)}
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
            <Tabs onChange={this.tabChange}>
              <TabPane tab="联系人" key="1">
                <StandardTable
                  data={{ list: formVals.TI_Z00602List }}
                  rowKey="UserID"
                  columns={this.linkmanColumns}
                />
              </TabPane>
              <TabPane tab="收货地址" key="2">
                <StandardTable
                  data={{ list: formVals.TI_Z00603List }}
                  rowKey="AddressID"
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
