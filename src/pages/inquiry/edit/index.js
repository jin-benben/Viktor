/* eslint-disable no-param-reassign */
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
  Switch,
  Modal,
  Popconfirm,
  message,
  DatePicker,
  Select,
} from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import EditableFormTable from '@/components/EditableFormTable';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import UpdateLoad from '../components/modal';
import SKUModal from '@/components/Modal/SKU';
import Address from '@/components/Address';
import Staffs from '@/components/Staffs';
import Brand from '@/components/Brand';
import LinkMan from '../components/linkman';
import CompanySelect from '@/components/Company/select';
import { checkPhone, chechEmail } from '@/utils/utils';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;
@connect(({ inquiryEdit, loading }) => ({
  inquiryEdit,
  loading: loading.models.inquiryEdit,
}))
@Form.create()
class InquiryEdit extends React.Component {
  skuColumns = [
    {
      title: '行号',
      dataIndex: 'LineID',
      width: 50,
      align: 'center',
    },
    {
      title: 'SKU',
      dataIndex: 'SKU',
      align: 'center',
      width: 150,
      render: (text, record, index) => (
        <Input
          value={record.SKU}
          placeholder="选择SKU"
          onClick={() => {
            this.focusLine(record, index);
          }}
        />
      ),
    },
    {
      title: '产品描述',
      dataIndex: 'SKUName',
      inputType: 'textArea',
      width: 150,
      editable: true,
      align: 'center',
    },
    {
      title: '品牌',
      width: 150,
      align: 'center',
      dataIndex: 'BrandName',
      render: (text, record, index) => (
        <Brand
          defaultValue={record.BrandName}
          keyType="Name"
          onChange={value => {
            this.brandChange(value, record, index, 'BrandName');
          }}
        />
      ),
    },
    {
      title: '名称',
      dataIndex: 'ProductName',
      inputType: 'text',
      width: 150,
      editable: true,
      align: 'center',
    },
    {
      title: '型号',
      width: 150,
      dataIndex: 'ManufactureNO',
      inputType: 'text',
      editable: true,
      align: 'center',
    },
    {
      title: '参数',
      width: 150,
      dataIndex: 'Parameters',
      inputType: 'text',
      editable: true,
      align: 'center',
    },
    {
      title: '包装',
      width: 150,
      dataIndex: 'Package',
      inputType: 'text',
      editable: true,
      align: 'center',
    },
    {
      title: '采购员',
      width: 150,
      dataIndex: 'Purchaser',
      editable: true,
      align: 'center',
    },
    {
      title: '数量',
      width: 120,
      inputType: 'text',
      dataIndex: 'Quantity',
      editable: true,
      align: 'center',
    },
    {
      title: '单位',
      width: 80,
      inputType: 'text',
      dataIndex: 'Unit',
      editable: true,
      align: 'center',
    },
    {
      title: '要求交期',
      width: 150,
      inputType: 'date',
      dataIndex: 'DueDate',
      editable: true,
      align: 'center',
    },
    {
      title: '询价最终价格',
      width: 100,
      inputType: 'text',
      dataIndex: 'InquiryPrice',
      editable: true,
      align: 'center',
    },
    {
      title: '销售建议价格',
      width: 100,
      inputType: 'text',
      dataIndex: 'Price',
      editable: true,
      align: 'center',
    },
    {
      title: '询价币种',
      width: 150,
      inputType: 'text',
      dataIndex: 'Currency',
      editable: true,
      align: 'center',
    },
    {
      title: '单据汇率',
      width: 150,
      inputType: 'text',
      dataIndex: 'DocRate',
      editable: true,
      align: 'center',
    },
    {
      title: '询价最终交期',
      width: 150,
      inputType: 'date',
      dataIndex: 'InquiryDueDate',
      editable: true,
      align: 'center',
    },
    {
      title: '询价备注',
      dataIndex: 'InquiryComment',
      inputType: 'textArea',
      width: 150,
      editable: true,
      align: 'center',
    },
    {
      title: '询价行总计',
      width: 120,
      align: 'center',
      dataIndex: 'InquiryLineTotal',
    },
    {
      title: '销售行总计',
      width: 150,
      align: 'center',
      dataIndex: 'LineTotal',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 80,
      render: (text, record, index) => (
        <Fragment>
          <Icon
            title="预览"
            type="eye"
            onClick={() => this.lookLineAttachment(record, index)}
            style={{ color: '#08c', marginRight: 5 }}
          />
          <Icon
            title="上传附件"
            className="icons"
            style={{ color: '#08c', marginRight: 5, marginLeft: 5 }}
            type="cloud-upload"
            onClick={() => this.skuLineAttachment(record, index)}
          />
          <Icon
            title="删除行"
            className="icons"
            type="delete"
            theme="twoTone"
            onClick={() => this.deleteSKULine(record, index)}
          />
        </Fragment>
      ),
    },
  ];

