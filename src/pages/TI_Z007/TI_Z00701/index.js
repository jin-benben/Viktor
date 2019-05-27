/* eslint-disable no-script-url */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Card, Switch, Tabs, Button, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import Brand from '@/components/Brand';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import LinkMan from '../components/linkman';
import MDMCommonality from '@/components/Select';
import { checkPhone, chechEmail } from '@/utils/utils';

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
          {/* <Divider type="vertical" />
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record.key)}>
            <a href="javascript:;">删除</a>
          </Popconfirm> */}
        </Fragment>
      ),
    },
  ];

  brandColumns = [
    {
      title: '品牌ID',
      dataIndex: 'Brand',
    },
    {
      title: '品牌名称',
      dataIndex: 'BrandName',
      render: (text, record) => (
        <Brand
          initialValue={{ key: record.Brand, label: record.BrandName }}
          labelInValue
          onChange={val => {
            this.brandLineChange(val, record);
          }}
        />
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
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Company', 'PayMent', 'Curr', 'Supplier'],
        },
      },
    });
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

  brandLineChange = (valuekey, record) => {
    // 品牌修改添加
    let { formVals } = this.state;
    const brandList = formVals.TI_Z00703List;
    brandList.map(brand => {
      if (record.Brand === brand.Brand) {
        const newbrand = brand;
        newbrand.Brand = valuekey.key;
        newbrand.BrandName = valuekey.label;
        if (newbrand.Brand && newbrand.BrandName) {
          this.addBrandFetch(newbrand, record);
        }
        return newbrand;
      }
      return brand;
    });
    formVals = { ...formVals, TI_Z00703List: [...brandList] };
    this.setState({ formVals });
  };

  addBrandFetch = (newbrand, record) => {
    // 保存品牌
    const { formVals } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierEdit/addbrand',
      payload: {
        Content: {
          ...record,
          ...newbrand,
          Code: formVals.Code,
        },
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
    });
  };

  saveHandle = () => {
    // 保存主数据
    const { form, dispatch } = this.props;
    const { formVals } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log({ ...formVals, ...fieldsValue }, formVals);
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
          if (response.Status === 200) {
            message.success('添加成功');
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
          if (response.Status === 200) {
            message.success('更新成功');
          }
        },
      });
    });
  };

  tabChange = tabIndex => {
    this.setState({ tabIndex });
  };

  addBrand = () => {
    let { formVals } = this.state;
    const brandList = formVals.TI_Z00703List;
    let OrderID = 1;
    if (brandList[brandList.length - 1]) {
      OrderID = brandList[brandList.length - 1].OrderID + 1;
    }
    brandList.push({ Brand: '', BrandName: '', OrderID });
    formVals = { ...formVals, TI_Z00703List: [...brandList] };
    this.setState({ formVals });
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
        <Button icon="plus" style={{ marginLeft: 8 }} type="primary" onClick={this.addBrand}>
          添加品牌
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

  render() {
    const {
      form: { getFieldDecorator },
      global: { Company, PayMent, Curr, Supplier },
    } = this.props;
    const { formVals, tabIndex, LinkManmodalVisible, linkManVal } = this.state;
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
    console.log(formVals);

    return (
      <Card>
        <Form {...formItemLayout}>
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
            {/* <Col lg={8} md={12} sm={24}>
              <FormItem key="CusSource" {...this.formLayout} label="来源">
                {getFieldDecorator('CusSource', {
                  rules: [{ required: true, message: '请选择来源！' }],
                  initialValue: formVals.CusSource,
                })(
                  <Select placeholder="请选择来源">
                    <Option value="1">线下</Option>
                    <Option value="2">网站</Option>
                    <Option value="3">其他渠道</Option>
                  </Select>
                )}
              </FormItem>
            </Col> */}
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
                  rowKey="UserID"
                  columns={this.linkmanColumns}
                />
              </TabPane>
              <TabPane tab="品牌" key="2">
                <StandardTable
                  data={{ list: formVals.TI_Z00703List }}
                  rowKey="Brand"
                  columns={this.brandColumns}
                />
              </TabPane>
            </Tabs>
            <LinkMan
              {...linkmanParentMethods}
              formVals={linkManVal}
              modalVisible={LinkManmodalVisible}
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
