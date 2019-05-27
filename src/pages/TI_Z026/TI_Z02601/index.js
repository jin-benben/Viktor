/* eslint-disable no-restricted-globals */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-script-url */
import React, { Fragment } from 'react';
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
  message,
  DatePicker,
  Select,
} from 'antd';
import moment from 'moment';
import round from 'lodash/round';
import router from 'umi/router';
import CancelOrder from '@/components/Modal/CancelOrder';
import StandardTable from '@/components/StandardTable';
import EditableFormTable from '@/components/EditableFormTable';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import UpdateLoad from '../components/modal';
import SKUModal from '@/components/Modal/SKU';
import Address from '@/components/Address';
import Brand from '@/components/Brand';
import LinkMan from '../components/linkman';
import MDMCommonality from '@/components/Select';
import NeedAskPrice from '../components/needAskPrice';
import CompanySelect from '@/components/Company/index';
import { checkPhone, getName, chechEmail } from '@/utils/utils';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;
@connect(({ inquiryEdit, loading, global }) => ({
  inquiryEdit,
  global,
  loading: loading.models.inquiryEdit,
}))
@Form.create()
class InquiryEdit extends React.Component {
  skuColumns = [
    {
      title: '行号',
      dataIndex: 'LineID',
      width: 50,
      fixed: 'left',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? <span style={{ fontWeight: 'bolder' }}>合计</span> : text,
    },
    {
      title: 'SKU',
      dataIndex: 'SKU',
      align: 'center',
      width: 150,
      render: (text, record, index) =>
        record.lastIndex ? null : (
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
      width: 200,
      align: 'center',
    },
    {
      title: '品牌',
      width: 200,
      align: 'center',
      dataIndex: 'BrandName',
      render: (text, record, index) =>
        record.lastIndex ? null : (
          <Brand
            initialValue={record.BrandName}
            keyType="Name"
            onChange={value => {
              this.rowSelectChange(value, record, index, 'BrandName');
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
      title: '仓库',
      width: 150,
      dataIndex: 'WhsCode',
      align: 'center',
      render: (text, record, index) => {
        const {
          global: { WhsCode },
        } = this.props;
        if (!record.lastIndex) {
          return (
            <MDMCommonality
              onChange={value => {
                this.rowSelectChange(value, record, index, 'WhsCode');
              }}
              initialValue={text}
              data={WhsCode}
            />
          );
        }
        return null;
      },
    },

    {
      title: '销售建议价',
      width: 120,
      inputType: 'text',
      dataIndex: 'Price',
      editable: true,
      align: 'center',
    },
    {
      title: '询价最终价',
      width: 120,
      dataIndex: 'InquiryPrice',
      align: 'center',
    },
    {
      title: '询价币种',
      width: 100,
      dataIndex: 'Currency',
      align: 'center',
    },
    {
      title: '单据汇率',
      width: 100,
      inputType: 'text',
      dataIndex: 'DocRate',
      align: 'center',
    },
    {
      title: '最终交期',
      width: 150,
      dataIndex: 'InquiryDueDate',
      align: 'center',
    },
    {
      title: '采购员',
      width: 200,
      dataIndex: 'Purchaser',
      align: 'center',
      render: text => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, text)}</span>;
      },
    },
    {
      title: '询价备注',
      dataIndex: 'InquiryComment',
      width: 150,
      align: 'center',
    },
    {
      title: '询价行总计',
      width: 120,
      align: 'center',
      dataIndex: 'InquiryLineTotal',
    },
    {
      title: '询价行总计(本币)',
      width: 150,
      align: 'center',
      dataIndex: 'InquiryLineTotalLocal',
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
      render: (text, record, index) =>
        record.lastIndex ? null : (
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
      dataIndex: 'LineID',
    },
    {
      title: '来源类型',
      align: 'center',
      dataIndex: 'BaseType',
      render: text => <span>{text === '1' ? '正常订单' : '未知'}</span>,
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
      formVals: {}, // 单据信息
      tabIndex: '1', // tab
      uploadmodalVisible: false, // 上传Modal
      attachmentVisible: false, // 附件Modal
      skuModalVisible: false, // 物料选择 Modal
      needmodalVisible: false,
      LineID: Number, // 当前选中行index
      linkmanList: [], // 联系人list
      thisLine: {
        // 当前行
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
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Purchaser', 'WhsCode', 'Company'],
        },
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inquiryEdit/save',
      payload: {
        inquiryDetail: {
          Comment: '',
          SDocStatus: '',
          PDocStatus: '',
          Closed: '',
          ClosedBy: '',
          SourceType: '',
          OrderType: '',
          DocDate: null,
          CreateDate: null,
          CardCode: '',
          CardName: '',
          UserID: '1',
          Contacts: '',
          CellphoneNO: '',
          PhoneNO: '',
          Email: '',
          CompanyCode: '',
          DueDate: null,
          ToDate: null,
          InquiryDocTotal: '',
          DocTotal: '',
          ProvinceID: '',
          Province: '',
          CityID: '',
          City: '',
          AreaID: '',
          Area: '',
          StreetID: '',
          Street: '',
          Address: '',
          NumAtCard: '',
          Owner: '',
          IsInquiry: '',
          TI_Z02602: [],
          TI_Z02603: [],
        },
      },
    });
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
    formVals.TI_Z02602.map(item => {
      if (item.key === record.key) {
        return record;
      }
      return item;
    });
    this.setState({ formVals }, () => {
      this.getTotal();
    });
  };

  //  计算总计
  getTotal = () => {
    const { formVals } = this.state;
    let DocTotal = 0;
    let InquiryDocTotalLocal = 0;
    let InquiryDocTotal = 0;
    // eslint-disable-next-line array-callback-return
    formVals.TI_Z02602.map(record => {
      record.InquiryLineTotalLocal = isNaN(record.Quantity * record.InquiryPrice)
        ? 0
        : record.Quantity * record.InquiryPrice;
      record.InquiryLineTotalLocal = round(record.InquiryLineTotalLocal, 2);
      record.InquiryLineTotal = isNaN(record.Quantity * record.InquiryPrice * record.DocRate)
        ? 0
        : record.Quantity * record.InquiryPrice * record.DocRate;
      record.InquiryLineTotal = round(record.InquiryLineTotal, 2);
      record.LineTotal = isNaN(record.Quantity * record.Price) ? 0 : record.Quantity * record.Price;
      record.LineTotal = round(record.LineTotal, 2);
      DocTotal += record.LineTotal;
      InquiryDocTotalLocal += record.InquiryLineTotalLocal;
      InquiryDocTotal += record.InquiryLineTotal;
    });
    formVals.DocTotal = DocTotal;
    formVals.InquiryDocTotalLocal = InquiryDocTotalLocal;
    formVals.InquiryDocTotal = InquiryDocTotal;
    formVals.DocTotal = DocTotal;
    this.setState({ formVals });
  };

  // 品牌,仓库改变

  rowSelectChange = (value, record, index, key) => {
    const { formVals } = this.state;
    record[key] = value;
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
    this.setState({ formVals }, () => {
      this.getTotal();
    });
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
      needmodalVisible: !!flag,
      LineID: Number,
    });
  };

  // change tab
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
    const { TI_Z00602List } = company;
    const { formVals } = this.state;
    formVals.CardCode = company.Code || company.key;
    formVals.CardName = company.Name || company.label;
    this.setState({ formVals, linkmanList: TI_Z00602List || [] });
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

  // 联系人change
  linkmanChange = Contacts => {
    const { formVals } = this.state;
    formVals.Contacts = Contacts;
    this.setState({ formVals });
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
      delete fieldsValue.CardCode;
      delete fieldsValue.CardName;
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
            router.push(`/TI_Z02601/detail?DocEntry=${response.Content.DocEntry}`);
          }
        },
      });
    });
  };

  // 更新主数据
  updateHandle = () => {
    const { form, dispatch } = this.props;
    const { formVals } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let address;
      if (fieldsValue.address) {
        address = { ...fieldsValue.address };
      }
      delete fieldsValue.address;
      delete fieldsValue.CardCode;
      delete fieldsValue.CardName;
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

  // 取消单据

  cancelSubmit = ClosedComment => {
    const { dispatch } = this.props;
    const { formVals } = this.state;
    dispatch({
      type: 'inquiryEdit/cancel',
      payload: {
        Content: {
          DocEntry: formVals.DocEntry,
          ClosedComment,
        },
      },
      callback: response => {
        if (response.Status === 200) {
          message.success('取消成功');
        }
      },
    });
  };

  // 发送需询价
  submitNeedLine = select => {
    const { dispatch } = this.props;
    const loItemList = select.map(item => ({
      DocEntry: item.DocEntry,
      LineID: item.LineID,
    }));
    dispatch({
      type: 'inquiryEdit/confirm',
      payload: {
        Content: {
          loItemList,
        },
      },
      callback: response => {
        if (response.Status === 200) {
          message.success('提交成功');

          this.setState({ needmodalVisible: false });
        }
      },
    });
  };

  // 确认需要采购询价
  selectNeed = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length) {
      this.handleModalVisible(true);
    } else {
      message.warning('请先选择');
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      global: { Saler, Company },
    } = this.props;
    const {
      formVals,
      tabIndex,
      thisLine,
      linkmanList,
      uploadmodalVisible,
      skuModalVisible,
      needmodalVisible,
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

    const needParentMethods = {
      handleSubmit: this.submitNeedLine,
      handleModalVisible: this.handleModalVisible,
    };
    const newdata = [...formVals.TI_Z02602];
    if (newdata.length > 0) {
      newdata.push({
        LineID: newdata[newdata.length - 1].LineID + 1,
        lastIndex: true,
        InquiryLineTotal: formVals.InquiryDocTotal,
        InquiryLineTotalLocal: formVals.InquiryDocTotalLocal,
        LineTotal: formVals.DocTotal,
      });
    }

    return (
      <Card>
        <Form {...formItemLayout}>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="CardCode" {...this.formLayout} label="客户ID">
                {getFieldDecorator('CardCode', {
                  rules: [{ required: true, message: '请选择客户！' }],
                  initialValue: { key: formVals.CardName, label: formVals.CardCode },
                })(
                  <CompanySelect
                    initialValue={{ key: formVals.CardName, label: formVals.CardCode }}
                    onChange={this.changeCompany}
                    keyType="Code"
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="DocEntry" {...this.formLayout} label="单号">
                {getFieldDecorator('DocEntry', {
                  initialValue: formVals.DocEntry,
                })(<Input disabled placeholder="单号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="CardName" {...this.formLayout} label="客户名称">
                {getFieldDecorator('CardName', {
                  rules: [{ required: true, message: '请输入客户名称！' }],
                  initialValue: { key: formVals.CardCode, label: formVals.CardName },
                })(
                  <CompanySelect
                    initialValue={{ key: formVals.CardCode, label: formVals.CardName }}
                    onChange={this.changeCompany}
                    keyType="Name"
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="DocDate" {...this.formLayout} label="单据日期">
                {getFieldDecorator('DocDate', {
                  rules: [{ required: true, message: '请选择单据日期！' }],
                  initialValue: formVals.DocDate ? moment(formVals.DocDate, 'YYYY-MM-DD') : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="Contacts" {...this.formLayout} label="联系人">
                {getFieldDecorator('Contacts', {
                  rules: [{ required: true, message: '请输入联系人！' }],
                  initialValue: formVals.Contacts,
                })(
                  <LinkMan
                    initialValue={formVals.Contacts}
                    onChange={this.linkmanChange}
                    data={linkmanList}
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={10} md={12} sm={24}>
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
            <Col lg={10} md={12} sm={24}>
              <FormItem key="NumAtCard" {...this.formLayout} label="客户参考号">
                {getFieldDecorator('NumAtCard', {
                  initialValue: formVals.NumAtCard,
                })(<Input placeholder="请输入客户参考号" />)}
              </FormItem>
            </Col>
            {formVals.DocStatus ? (
              <Col lg={10} md={12} sm={24}>
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
              rowKey="LineID"
              scroll={{ x: 3150, y: 600 }}
              columns={this.skuColumns}
              data={newdata}
            />
            <Row style={{ marginTop: 20 }} gutter={8}>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="Owner" {...this.formLayout} label="所有者">
                  {getFieldDecorator('Owner', {
                    initialValue: formVals.Owner,
                    rules: [{ required: true, message: '请选择所有者！' }],
                  })(<MDMCommonality initialValue={formVals.Owner} data={Saler} />)}
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
          </TabPane>
          <TabPane tab="常规" key="2">
            <Row gutter={8}>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="CellphoneNO" {...this.formLayout} label="手机号码">
                  {getFieldDecorator('CellphoneNO', {
                    initialValue: formVals.CellphoneNO,
                    rules: [{ required: true, message: '请输入手机号码！' }],
                  })(<Input placeholder="手机号码" />)}
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
                  })(
                    <Address
                      initialValue={[
                        formVals.ProvinceID,
                        formVals.CityID,
                        formVals.AreaID,
                        formVals.StreetID,
                      ]}
                      style={{ width: '100%' }}
                    />
                  )}
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
                    rules: [{ required: true, message: '请选择交易公司！' }],
                  })(<MDMCommonality initialValue={formVals.CompanyCode} data={Company} />)}
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
                  <span>{getName(Saler, formVals.CreateUser)}</span>
                </FormItem>
              </Col>
              {formVals.DocEntry ? (
                <Fragment>
                  <Col lg={8} md={12} sm={24}>
                    <FormItem key="SDocStatus" {...this.formLayout} label="报价状态">
                      <span>{formVals.PDocStatus}</span>
                    </FormItem>
                  </Col>
                  <Col lg={8} md={12} sm={24}>
                    <FormItem key="PDocStatus" {...this.formLayout} label="询价状态">
                      <span>{formVals.SDocStatus}</span>
                    </FormItem>
                  </Col>
                  <Col lg={8} md={12} sm={24}>
                    <FormItem key="Closed" {...this.formLayout} label="关闭状态">
                      <Switch
                        checkedChildren="已关闭"
                        disabled
                        unCheckedChildren="开启中"
                        checked={formVals.Closed === 'Y'}
                      />
                    </FormItem>
                  </Col>
                  <Col lg={8} md={12} sm={24}>
                    <FormItem key="ClosedBy " {...this.formLayout} label="关闭人">
                      <span>{formVals.ClosedBy}</span>
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
            <Fragment>
              <CancelOrder cancelSubmit={this.cancelSubmit} />
              <Button
                style={{ marginLeft: 10, marginRight: 10 }}
                onClick={this.updateHandle}
                type="primary"
              >
                更新
              </Button>
              <Button onClick={() => this.setState({ needmodalVisible: true })} type="primary">
                确认需采购询价
              </Button>
            </Fragment>
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
        <NeedAskPrice
          data={formVals.TI_Z02602}
          {...needParentMethods}
          modalVisible={needmodalVisible}
        />
      </Card>
    );
  }
}

export default InquiryEdit;