  attachmentColumns = [
    {
      title: '序号',
      width: 80,
      align: 'center',
      dataIndex: 'OrderID',
    },
    {
      title: '来源类型',
      align: 'center',
      dataIndex: 'BaseType',
    },
    {
      title: '来源单号',
      align: 'center',
      dataIndex: 'BaseEntry',
    },
    {
      title: '附件代码',
      align: 'center',
      dataIndex: 'AttachmentCode',
    },
    {
      title: '附件描述',
      align: 'center',
      dataIndex: 'AttachmentName',
    },
    {
      title: '附件路径',
      align: 'center',
      dataIndex: 'AttachmentPath',
      render: text => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>,
    },

    {
      title: '操作',
      align: 'center',
      render: (text, record, index) => (
        <Fragment>
          <a target="_blnk" href={record.AttachmentPath}>
            <Icon title="预览" type="eye" style={{ color: '#08c', marginRight: 5 }} />
          </a>
          <Icon
            title="删除行"
            type="delete"
            theme="twoTone"
            onClick={() => this.deleteLine(record, index)}
          />
        </Fragment>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      formVals: {},
      tabIndex: '1',
      uploadmodalVisible: false,
      attachmentVisible: false,
      skuModalVisible: false,
      LineID: Number,
      linkmanList: [],
      thisLine: {
        TI_Z02604: [],
      },
    };
    this.formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.DocEntry) {
      dispatch({
        type: 'inquiryEdit/fetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
          },
        },
      });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.inquiryEdit.inquiryDetail !== prevState.formVals) {
      return {
        formVals: nextProps.inquiryEdit.inquiryDetail,
      };
    }
    return null;
  }

  //  行内容改变
  rowChange = record => {
    const { formVals } = this.state;
    let DocTotal = 0;
    let InquiryDocTotalLocal = 0;
    let InquiryDocTotl = 0;
    formVals.TI_Z02602.map(item => {
      if (item.key === record.key) {
        record.InquiryLineTotalLocal = record.Quantity * record.InquiryLineTotal;
        record.LineTotalLocal;
        return record;
      }
      return item;
    });
    // console.log(data)
    this.setState({ formVals: { ...formVals } });
  };

  // 品牌

  brandChange = (value, record, index) => {
    const { formVals } = this.state;
    record.BrandName = value;
    formVals.TI_Z02602[index] = record;
    this.setState({ formVals: { ...formVals } });
  };

  // sku输入框获取焦点
  focusLine = (record, LineID) => {
    console.log('sss');
    this.setState({ thisLine: { ...record }, LineID, skuModalVisible: true });
  };

  // 物料弹出返回
  changeLineSKU = selection => {
    const [select] = selection;
    const { thisLine, LineID, formVals } = this.state;
    formVals.TI_Z02602[LineID] = { ...thisLine, ...select, SKU: select.Code, SKUName: select.Name };
    this.setState({ formVals: { ...formVals } });
    this.handleModalVisible(false);
  };

  // 删除附件
  deleteLine = (record, index) => {
    const { formVals, LineID } = this.state;
    if (LineID >= 0) {
      formVals.TI_Z02602[LineID].TI_Z02604.splice(index, 1);
    } else {
      formVals.TI_Z02603.splice(index, 1);
    }
    this.setState({ formVals: { ...formVals } });
  };

  // 行物料附件弹窗显隐
  skuLineAttachment = (record, index) => {
    this.setState({ LineID: index, uploadmodalVisible: true });
  };

  // 查看行物料

  lookLineAttachment = (record, index) => {
    this.setState({ LineID: index, attachmentVisible: true, thisLine: { ...record } });
  };

  // 删除行物料
  deleteSKULine = (record, index) => {
    const { formVals } = this.state;
    formVals.TI_Z02602.splice(index, 1);
    this.setState({ formVals: { ...formVals } });
  };

  // 获取上传成功附件，插入到对应数组
  handleSubmit = fieldsValue => {
    const { AttachmentPath, AttachmentCode, AttachmentName } = fieldsValue;
    const { formVals, LineID } = this.state;
    const lastsku = formVals.TI_Z02603[formVals.TI_Z02603.length - 1];
    if (fieldsValue.AttachmentPath) {
      if (LineID >= 0) {
        const thisLine = formVals.TI_Z02602[LineID].TI_Z02604;
        const last = thisLine[thisLine.length - 1];
        const ID = last ? last.LineID + 1 : 1;
        formVals.TI_Z02602[LineID].TI_Z02604.push({
          LineID: ID,
          BaseType: formVals.OrderType,
          BaseEntry: formVals.BaseEntry ? formVals.BaseEntry : 1,
          BaseLineID: last ? last.BaseLineID + 1 : 1,
          AttachmentPath,
          AttachmentCode,
          AttachmentName,
        });
      } else {
        formVals.TI_Z02603.push({
          LineID: lastsku ? lastsku.LineID + 1 : 1,
          BaseType: formVals.OrderType,
          BaseEntry: formVals.BaseEntry ? formVals.BaseEntry : 1,
          BaseLineID: lastsku ? lastsku.BaseLineID + 1 : 1,
          AttachmentPath,
          AttachmentCode,
          AttachmentName,
        });
      }
      this.setState({ formVals: { ...formVals } });
    }
    this.handleModalVisible(false);
  };

  // 弹窗隐藏
  handleModalVisible = flag => {
    this.setState({
      uploadmodalVisible: !!flag,
      attachmentVisible: !!flag,
      skuModalVisible: !!flag,
      LineID: Number,
    });
  };

  tabChange = tabIndex => {
    this.setState({ tabIndex });
  };

  rightButton = tabIndex => {
    if (tabIndex === '1') {
      return (
        <Button icon="plus" style={{ marginLeft: 8 }} type="primary" onClick={this.addLineSku}>
          添加新物料
        </Button>
      );
    }
    if (tabIndex === '3') {
      return (
        <Button
          icon="plus"
          style={{ marginLeft: 8 }}
          type="primary"
          onClick={() => {
            this.setState({ uploadmodalVisible: true });
          }}
        >
          添加新附件
        </Button>
      );
    }
    return null;
  };

  // change 客户
  changeCompany = company => {
    const { formVals } = this.state;
    formVals.CardCode = company.Code;
    formVals.CardName = company.Name;
    this.setState({ formVals: { ...formVals }, linkmanList: [...company.TI_Z00602List] });
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

  addLineSku = () => {
    // 添加物料
    const { formVals } = this.state;
    const last = formVals.TI_Z02602[formVals.TI_Z02602.length - 1];
    const LineID = last ? last.LineID + 1 : 1;
    formVals.TI_Z02602.push({
      LineID,
      SKU: '',
      SKUName: '',
      BrandName: '',
      ProductName: '',
      ManufactureNO: '',
      Parameters: '',
      Package: '',
      Purchaser: '',
      Quantity: '',
      Unit: '',
      DueDate: '',
      InquiryPrice: '',
      Price: '',
      InquiryDueDate: '',
      InquiryComment: '',
      InquiryLineTotal: '',
      InquiryLineTotalLocal: '',
      LineTotal: '',
      Currency: '',
      DocRate: '',
      TI_Z02604: [],
    });
    this.setState({ formVals });
  };

  saveHandle = () => {
    // 保存主数据
    const { form, dispatch } = this.props;
    const { formVals } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let address;
      if (fieldsValue.address) {
        address = { ...fieldsValue.address };
      }
      delete fieldsValue.address;
      dispatch({
        type: 'inquiryEdit/add',
        payload: {
          Content: {
            ...formVals,
            ...fieldsValue,
            ...address,
            CreateDate: fieldsValue.CreateDate ? fieldsValue.CreateDate.format('YYYY-MM-DD') : '',
            DueDate: fieldsValue.DueDate ? fieldsValue.DueDate.format('YYYY-MM-DD') : '',
            ToDate: fieldsValue.ToDate ? fieldsValue.ToDate.format('YYYY-MM-DD') : '',
            DocDate: fieldsValue.DocDate ? fieldsValue.DocDate.format('YYYY-MM-DD') : '',
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
      let address;
      if (fieldsValue.address) {
        address = { ...fieldsValue.address };
      }
      delete fieldsValue.address;
      dispatch({
        type: 'inquiryEdit/update',
        payload: {
          Content: {
            ...formVals,
            ...fieldsValue,
            ...address,
            CreateDate: fieldsValue.CreateDate ? fieldsValue.CreateDate.format('YYYY-MM-DD') : '',
            DueDate: fieldsValue.DueDate ? fieldsValue.DueDate.format('YYYY-MM-DD') : '',
            ToDate: fieldsValue.ToDate ? fieldsValue.ToDate.format('YYYY-MM-DD') : '',
            DocDate: fieldsValue.DocDate ? fieldsValue.DocDate.format('YYYY-MM-DD') : '',
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

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      formVals,
      tabIndex,
      thisLine,
      linkmanList,
      uploadmodalVisible,
      skuModalVisible,
      attachmentVisible,
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
    const uploadmodalMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };

    const parentMethods = {
      handleSubmit: this.changeLineSKU,
      handleModalVisible: this.handleModalVisible,
    };
    console.log(linkmanList);
    return (
      <Card>
        <Form {...formItemLayout}>
          <Row gutter={8}>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CardCode" {...this.formLayout} label="客户ID">
                {getFieldDecorator('CardCode', {
                  rules: [{ required: true, message: '请选择客户！' }],
                  initialValue: formVals.CardCode,
                })(
                  <CompanySelect
                    initialValue={formVals.CardCode}
                    onChange={this.changeCompany}
                    keyType="Code"
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
                  <CompanySelect
                    initialValue={formVals.CardName}
                    onChange={this.changeCompany}
                    keyType="Name"
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="DocDate" {...this.formLayout} label="单据日期">
                {getFieldDecorator('DocDate', {
                  rules: [{ required: true, message: '请选择单据日期！' }],
                  initialValue: formVals.DocDate ? moment(formVals.DocDate, 'YYYY-MM-DD') : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Contacts" {...this.formLayout} label="联系人">
                {getFieldDecorator('Contacts', {
                  rules: [{ required: true, message: '请输入联系人！' }],
                  initialValue: formVals.Contacts,
                })(<LinkMan data={linkmanList} />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="OrderType" {...this.formLayout} label="订单类型">
                {getFieldDecorator('OrderType', {
                  initialValue: formVals.OrderType,
                  rules: [{ required: true, message: '请选择订单类型！' }],
                })(
                  <Select placeholder="请选择订单类型">
                    <Option value="1">正常订单</Option>
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
            {formVals.DocStatus ? (
              <Col lg={8} md={12} sm={24}>
                <FormItem key="DocStatus" {...this.formLayout} label="状态">
                  <span>{formVals.DocStatus === 'O' ? '未清' : '已清'}</span>
                </FormItem>
              </Col>
            ) : null}
          </Row>
        </Form>
        <Tabs tabBarExtraContent={this.rightButton(tabIndex)} onChange={this.tabChange}>
          <TabPane tab="物料" key="1">
            <EditableFormTable
              rowChange={this.rowChange}
              page
              rowKey="LineID"
              scroll={{ x: 2400 }}
              columns={this.skuColumns}
              data={formVals.TI_Z02602}
            />
            <Row style={{ marginTop: 20 }} gutter={8}>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="Owner" {...this.formLayout} label="所有人">
                  {getFieldDecorator('Owner', {
                    initialValue: formVals.Owner,
                    rules: [{ required: true, message: '请选择所有人！' }],
                  })(<Staffs />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="CreateDate" {...this.formLayout} label="创建日期">
                  {getFieldDecorator('CreateDate', {
                    initialValue: formVals.CreateDate
                      ? moment(formVals.CreateDate, 'YYYY-MM-DD')
                      : null,
                  })(<DatePicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="DocTotal" {...this.formLayout} label="销售总计">
                  {getFieldDecorator('DocTotal', {
                    initialValue: formVals.DocTotal,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="InquiryDocTotal" {...this.formLayout} label="询价总计(外币)">
                  {getFieldDecorator('InquiryDocTotal', {
                    initialValue: formVals.InquiryDocTotal,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="常规" key="2">
            <Row gutter={8}>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="CellphoneNO" {...this.formLayout} label="联系人手机号码">
                  {getFieldDecorator('CellphoneNO', {
                    initialValue: formVals.CellphoneNO,
                    rules: [{ required: true, message: '请输入联系人手机号码！' }],
                  })(<Input placeholder="联系人手机号码" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="PhoneNO" {...this.formLayout} label="联系人电话">
                  {getFieldDecorator('PhoneNO', {
                    initialValue: formVals.PhoneNO,
                  })(<Input placeholder="电话号码" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="Email " {...this.formLayout} label="联系人邮箱">
                  {getFieldDecorator('Email', {
                    rules: [{ validator: this.validatorEmail }],
                    initialValue: formVals.Email,
                  })(<Input placeholder="请输入邮箱" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="address" {...this.formLayout} label="地址">
                  {getFieldDecorator('address', {
                    rules: [{ required: true, message: '请选择地址！' }],
                    initialValue: [
                      formVals.ProvinceID,
                      formVals.CityID,
                      formVals.AreaID,
                      formVals.StreetID,
                    ],
                  })(<Address style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="Address" {...this.formLayout} label="地址">
                  {getFieldDecorator('Address', {
                    rules: [{ required: true, message: '请输入详细地址！' }],
                    initialValue: formVals.Address,
                  })(<Input placeholder="请输入详细地址！" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="CompanyCode" {...this.formLayout} label="交易公司">
                  {getFieldDecorator('CompanyCode', {
                    initialValue: formVals.CompanyCode,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="SourceType" {...this.formLayout} label="来源类型">
                  {getFieldDecorator('SourceType', {
                    initialValue: formVals.SourceType,
                    rules: [{ required: true, message: '请选择来源类型！' }],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      <Option value="1">销售下单</Option>
                      <Option value="2">网站下单</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="Comment" {...this.formLayout} label="备注">
                  {getFieldDecorator('Comment', {
                    initialValue: formVals.Comment,
                  })(<Input placeholder="请输入备注" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="ToDate" {...this.formLayout} label="有效期至">
                  {getFieldDecorator('ToDate', {
                    initialValue: formVals.ToDate ? moment(formVals.ToDate, 'YYYY-MM-DD') : null,
                  })(<DatePicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="DueDate" {...this.formLayout} label="要求交期">
                  {getFieldDecorator('DueDate', {
                    initialValue: formVals.DueDate ? moment(formVals.DueDate, 'YYYY-MM-DD') : null,
                    rules: [{ required: true, message: '请选择要求交期！' }],
                  })(<DatePicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="IsInquiry" {...this.formLayout} label="是否询价">
                  {getFieldDecorator('IsInquiry', {
                    initialValue: formVals.IsInquiry,
                    rules: [{ required: true, message: '请选择是否询价！' }],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择是否询价">
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="CreateUser" {...this.formLayout} label="创建人">
                  <span>创建人</span>
                </FormItem>
              </Col>
              {formVals.DocEntry ? (
                <Fragment>
                  <Col lg={8} md={12} sm={24}>
                    <FormItem key="InquiryDocTotal" {...this.formLayout} label="主单状态">
                      <span>主单状态</span>
                    </FormItem>
                  </Col>
                  <Col lg={8} md={12} sm={24}>
                    <FormItem key="Closed" {...this.formLayout} label="关闭状态">
                      <Switch
                        checkedChildren="开"
                        disabled
                        unCheckedChildren="关"
                        checked={formVals.Closed === 'Y'}
                      />
                    </FormItem>
                  </Col>
                  <Col lg={8} md={12} sm={24}>
                    <FormItem key="ClosedBy " {...this.formLayout} label="关闭人">
                      <span>关闭人</span>
                    </FormItem>
                  </Col>
                </Fragment>
              ) : null}
            </Row>
          </TabPane>
          <TabPane tab="附件" key="3">
            <StandardTable
              data={{ list: formVals.TI_Z02603 }}
              rowKey="LineID"
              columns={this.attachmentColumns}
            />
          </TabPane>
        </Tabs>

        <FooterToolbar>
          {formVals.DocEntry ? (
            <Button onClick={this.updateHandle} type="primary">
              更新
            </Button>
          ) : (
            <Button onClick={this.saveHandle} type="primary">
              保存
            </Button>
          )}
        </FooterToolbar>
        <UpdateLoad {...uploadmodalMethods} modalVisible={uploadmodalVisible} />
        <SKUModal {...parentMethods} modalVisible={skuModalVisible} />
        <Modal
          width={640}
          destroyOnClose
          title="物料行附件"
          visible={attachmentVisible}
          onOk={() => this.handleModalVisible(false)}
          onCancel={() => this.handleModalVisible(false)}
        >
          <StandardTable
            data={{ list: thisLine.TI_Z02604 }}
            rowKey="LineID"
            columns={this.attachmentColumns}
          />
        </Modal>
      </Card>
    );
  }
}

export default InquiryEdit;
