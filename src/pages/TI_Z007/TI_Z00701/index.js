/* eslint-disable no-script-url */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Card, Switch, Tabs, Button, message, Popconfirm } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import StandardTable from '@/components/StandardTable';
import BrandModal from '@/components/Modal/Brand';
import SendEmail from '@/components/Order/SendEmail';
import PrintHistory from '@/components/Order/PrintHistory';
import SupplierAsk from '@/components/Order/TI_Z027';
import LinkMan from '../components/linkman';
import MDMCommonality from '@/components/Select';
import MyIcon from '@/components/MyIcon';

const { TabPane } = Tabs;

const FormItem = Form.Item;

@connect(({ supplierEdit, loading, global }) => ({
  supplierEdit,
  global,
  loading: loading.models.supplierEdit,
}))
@Form.create()
class CompanyEdit extends React.Component {
  linkmanColumns = [
    {
      title: 'ID',
      dataIndex: 'LineID',
      width: 50,
    },
    {
      title: '姓名',
      width: 150,
      dataIndex: 'Name',
    },
    {
      title: '手机号码',
      width: 150,
      dataIndex: 'CellphoneNO',
    },
    {
      title: '电话号码',
      width: 150,
      dataIndex: 'PhoneNO',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
    },
    {
      title: '职位',
      width: 100,
      dataIndex: 'Position',
    },
    {
      title: '操作',
      width: 50,
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() =>
              this.handleUpdateModalVisible(true, record, 'LinkManmodalVisible', 'linkManVal')
            }
          >
            <MyIcon type="iconedit" />
          </a>
        </Fragment>
      ),
    },
  ];

  brandColumns = [
    {
      title: '品牌ID',
      dataIndex: 'Brand',
      width: 100,
    },
    {
      title: '品牌名称',
      width: 200,
      dataIndex: 'BrandName',
      render: (text, record) => (
        <Link target="_blank" to={`/main/product/TI_Z005/detail?Code=${record.Brand}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '操作',
      width: 50,
      render: (text, record) => (
        <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record.Brand)}>
          <a href="javascript:;">
            {' '}
            <MyIcon type="iconshanchu" />
          </a>
        </Popconfirm>
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
        Currency: '',
        CheckCompanyName: '',
        CheckAddreName: '',
        CheckContacts: '',
      },
      tabIndex: '1',
      LinkManmodalVisible: false,
      brandmodalVisible: false,
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
    const {
      dispatch,
      global: { BrandList },
    } = this.props;
    if (!BrandList.length) {
      dispatch({
        type: 'global/getBrand',
      });
    }
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Company', 'PayMent', 'Curr', 'Supplier'],
          Key: 'p',
        },
      },
    });
    this.getDetail();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierEdit/save',
      payload: {
        supplierDetail: {},
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.supplierEdit.supplierDetail.Code &&
      nextProps.supplierEdit.supplierDetail !== prevState.formVals
    ) {
      return {
        formVals: nextProps.supplierEdit.supplierDetail,
      };
    }
    return null;
  }

  getDetail = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.Code) {
      dispatch({
        type: 'supplierEdit/fetch',
        payload: {
          Content: {
            Code: query.Code,
          },
        },
      });
    }
  };

  addBrandFetch = selectedRows => {
    // 保存品牌
    const { formVals } = this.state;

    const { dispatch } = this.props;
    const last = formVals.TI_Z00703List[formVals.TI_Z00703List.length - 1];
    const TI_Z00703 = selectedRows.map(item => {
      const { Code, Name } = item;
      return {
        Brand: Code,
        BrandName: Name,
        Code: formVals.Code,
        LineID: last ? last.LineID + 1 : 1,
      };
    });

    dispatch({
      type: 'supplierEdit/addbrand',
      payload: {
        Content: {
          Code: formVals.Code,
          TI_Z00703,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('添加成功');
          this.handleModalVisible(false);
          this.getDetail();
        }
      },
    });
  };

  // 删除品牌
  handleDelete = Brand => {
    const { formVals } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierEdit/deletebrand',
      payload: {
        Content: {
          Code: formVals.Code,
          Brand,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('删除成功');
          this.handleModalVisible(false);
          this.getDetail();
        }
      },
    });
  };

  handleLinkmanSubmit = fields => {
    const { dispatch } = this.props;
    const { formVals } = this.state;
    dispatch({
      type: 'supplierEdit/linkman',
      payload: {
        Content: {
          ...fields,
          Code: formVals.Code,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('保存成功');
          this.handleModalVisible(false);
          this.getDetail();
        }
      },
    });
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
      brandmodalVisible: !!flag,
    });
  };

  saveHandle = () => {
    // 保存主数据
    const { form, dispatch } = this.props;
    const { formVals } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'supplierEdit/add',
        payload: {
          Content: {
            ...formVals,
            ...fieldsValue,
            Status: fieldsValue.Status ? '1' : '2',
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('添加成功');
            router.push(`/main/TI_Z007/detail?Code=${response.Content.Code}`);
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
        type: 'supplierEdit/update',
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
            this.getDetail();
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
          添加联系人
        </Button>
      );
    }
    if (tabIndex === '2') {
      return (
        <Button
          icon="plus"
          style={{ marginLeft: 8 }}
          type="primary"
          onClick={() => this.handleModalVisible(true)}
        >
          添加品牌
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

  render() {
    const {
      form: { getFieldDecorator },
      global: { Company, PayMent, Curr, Supplier },
    } = this.props;
    const { formVals, tabIndex, LinkManmodalVisible, linkManVal, brandmodalVisible } = this.state;
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
    const brandParentMethods = {
      handleSubmit: this.addBrandFetch,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Card bordered={false}>
        <Form {...formItemLayout}>
          <Row gutter={8}>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Code" {...this.formLayout} label="供应商ID">
                <span>{formVals.Code}</span>
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Name" {...this.formLayout} label="供应商名称">
                {getFieldDecorator('Name', {
                  rules: [{ required: true, message: '请输入供应商名称！' }],
                  initialValue: formVals.Name,
                })(<Input placeholder="请输入供应商名称" />)}
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
              <FormItem key="PayMent" {...this.formLayout} label="付款条款">
                {getFieldDecorator('PayMent', {
                  rules: [{ required: true, message: '请选择付款条款！' }],
                  initialValue: formVals.PayMent,
                })(<MDMCommonality initialValue={formVals.PayMent} data={PayMent} />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CardType" {...this.formLayout} label="供应商类型">
                {getFieldDecorator('CardType', {
                  rules: [{ required: true, message: '请选择类型！' }],
                  initialValue: formVals.CardType,
                })(<MDMCommonality initialValue={formVals.CardType} data={Supplier} />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Currency" {...this.formLayout} label="交易币种 ">
                {getFieldDecorator('Currency', {
                  rules: [{ required: true, message: '请输入交易币种！' }],
                  initialValue: formVals.Currency,
                })(
                  <MDMCommonality
                    initialValue={formVals.Currency}
                    data={Curr}
                    placeholder="请输入交易币种"
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CompanyCode" {...this.formLayout} label="交易主体">
                {getFieldDecorator('CompanyCode', {
                  rules: [{ required: true, message: '请选择交易主体！' }],
                  initialValue: formVals.CompanyCode,
                })(<MDMCommonality initialValue={formVals.CompanyCode} data={Company} />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CheckCompanyName" {...this.formLayout} label="支票汇款公司名称 ">
                {getFieldDecorator('CheckCompanyName', {
                  rules: [{ required: true, message: '请输入支票汇款公司名称' }],
                  initialValue: formVals.CheckCompanyName,
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CheckAddreName" {...this.formLayout} label="支票汇款地址">
                {getFieldDecorator('CheckAddreName', {
                  rules: [{ required: true, message: '请输入支票汇款地址！' }],
                  initialValue: formVals.CheckAddreName,
                })(<Input placeholder="请输入支票汇款地址" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CheckContacts" {...this.formLayout} label="支票汇款联系人">
                {getFieldDecorator('CheckContacts', {
                  rules: [{ required: true, message: '请输入支票汇款联系人！' }],
                  initialValue: formVals.CheckContacts,
                })(<Input placeholder="请输入支票汇款联系人" />)}
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
                  data={{ list: formVals.TI_Z00702List }}
                  scroll={{ x: 1000 }}
                  rowKey="LineID"
                  columns={this.linkmanColumns}
                />
              </TabPane>
              <TabPane tab="品牌" key="2">
                <StandardTable
                  data={{ list: formVals.TI_Z00703List }}
                  rowKey="Brand"
                  scroll={{ x: 500 }}
                  columns={this.brandColumns}
                />
              </TabPane>
              <TabPane tab="采购询价单" key="5">
                {formVals.Name ? <SupplierAsk QueryType="3" QueryKey={formVals.Code} /> : ''}
              </TabPane>
              <TabPane tab="邮件发送记录" key="6">
                {formVals.Name ? <SendEmail QueryType="6" QueryKey={formVals.Code} /> : ''}
              </TabPane>
              <TabPane tab="打印记录" key="10">
                <PrintHistory QueryType="6" QueryKey={formVals.Code} />
              </TabPane>
            </Tabs>
            <LinkMan
              {...linkmanParentMethods}
              formVals={linkManVal}
              modalVisible={LinkManmodalVisible}
            />
            <BrandModal {...brandParentMethods} modalVisible={brandmodalVisible} />
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
