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
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import moment from 'moment';
import round from 'lodash/round';
import router from 'umi/router';
import CancelOrder from '@/components/Modal/CancelOrder';
import StandardTable from '@/components/StandardTable';
import EditableFormTable from '@/components/EditableFormTable';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import UpdateLoad from '../components/modal';
import AskPriceFetch from '../components/askPriceFetch';
import Address from '@/components/Address';
import Brand from '@/components/Brand';
import MDMCommonality from '@/components/Select';
import NeedAskPrice from '../components/needAskPrice';
import SKUModal from '@/components/Modal/SKU';
import CompanySelect from '@/components/Company/index';
import { checkPhone, getName, chechEmail } from '@/utils/utils';

const { TextArea } = Input;
const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;
@connect(({ TI_Z029, loading, global, user }) => ({
  TI_Z029,
  global,
  user,
  loading: loading.models.TI_Z029,
}))
@Form.create()
class TI_Z029Component extends React.Component {
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
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
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
      title: '备注',
      dataIndex: 'LineComment',
      width: 150,
      inputType: 'text',
      editable: true,
      align: 'center',
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
      width: 100,
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
      title: '其他成本',
      width: 120,
      align: 'center',
      dataIndex: 'OtherTotal',
    },
    {
      title: '行利润',
      width: 150,
      align: 'center',
      dataIndex: 'ProfitLineTotal',
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

  otherCostCColumns = [
    {
      title: '序号',
      width: 80,
      align: 'center',
      dataIndex: 'OrderId',
    },
    {
      title: '费用项目',
      align: 'center',
      dataIndex: 'FeeName',
    },
    {
      title: '总计',
      align: 'center',
      dataIndex: 'OtherTotal',
    },
    {
      title: '行备注',
      align: 'center',
      dataIndex: 'LineComment',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      formVals: {}, // 单据信息
      tabIndex: '1', // tab
      uploadmodalVisible: false, // 上传Modal
      attachmentVisible: false, // 附件Modal
      orderModalVisible: false, // 物料选择 Modal
      skuModalVisible: false, //
      needmodalVisible: false,
      LineID: Number, // 当前选中行index
      linkmanList: [], // 联系人list
      thisLine: {
        // 当前行
        TI_Z02904: [],
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
      global: { currentUser },
      TI_Z029: { orderDetail },
    } = this.props;
    const { CompanyCode, Owner, UserID, UserCode } = currentUser;
    dispatch({
      type: 'TI_Z029/save',
      payload: {
        orderDetail: {
          ...orderDetail,
          CompanyCode,
          Owner,
          UserID,
          CreateCode: UserCode,
        },
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Purchaser', 'WhsCode', 'Company'],
        },
      },
    });
    this.getDetail();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'TI_Z029/save',
      payload: {
        orderDetail: {
          Comment: '',
          SDocStatus: '',
          PDocStatus: '',
          Closed: '',
          ClosedBy: '',
          SourceType: '',
          OrderType: '',
          DocDate: new Date(),
          CreateDate: new Date(),
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
          TI_Z02902: [],
          TI_Z02904: [],
        },
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.TI_Z029.orderDetail !== prevState.formVals) {
      return {
        formVals: nextProps.TI_Z029.orderDetail,
      };
    }
    return null;
  }

  getDetail = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.DocEntry) {
      dispatch({
        type: 'TI_Z029/fetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
          },
        },
      });
    }
  };

  //  行内容改变
  rowChange = record => {
    const { formVals } = this.state;
    formVals.TI_Z02902.map(item => {
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
    let OtherTotal = 0;
    // eslint-disable-next-line array-callback-return
    formVals.TI_Z02902.map(record => {
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
      console.log(isNaN(record.OtherTotal) ? record.OtherTotal : 0);
      record.ProfitLineTotal =
        record.LineTotal -
        record.InquiryLineTotalLocal -
        (isNaN(record.OtherTotal) ? record.OtherTotal : 0);
      record.ProfitLineTotal = round(record.ProfitLineTotal, 2);
      DocTotal += record.LineTotal;
      InquiryDocTotalLocal += record.InquiryLineTotalLocal;
      InquiryDocTotal += record.InquiryLineTotal;
      OtherTotal += record.OtherTotal;
    });
    formVals.DocTotal = DocTotal;
    formVals.InquiryDocTotalLocal = InquiryDocTotalLocal;
    formVals.InquiryDocTotal = InquiryDocTotal;
    formVals.DocTotal = DocTotal;
    formVals.ProfitTotal = DocTotal - InquiryDocTotalLocal - OtherTotal;
    this.setState({ formVals });
  };

  // 品牌,仓库改变

  rowSelectChange = (value, record, index, key) => {
    const { formVals } = this.state;
    record[key] = value;
    formVals.TI_Z02902[index] = record;
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
    formVals.TI_Z02902[LineID] = { ...thisLine, ...select, SKU: select.Code, SKUName: select.Name };
    this.setState({ formVals: { ...formVals } });
    this.handleModalVisible(false);
  };

  // 删除附件
  deleteLine = (record, index) => {
    const { formVals, LineID } = this.state;
    if (LineID >= 0) {
      formVals.TI_Z02902[LineID].TI_Z02904.splice(index, 1);
    } else {
      formVals.TI_Z02903.splice(index, 1);
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
    formVals.TI_Z02902.splice(index, 1);
    this.setState({ formVals }, () => {
      this.getTotal();
    });
  };

  // 获取上传成功附件，插入到对应数组
  handleSubmit = fieldsValue => {
    const { AttachmentPath, AttachmentCode, AttachmentName } = fieldsValue;
    const { formVals, LineID } = this.state;
    const lastsku = formVals.TI_Z02903[formVals.TI_Z02903.length - 1];
    if (fieldsValue.AttachmentPath) {
      if (LineID >= 0) {
        const thisLine = formVals.TI_Z02902[LineID].TI_Z02904;
        const last = thisLine[thisLine.length - 1];
        const ID = last ? last.LineID + 1 : 1;
        formVals.TI_Z02902[LineID].TI_Z02904.push({
          LineID: ID,
          BaseType: formVals.OrderType,
          BaseEntry: formVals.BaseEntry ? formVals.BaseEntry : 1,
          BaseLineID: last ? last.BaseLineID + 1 : 1,
          AttachmentPath,
          AttachmentCode,
          AttachmentName,
        });
      } else {
        formVals.TI_Z02903.push({
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
      orderModalVisible: !!flag,
      needmodalVisible: !!flag,
      skuModalVisible: !!flag,
      LineID: Number,
    });
  };

  // change tab
  tabChange = tabIndex => {
    this.setState({ tabIndex });
  };

  copyFromOrder = () => {
    const { formVals } = this.state;
    const { queryData } = this.getAskPriceOrder.state;
    if (!formVals.CardCode) {
      message.warning('请先选择客户');
      return false;
    }
    this.setState({ orderModalVisible: true });
    this.getAskPriceOrder.fetchOrder(queryData);
  };

  rightButton = tabIndex => {
    if (tabIndex === '1') {
      return (
        <Button icon="plus" style={{ marginLeft: 8 }} type="primary" onClick={this.copyFromOrder}>
          复制从询价单
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

  // 添加行
  addLineSKU = selectedRows => {
    const {
      user: { currentUser },
    } = this.props;
    const { formVals } = this.state;
    let newLineID = 1;
    if (formVals.TI_Z02902.length) {
      newLineID = formVals.TI_Z02902[formVals.TI_Z02902.length - 1].LineID + 1;
    }
    console.log(currentUser.UserCode);
    selectedRows.map(item => {
      const {
        LineComment,
        SourceType,
        SKU,
        SKUName,
        BrandName,
        ProductName,
        ManufactureNO,
        Parameters,
        Package,
        Purchaser,
        Quantity,
        Unit,
        DueDate,
        InquiryPrice,
        Price,
        InquiryDueDate,
        InquiryComment,
        InquiryLineTotal,
        InquiryLineTotalLocal,
        LineTotal,
        OtherTotal,
        Currency,
        DocRate,
        SupplierCode,
        SupplierName,
        InquiryCfmDate,
        InquiryCfmUser,
        Contacts,
        WhsCode,
        LineID,
        DocEntry,
      } = item;
      formVals.TI_Z02902.push({
        BaseEntry: DocEntry,
        BaseLineID: LineID,
        LineComment,
        SourceType,
        SKU,
        SKUName,
        BrandName,
        ProductName,
        ManufactureNO,
        Parameters,
        Package,
        Purchaser,
        Quantity,
        Unit,
        DueDate,
        InquiryPrice,
        Price,
        InquiryDueDate,
        InquiryComment,
        InquiryLineTotal,
        InquiryLineTotalLocal,
        LineTotal,
        OtherTotal: OtherTotal || 0,
        Currency,
        DocRate,
        SupplierCode,
        SupplierName,
        InquiryCfmDate,
        InquiryCfmUser,
        Contacts,
        WhsCode,
        CreateUser: currentUser.UserCode,
        CreateDate: formVals.CreateDate || new Date(),
        LineID: newLineID,
        ApproveSts: 'O',
        LineStatus: 'O',
        Closed: 'N',
        ClosedBy: 'P001',
      });
    });
    this.setState({ formVals, orderModalVisible: false }, () => {
      this.getTotal();
    });
  };

  saveHandle = () => {
    // 保存主数据
    const {
      form,
      dispatch,
      user: { currentUser },
    } = this.props;
    const { formVals } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error(Object.values(err)[0].errors[0].message);
        return;
      }
      let address;
      if (fieldsValue.address) {
        address = { ...fieldsValue.address };
      }
      delete fieldsValue.address;
      delete fieldsValue.CardCode;
      delete fieldsValue.CardName;
      dispatch({
        type: 'TI_Z029/add',
        payload: {
          Content: {
            ...formVals,
            ...fieldsValue,
            ...address,
            CreateDate: fieldsValue.CreateDate ? fieldsValue.CreateDate.format('YYYY-MM-DD') : '',
            DueDate: fieldsValue.DueDate ? fieldsValue.DueDate.format('YYYY-MM-DD') : '',
            ToDate: fieldsValue.ToDate ? fieldsValue.ToDate.format('YYYY-MM-DD') : '',
            DocDate: fieldsValue.DocDate ? fieldsValue.DocDate.format('YYYY-MM-DD') : '',
            CreateUser: currentUser.UserCode,
            ClosedDate: new Date(),
          },
        },
        callback: response => {
          if (response.Status === 200) {
            message.success('添加成功');
            router.push(`/TI_Z029/detail?DocEntry=${response.Content.DocEntry}`);
          }
        },
      });
    });
  };

  // 更新主数据
  updateHandle = () => {
    const {
      form,
      dispatch,
      user: { currentUser },
    } = this.props;
    const { formVals } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error(Object.values(err)[0].errors[0].message);
        return;
      }
      let address;
      if (fieldsValue.address) {
        address = { ...fieldsValue.address };
      }
      delete fieldsValue.address;
      delete fieldsValue.CardCode;
      delete fieldsValue.CardName;
      dispatch({
        type: 'TI_Z029/update',
        payload: {
          Content: {
            ...formVals,
            ...fieldsValue,
            ...address,
            CreateDate: fieldsValue.CreateDate ? fieldsValue.CreateDate.format('YYYY-MM-DD') : '',
            DueDate: fieldsValue.DueDate ? fieldsValue.DueDate.format('YYYY-MM-DD') : '',
            ToDate: fieldsValue.ToDate ? fieldsValue.ToDate.format('YYYY-MM-DD') : '',
            DocDate: fieldsValue.DocDate ? fieldsValue.DocDate.format('YYYY-MM-DD') : '',
            UpdateUser: currentUser.UserCode,
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
    const {
      formVals: { UpdateTimestamp, DocEntry },
    } = this.state;
    dispatch({
      type: 'TI_Z029/cancel',
      payload: {
        Content: {
          DocEntry,
          UpdateTimestamp,
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
    const { formVals } = this.state;
    const TI_Z02908RequestItem = select.map(item => ({
      DocEntry: item.DocEntry,
      LineID: item.LineID,
      UpdateTimestamp: formVals.UpdateTimestamp,
    }));
    dispatch({
      type: 'TI_Z029/confirm',
      payload: {
        Content: {
          TI_Z02908RequestItem,
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

  // 成本核算
  costCheck = () => {
    const { dispatch } = this.props;
    const {
      formVals: { DocEntry, UpdateTimestamp },
    } = this.state;
    dispatch({
      type: 'TI_Z029/costCheck',
      payload: {
        Content: {
          DocEntry,
          UpdateTimestamp,
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
      orderModalVisible,
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

    const orderParentMethods = {
      handleSubmit: this.addLineSKU,
      handleModalVisible: this.handleModalVisible,
    };

    const needParentMethods = {
      handleSubmit: this.submitNeedLine,
      handleModalVisible: this.handleModalVisible,
    };
    const newdata = [...formVals.TI_Z02902];
    if (newdata.length > 0) {
      newdata.push({
        LineID: newdata[newdata.length - 1].LineID + 1,
        lastIndex: true,
        InquiryLineTotal: formVals.InquiryDocTotal,
        InquiryLineTotalLocal: formVals.InquiryDocTotalLocal,
        LineTotal: formVals.DocTotal,
        ProfitLineTotal: formVals.ProfitTotal,
      });
    }

    return (
      <Card>
        <Form {...formItemLayout}>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="CardCode" {...this.formLayout} label="客户ID">
                {formVals.DocEntry ? (
                  <Input disabled value={formVals.CardCode} placeholder="单号" />
                ) : (
                  getFieldDecorator('CardCode', {
                    rules: [{ required: true, message: '请选择客户！' }],
                    initialValue: { key: formVals.CardName, label: formVals.CardCode },
                  })(
                    <CompanySelect
                      initialValue={{ key: formVals.CardName, label: formVals.CardCode }}
                      onChange={this.changeCompany}
                      keyType="Code"
                    />
                  )
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
                {formVals.DocEntry ? (
                  <Input disabled value={formVals.CardName} placeholder="单号" />
                ) : (
                  getFieldDecorator('CardName', {
                    rules: [{ required: true, message: '请输入客户名称！' }],
                    initialValue: { key: formVals.CardCode, label: formVals.CardName },
                  })(
                    <CompanySelect
                      initialValue={{ key: formVals.CardCode, label: formVals.CardName }}
                      onChange={this.changeCompany}
                      keyType="Name"
                    />
                  )
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
                  <Select
                    value={formVals.Contacts}
                    placeholder="请选择联系人"
                    filterOption={false}
                    onSelect={this.handleChange}
                    style={{ width: '100%' }}
                  >
                    {linkmanList.map(option => (
                      <Option key={option.Code} value={option.Name}>
                        {option.Name}
                      </Option>
                    ))}
                  </Select>
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
              rowKey="Key"
              scroll={{ x: 3500, y: 600 }}
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
                  <span>{moment(formVals.CreateDate).format('YYYY-MM-DD')}</span>
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="Comment" {...this.formLayout} label="备注">
                  {getFieldDecorator('Comment', {
                    initialValue: formVals.Comment,
                  })(<TextArea placeholder="请输入备注" />)}
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
                <FormItem key="CreateUser" {...this.formLayout} label="创建人">
                  <span>{getName(Saler, formVals.CreateUser)}</span>
                </FormItem>
              </Col>
              {/* {formVals.DocEntry ? (
                <Fragment>
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
              ) : null} */}
            </Row>
          </TabPane>
          <TabPane tab="其余成本" key="3">
            <StandardTable
              data={{ list: formVals.TI_Z02904 }}
              rowKey="LineID"
              columns={this.otherCostCColumns}
            />
          </TabPane>
          <TabPane tab="附件" key="4">
            <StandardTable
              data={{ list: formVals.TI_Z02903 }}
              rowKey="LineID"
              columns={this.attachmentColumns}
            />
          </TabPane>
        </Tabs>

        <FooterToolbar>
          {formVals.DocEntry ? (
            <Fragment>
              <CancelOrder cancelSubmit={this.cancelSubmit} />
              <Button type="primary" onClick={this.costCheck}>
                成本核算
              </Button>
              <Button style={{ marginLeft: 10 }} onClick={this.updateHandle} type="primary">
                更新
              </Button>
              <Button onClick={() => this.setState({ needmodalVisible: true })} type="primary">
                确认销售报价
              </Button>
            </Fragment>
          ) : (
            <Button onClick={this.saveHandle} type="primary">
              保存
            </Button>
          )}
        </FooterToolbar>
        <UpdateLoad {...uploadmodalMethods} modalVisible={uploadmodalVisible} />
        <AskPriceFetch
          onRef={c => {
            this.getAskPriceOrder = c;
          }}
          SearchText={formVals.CardName}
          {...orderParentMethods}
          modalVisible={orderModalVisible}
        />
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
            data={{ list: thisLine.TI_Z02904 }}
            rowKey="LineID"
            columns={this.attachmentColumns}
          />
        </Modal>
        <NeedAskPrice
          data={formVals.TI_Z02902}
          {...needParentMethods}
          modalVisible={needmodalVisible}
        />
      </Card>
    );
  }
}

export default TI_Z029Component;
