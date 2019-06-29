/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable compat/compat */
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
  message,
  DatePicker,
  Modal,
  Select,
  Collapse,
  Dropdown,
  Empty,
  Menu,
  Tag,
} from 'antd';
import moment from 'moment';
import round from 'lodash/round';
import router from 'umi/router';
import Link from 'umi/link';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import CancelOrder from '@/components/Modal/CancelOrder';
import StandardTable from '@/components/StandardTable';
import EditableFormTable from '@/components/EditableFormTable';
import OrderAttachUpload from '@/components/Modal/OrderAttachUpload';
import AskPriceFetch from '../components/askPriceFetch';
import Brand from '@/components/Brand';
import MDMCommonality from '@/components/Select';
import NeedAskPrice from '../components/needAskPrice';
import SKUModal from '@/components/Modal/SKU';
import CompanySelect from '@/components/Company/index';
import HSCode from '@/components/HSCode';
import PushLink from '@/components/PushLink';
import Attachment from '@/components/Attachment';
import { getName } from '@/utils/utils';
import { otherCostCColumns, baseType } from '@/utils/publicData';

const { TextArea } = Input;
const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;
const { Panel } = Collapse;
@connect(({ agreementEdit, loading, global }) => ({
  agreementEdit,
  global,
  addloading: loading.effects['agreementEdit/add'],
  detailloading: loading.effects['agreementEdit/fetch'],
  updateloading: loading.effects['agreementEdit/update'],
}))
@Form.create()
class AgreementEdit extends React.Component {
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
      width: 100,
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
      title: '品牌',
      width: 120,
      align: 'center',
      dataIndex: 'BrandName',
      render: (text, record, index) =>
        record.lastIndex ? null : (
          <div style={{ width: 110 }}>
            <Brand
              initialValue={record.BrandName}
              keyType="Name"
              onChange={value => {
                this.rowSelectChange(value, record, index, 'BrandName');
              }}
            />
          </div>
        ),
    },
    {
      title: '名称',
      dataIndex: 'ProductName',
      inputType: 'textArea',
      width: 150,
      editable: true,
      align: 'center',
    },
    {
      title: '型号',
      width: 150,
      dataIndex: 'ManufactureNO',
      inputType: 'textArea',
      editable: true,
      align: 'center',
    },
    {
      title: '参数',
      width: 150,
      dataIndex: 'Parameters',
      inputType: 'textArea',
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
      title: '数量',
      width: 80,
      inputType: 'text',
      dataIndex: 'Quantity',
      editable: true,
      align: 'center',
    },
    {
      title: '建议价格',
      width: 100,
      dataIndex: 'AdvisePrice',
      align: 'center',
    },
    {
      title: '价格',
      width: 80,
      inputType: 'text',
      dataIndex: 'Price',
      editable: true,
      align: 'center',
    },
    {
      title: '行总计',
      width: 100,
      align: 'center',
      dataIndex: 'LineTotal',
      render: (text, record) =>
        record.lastIndex ? <span style={{ fontWeight: 'bolder' }}>{text}</span> : text,
    },
    {
      title: '总费用',
      width: 100,
      align: 'center',
      dataIndex: 'OtherTotal',
    },
    {
      title: '费用备注',
      width: 100,
      align: 'center',
      dataIndex: 'OtherComment',
      render: (text, record) =>
        record.lastIndex ? null : (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
    },
    {
      title: '行利润',
      width: 100,
      align: 'center',
      dataIndex: 'ProfitLineTotal',
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
      title: '询价价格',
      width: 120,
      dataIndex: 'InquiryPrice',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? '' : <span>{`${text}-${record.Currency || ''}-${record.DocRate}`}</span>,
    },
    {
      title: '询行总计',
      width: 150,
      align: 'center',
      dataIndex: 'InquiryLineTotal',
      render: (text, record) =>
        record.lastIndex ? (
          ''
        ) : (
          <span>{`${text}${record.Currency ? `(${record.Currency})` : ''}-${
            record.InquiryLineTotalLocal
          }`}</span>
        ),
    },
    {
      title: '询价备注',
      dataIndex: 'InquiryComment',
      width: 100,
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? null : (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
    },
    {
      title: '询价交期',
      width: 100,
      dataIndex: 'InquiryDueDate',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? null : <span>{moment(text).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '采购员',
      width: 120,
      dataIndex: 'Purchaser',
      align: 'center',
      render: (text, record) => {
        const {
          global: { Purchaser },
        } = this.props;
        return record.lastIndex ? null : <span>{getName(Purchaser, text)}</span>;
      },
    },
    {
      title: '产地',
      width: 100,
      dataIndex: 'ManLocation',
      align: 'center',
      render: (text, record, index) => {
        const {
          global: { TI_Z042 },
        } = this.props;
        if (!record.lastIndex) {
          return (
            <MDMCommonality
              onChange={value => {
                this.rowSelectChange(value, record, index, 'ManLocation');
              }}
              initialValue={text}
              data={TI_Z042}
            />
          );
        }
        return '';
      },
    },
    {
      title: 'HS编码',
      width: 150,
      inputType: 'text',
      dataIndex: 'HSCode',
      render: (text, record, index) => {
        const {
          global: { HSCodeList },
        } = this.props;
        return record.lastIndex ? (
          ''
        ) : (
          <HSCode
            initialValue={text}
            data={HSCodeList}
            onChange={select => {
              this.codeChange(select, record, index);
            }}
          />
        );
      },
    },
    {
      title: '税率',
      width: 80,
      dataIndex: 'HSVatRate',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? '' : <span>{`${text}-${record.HSVatRateOther}`}</span>,
    },
    {
      title: '重量',
      width: 80,
      dataIndex: 'Rweight',
      editable: true,
      inputType: 'text',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'LineComment',
      inputType: 'textArea',
      width: 150,
      editable: true,
      align: 'center',
    },
    {
      title: '包装',
      width: 150,
      dataIndex: 'Package',
      inputType: 'textArea',
      editable: true,
      align: 'center',
    },
    {
      title: '名称(外)',
      dataIndex: 'ForeignName',
      inputType: 'textArea',
      width: 150,
      editable: true,
      align: 'center',
    },
    {
      title: '规格(外)',
      width: 150,
      dataIndex: 'ForeignParameters',
      inputType: 'textArea',
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
      title: '要求名称',
      width: 150,
      inputType: 'textArea',
      dataIndex: 'CustomerName',
      editable: true,
      align: 'center',
    },
    {
      title: '客询价单',
      width: 80,
      align: 'center',
      dataIndex: 'BaseEntry',
      render: (val, record) =>
        record.lastIndex ? null : (
          <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${record.BaseEntry}`}>
            {`${val}-${record.BaseLineID}`}
          </Link>
        ),
    },
  ];

  skuColumns2 = [
    ...this.skuColumns,
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 80,
      render: (text, record, index) => {
        const {
          formVals: { DocEntry },
        } = this.state;
        return record.lastIndex ? null : (
          <Fragment>
            <Icon
              title="预览"
              type="eye"
              onClick={() => this.lookLineAttachment(record, index)}
              style={{ color: '#08c', marginRight: 5 }}
            />
            {DocEntry ? (
              <Icon
                title="上传附件"
                className="icons"
                style={{ color: '#08c', marginRight: 5, marginLeft: 5 }}
                type="cloud-upload"
                onClick={() => this.skuLineAttachment(record, index, true)}
              />
            ) : (
              ''
            )}
            <Icon
              title="删除行"
              className="icons"
              type="delete"
              theme="twoTone"
              onClick={() => this.deleteSKULine(record, index)}
            />
          </Fragment>
        );
      },
    },
  ];

  skuColumns1 = [
    ...this.skuColumns,
    {
      title: '行状态',
      width: 80,
      dataIndex: 'LineStatus',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? null : (
          <Fragment>
            {record.Closed === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                {text === 'C' ? <Tag color="green">已确认</Tag> : <Tag color="gold">未确认</Tag>}
              </Fragment>
            )}
          </Fragment>
        ),
    },
    {
      title: '销报单号',
      width: 100,
      align: 'center',
      dataIndex: 'QuotationEntry',
      render: (text, recond) =>
        text ? (
          <Link target="_blank" to={`/sellabout/TI_Z029/detail?DocEntry=${text}`}>
            {`${text}-${recond.QuotationLineID}`}
          </Link>
        ) : (
          ''
        ),
    },
    {
      title: '销订单号',
      width: 100,
      align: 'center',
      dataIndex: 'SoEntry',
      render: (text, recond) =>
        text ? (
          <Link target="_blank" to={`/sellabout/orderdetail?DocEntry=${text}`}>
            {`${text}-${recond.SoLineID}`}
          </Link>
        ) : (
          ''
        ),
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 80,
      render: (text, record, index) => {
        const {
          formVals: { DocEntry },
        } = this.state;
        return record.lastIndex ? null : (
          <Fragment>
            <Icon
              title="预览"
              type="eye"
              onClick={() => this.lookLineAttachment(record, index)}
              style={{ color: '#08c', marginRight: 5 }}
            />
            {DocEntry ? (
              <Icon
                title="上传附件"
                className="icons"
                style={{ color: '#08c', marginRight: 5, marginLeft: 5 }}
                type="cloud-upload"
                onClick={() => this.skuLineAttachment(record, index, true)}
              />
            ) : (
              ''
            )}
            <Icon
              title="删除行"
              className="icons"
              type="delete"
              theme="twoTone"
              onClick={() => this.deleteSKULine(record, index)}
            />
          </Fragment>
        );
      },
    },
  ];

  linkmanColumns = [
    {
      title: '用户ID',
      align: 'center',
      dataIndex: 'UserID',
    },
    {
      title: '联系人',
      align: 'center',
      dataIndex: 'Contacts',
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'CellphoneNO',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record, index) => (
        <Icon
          title="删除行"
          type="delete"
          theme="twoTone"
          onClick={() => this.deletePushLine(index)}
        />
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        TI_Z02603Fahter: [],
      }, // 单据信息
      tabIndex: '1', // tab
      uploadmodalVisible: false, // 上传Modal
      attachmentVisible: false, // 附件Modal
      orderModalVisible: false, // 物料选择 Modal
      skuModalVisible: false, //
      needmodalVisible: false,
      pushModalVisible: false, // 其他推送人modal
      LineID: Number, // 当前选中行index
      linkmanList: [], // 联系人list,
      addList: [],
      isLine: false,
      targetLine: {
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
      global: { currentUser, CustomerList, BrandList, Curr, HSCodeList },
      agreementEdit: { orderDetail },
    } = this.props;
    if (!HSCodeList.length) {
      dispatch({
        type: 'global/getHscode',
      });
    }
    if (!CustomerList.length) {
      dispatch({
        type: 'global/getCustomer',
      });
    }
    if (!BrandList.length) {
      dispatch({
        type: 'global/getBrand',
      });
    }
    if (!Curr.length) {
      dispatch({
        type: 'global/getMDMCommonality',
        payload: {
          Content: {
            CodeList: ['Saler', 'Curr', 'Purchaser', 'TI_Z042', 'TI_Z004', 'WhsCode', 'Company'],
          },
        },
      });
    }

    const { CompanyCode, Owner, UserCode } = currentUser;
    dispatch({
      type: 'agreementEdit/save',
      payload: {
        orderDetail: {
          ...orderDetail,
          CompanyCode,
          Owner,
          CreateCode: UserCode,
        },
      },
    });
    this.getBaseEntry();
    this.getDetail();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'agreementEdit/save',
      payload: {
        orderDetail: {
          Comment: '',
          OrderType: '1',
          Transport: 'N',
          DocDate: null,
          CreateDate: null,
          CardCode: '',
          CardName: '',
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
          Address: '',
          NumAtCard: '',
          Owner: '',
          IsInquiry: '',
          TI_Z03002: [],
          TI_Z03004: [],
          TI_Z03005: [],
          TI_Z02603Fahter: [],
        },
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.agreementEdit.orderDetail !== prevState.formVals ||
      nextProps.agreementEdit.addList !== prevState.addList ||
      nextProps.agreementEdit.linkmanList !== prevState.linkmanList
    ) {
      return {
        formVals: nextProps.agreementEdit.orderDetail,
        addList: nextProps.agreementEdit.addList.length
          ? nextProps.agreementEdit.addList
          : prevState.addList,
        linkmanList: nextProps.agreementEdit.linkmanList.length
          ? nextProps.agreementEdit.linkmanList
          : prevState.linkmanList,
      };
    }
    return null;
  }

  getBaseEntry = () => {
    const {
      dispatch,
      agreementEdit: { orderDetail },
      location: { query },
    } = this.props;
    if (query.BaseEntry) {
      dispatch({
        type: 'agreementEdit/getBaseEntry',
        payload: {
          Content: {
            DocEntry: query.BaseEntry,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            dispatch({
              type: 'agreementEdit/company',
              payload: {
                Content: {
                  Code: response.Content.CardCode,
                },
              },
            });
            const {
              Address,
              AddressID,
              Area,
              AreaID,
              CardCode,
              CardName,
              CellphoneNO,
              City,
              CityID,
              Comment,
              CompanyCode,
              Contacts,
              Email,
              NumAtCard,
              OrderType,
              Owner,
              PhoneNO,
              Province,
              ProvinceID,
              UserID,
              DueDate,
              ToDate,
              TI_Z02905,
            } = response.Content;

            dispatch({
              type: 'agreementEdit/save',
              payload: {
                orderDetail: {
                  ...orderDetail,
                  Address,
                  AddressID,
                  Area,
                  AreaID,
                  CardCode,
                  CardName,
                  CellphoneNO,
                  City,
                  CityID,
                  Comment,
                  CompanyCode,
                  Contacts,
                  Email,
                  NumAtCard,
                  OrderType,
                  Owner,
                  PhoneNO,
                  Province,
                  ProvinceID,
                  DueDate,
                  ToDate,
                  UserID,
                  TI_Z03005: TI_Z02905,
                  TI_Z03002: [],
                },
              },
            });
            this.addLineSKU(response.Content.TI_Z02902);
          }
        },
      });
    }
  };

  getDetail = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.DocEntry) {
      dispatch({
        type: 'agreementEdit/fetch',
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
    formVals.TI_Z03002.map(item => {
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
    const {
      dispatch,
      agreementEdit: { orderDetail },
    } = this.props;
    let DocTotal = 0;
    let InquiryDocTotalLocal = 0;
    let InquiryDocTotal = 0;
    let OtherTotal = 0;
    let ProfitTotal = 0;
    // eslint-disable-next-line array-callback-return
    formVals.TI_Z03002.map(record => {
      record.OtherTotal = record.OtherTotal || 0;
      record.InquiryLineTotal = isNaN(record.Quantity * record.InquiryPrice)
        ? 0
        : record.Quantity * record.InquiryPrice;
      record.InquiryLineTotal = round(record.InquiryLineTotal, 2);
      record.InquiryDocTotalLocal = isNaN(record.Quantity * record.InquiryPrice * record.DocRate)
        ? 0
        : record.Quantity * record.InquiryPrice * record.DocRate;
      record.InquiryDocTotalLocal = round(record.InquiryDocTotalLocal, 2);
      record.LineTotal = isNaN(record.Quantity * record.Price) ? 0 : record.Quantity * record.Price;
      record.LineTotal = round(record.LineTotal, 2);
      record.ProfitLineTotal = record.LineTotal - record.InquiryLineTotalLocal - record.OtherTotal;
      record.ProfitLineTotal = round(record.ProfitLineTotal, 2);
      DocTotal += record.LineTotal;
      InquiryDocTotalLocal += record.InquiryLineTotalLocal;
      InquiryDocTotal += record.InquiryLineTotal;
      OtherTotal += record.OtherTotal || 0;
    });
    DocTotal = round(DocTotal, 2);
    InquiryDocTotalLocal = round(InquiryDocTotalLocal, 2);
    InquiryDocTotal = round(InquiryDocTotal, 2);
    OtherTotal = round(OtherTotal, 2);
    ProfitTotal = round(DocTotal - InquiryDocTotalLocal - OtherTotal, 2);
    dispatch({
      type: 'agreementEdit/save',
      payload: {
        orderDetail: {
          ...orderDetail,
          DocTotal,
          InquiryDocTotalLocal,
          InquiryDocTotal,
          ProfitTotal,
          OtherTotal,
        },
      },
    });
  };

  // 品牌,仓库改变

  rowSelectChange = (value, record, index, key) => {
    const { formVals } = this.state;
    record[key] = value;
    formVals.TI_Z03002[index] = record;
    this.setState({ formVals: { ...formVals } });
  };

  // sku输入框获取焦点
  focusLine = (record, LineID) => {
    this.setState({ targetLine: { ...record }, LineID, skuModalVisible: true });
  };

  // 物料弹出返回
  changeLineSKU = selection => {
    const [select] = selection;
    const {
      BrandName,
      ManufactureNO,
      Name,
      Package,
      Parameters,
      ProductName,
      Rweight,
      Unit,
      Code,
      EnglishName,
    } = select;
    const { targetLine, LineID, formVals } = this.state;
    formVals.TI_Z03002[LineID] = {
      ...targetLine,
      SKU: Code,
      SKUName: Name,
      ForeignName: EnglishName,
      Rweight,
      BrandName,
      ManufactureNO,
      Package,
      Parameters,
      ProductName,
      Unit,
    };
    this.setState({ formVals: { ...formVals } });
    this.handleModalVisible(false);
  };

  // 行物料附件弹窗显隐
  skuLineAttachment = (record, index, isLine) => {
    this.setState({ LineID: index, uploadmodalVisible: true, targetLine: record, isLine });
  };

  // 查看行物料

  lookLineAttachment = (record, index) => {
    this.setState({ LineID: index, attachmentVisible: true, targetLine: { ...record } });
  };

  // 删除行物料
  deleteSKULine = (record, index) => {
    const { formVals } = this.state;
    formVals.TI_Z03002.splice(index, 1);
    this.setState({ formVals }, () => {
      this.getTotal();
    });
  };

  // 删除附件
  deleteLine = (record, index, isLine) => {
    const { targetLine } = this.state;
    let attch;
    if (isLine) {
      targetLine.TI_Z02604.splice(index, 1);
      attch = {
        Content: {
          Type: '2',
          ItemLine: targetLine.BaseLineID,
          DocEntry: targetLine.BaseEntry,
          EnclosureList: [...targetLine.TI_Z02604],
        },
      };
    } else {
      record.TI_Z02603.splice(index, 1);
      attch = {
        Content: {
          Type: '1',
          DocEntry: record.DocEntry,
          ItemLine: 0,
          EnclosureList: [...record.TI_Z02603],
        },
      };
    }
    this.attachmentHandle(attch);
  };

  // 获取上传成功附件，插入到对应数组
  handleSubmit = fieldsValue => {
    const { AttachmentPath, AttachmentCode, AttachmentName, AttachmentExtension } = fieldsValue;
    const {
      formVals: { DocEntry },
      targetLine,
      isLine,
    } = this.state;

    if (fieldsValue.AttachmentPath) {
      let attch;
      if (isLine) {
        const thisLineChild = targetLine.TI_Z02604;
        const last = thisLineChild[thisLineChild.length - 1];
        const ID = last ? last.OrderID + 1 : 1;
        attch = {
          Content: {
            Type: '2',
            DocEntry: targetLine.BaseEntry,
            ItemLine: targetLine.BaseLineID,
            EnclosureList: [
              ...thisLineChild,
              {
                DocEntry: targetLine.BaseEntry,
                OrderID: ID,
                ItemLine: targetLine.BaseLineID,
                BaseType: 'TI_Z030',
                BaseEntry: DocEntry,
                BaseLineID: targetLine.LineID,
                AttachmentCode,
                AttachmentName,
                AttachmentPath,
                AttachmentExtension,
              },
            ],
          },
        };
      } else {
        const lastsku = targetLine.TI_Z02603[targetLine.TI_Z02603.length - 1];
        attch = {
          Content: {
            Type: '1',
            DocEntry: targetLine.DocEntry,
            ItemLine: 0,
            EnclosureList: [
              ...targetLine.TI_Z02603,
              {
                DocEntry: targetLine.DocEntry,
                OrderID: lastsku ? lastsku.OrderID + 1 : 1,
                ItemLine: 0,
                BaseType: 'TI_Z030',
                BaseEntry: DocEntry,
                BaseLineID: lastsku ? lastsku.BaseLineID + 1 : 1,
                AttachmentCode,
                AttachmentName,
                AttachmentPath,
                AttachmentExtension,
              },
            ],
          },
        };
      }
      this.attachmentHandle(attch);
    }
  };

  attachmentHandle = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'agreementEdit/upload',
      payload: {
        ...params,
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

  // 弹窗隐藏
  handleModalVisible = flag => {
    this.setState({
      uploadmodalVisible: !!flag,
      attachmentVisible: !!flag,
      orderModalVisible: !!flag,
      needmodalVisible: !!flag,
      skuModalVisible: !!flag,
      pushModalVisible: !!flag,
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
          复制从销售报价单
        </Button>
      );
    }
    if (tabIndex === '5') {
      return (
        <Button icon="plus" style={{ marginLeft: 8 }} type="primary" onClick={this.addpush}>
          添加其他推送人
        </Button>
      );
    }
    return null;
  };

  // change 客户
  changeCompany = company => {
    const { TI_Z00602List, TI_Z00603List } = company;
    const { formVals } = this.state;
    formVals.CardCode = company.Code;
    formVals.CardName = company.Name;
    this.setState({ formVals, linkmanList: TI_Z00602List || [], addList: TI_Z00603List }, () => {
      if (TI_Z00603List.length) {
        this.handleAdreessChange(TI_Z00603List[0].AddressID);
      } else {
        message.warning('该客户下没有收货地址，请先维护收货地址');
      }
      if (TI_Z00602List.length) {
        this.linkmanChange(TI_Z00602List[0].UserID);
      } else {
        message.warning('该客户下没有维护联系人，请先维护联系人');
      }
    });
  };

  // 联系人change
  linkmanChange = value => {
    const { formVals, linkmanList } = this.state;
    const select = linkmanList.find(item => item.UserID === value);
    const { CellphoneNO, Email, PhoneNO, UserID, Name } = select;
    Object.assign(formVals, { CellphoneNO, Email, PhoneNO, UserID, Contacts: Name });
    this.setState({ formVals });
  };

  // 地址改变
  handleAdreessChange = value => {
    const { addList, formVals } = this.state;
    const select = addList.find(item => item.AddressID === value);
    const {
      Province,
      ProvinceID,
      City,
      CityID,
      Area,
      AreaID,

      AddressID,
      Address,
    } = select;
    Object.assign(formVals, {
      Province,
      ProvinceID,
      City,
      CityID,
      Area,
      AreaID,

      AddressID,
      Address,
    });
    this.setState({ formVals });
  };

  // 添加行
  addLineSKU = selectedRows => {
    const {
      global: { currentUser },
    } = this.props;
    const { formVals } = this.state;
    let newLineID = 1;
    if (formVals.TI_Z03002.length) {
      newLineID = formVals.TI_Z03002[formVals.TI_Z03002.length - 1].LineID + 1;
    }
    selectedRows.map((item, index) => {
      if (item.LineStatus !== 'O') return;
      newLineID += index;
      const {
        LineComment,
        SKU,
        SKUName,
        BrandName,
        ProductName,
        ManufactureNO,
        ManLocation,
        HSVatRate,
        HSVatRateOther,
        ForeignParameters,
        CustomerName,
        Rweight,
        ForeignFreight,
        AdvisePrice,
        ForeignName,
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
        BaseEntry,
        BaseLineID,
        DocEntry,
        SourceType,
      } = item;
      formVals.TI_Z03002.push({
        QuotationEntry: DocEntry,
        QuotationLineID: LineID,
        BaseEntry,
        BaseLineID,
        SourceType,
        LineComment,
        SKU,
        SKUName,
        BrandName,
        ProductName,
        ManufactureNO,
        ManLocation,
        HSCode: item.HSCode || '',
        HSVatRate,
        HSVatRateOther,
        CustomerName,
        Rweight,
        ForeignFreight,
        AdvisePrice,
        ForeignName,
        Parameters,
        Package,
        Purchaser,
        Quantity,
        Unit,
        ForeignParameters,
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
      });
    });
    this.setState({ formVals, orderModalVisible: false }, () => {
      this.getTotal();
    });
  };

  // 海关编码change
  codeChange = (select, record, index) => {
    const { Code, U_VatRate, U_VatRateOther } = select;
    const { formVals } = this.state;
    Object.assign(record, { HSCode: Code, HSVatRate: U_VatRate, HSVatRateOther: U_VatRateOther });
    formVals.TI_Z03002[index] = record;
    this.setState({ formVals });
  };

  // 删除 其他推送人
  deletePushLine = index => {
    const { formVals } = this.state;
    formVals.TI_Z03005.splice(index, 1);
    this.setState({ formVals: { ...formVals } });
  };

  // 添加推送人
  submitPushLine = selectedRows => {
    const { formVals } = this.state;
    if (formVals.TI_Z03005.length) {
      Object.assign(formVals, { TI_Z03005: [...formVals.TI_Z03005, ...selectedRows] });
    } else {
      Object.assign(formVals, { TI_Z03005: [...selectedRows] });
    }
    this.setState({ formVals: { ...formVals }, pushModalVisible: false });
  };

  // 添加推送人modal
  addpush = () => {
    const { linkmanList } = this.state;
    if (!linkmanList.length) return;
    if (linkmanList.length < 1) {
      message.warning('该客户仅有一个联系人，暂无其他可添加');
      return;
    }
    this.setState({
      pushModalVisible: true,
    });
  };

  saveHandle = () => {
    // 保存主数据
    const {
      form,
      dispatch,
      global: { currentUser },
    } = this.props;
    const { formVals } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error(Object.values(err)[0].errors[0].message);
        return;
      }
      delete fieldsValue.CardCode;
      delete fieldsValue.CardName;
      dispatch({
        type: 'agreementEdit/add',
        payload: {
          Content: {
            ...formVals,
            ...fieldsValue,
            DueDate: fieldsValue.DueDate ? fieldsValue.DueDate.format('YYYY-MM-DD') : '',
            ToDate: fieldsValue.ToDate ? fieldsValue.ToDate.format('YYYY-MM-DD') : '',
            DocDate: fieldsValue.DocDate ? fieldsValue.DocDate.format('YYYY-MM-DD') : '',
            CreateUser: currentUser.UserCode,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('添加成功');
            router.push(`/sellabout/TI_Z030/detail?DocEntry=${response.Content.DocEntry}`);
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
      global: { currentUser },
    } = this.props;
    const { formVals } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      delete fieldsValue.CardCode;
      delete fieldsValue.CardName;
      dispatch({
        type: 'agreementEdit/update',
        payload: {
          Content: {
            ...formVals,
            ...fieldsValue,
            DueDate: fieldsValue.DueDate ? fieldsValue.DueDate.format('YYYY-MM-DD') : '',
            ToDate: fieldsValue.ToDate ? fieldsValue.ToDate.format('YYYY-MM-DD') : '',
            DocDate: fieldsValue.DocDate ? fieldsValue.DocDate.format('YYYY-MM-DD') : '',
            UpdateUser: currentUser.UserCode,
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

  // 取消单据
  cancelSubmit = ClosedComment => {
    const { dispatch } = this.props;
    const {
      formVals: { UpdateTimestamp, DocEntry },
    } = this.state;
    dispatch({
      type: 'agreementEdit/cancel',
      payload: {
        Content: {
          DocEntry,
          UpdateTimestamp,
          ClosedComment,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('取消成功');
        }
      },
    });
  };

  // 发送需询价
  submitNeedLine = () => {
    const {
      dispatch,
      global: { currentUser },
    } = this.props;
    const {
      formVals: { UpdateTimestamp, DocEntry },
    } = this.state;
    dispatch({
      type: 'agreementEdit/confirm',
      payload: {
        Content: {
          UpdateTimestamp,
          DocEntry,
          UpdateUser: currentUser.UserCode,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
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
      type: 'agreementEdit/costCheck',
      payload: {
        Content: {
          DocEntry,
          UpdateTimestamp,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('提交成功');

          this.setState({ needmodalVisible: false });
        }
      },
    });
  };

  topMenu = () => (
    <Menu>
      <Menu.Item>
        <Link target="_blank" to="/sellabout/TI_Z030/add">
          新建销售合同
        </Link>
      </Menu.Item>
      <Menu.Item>
        <a href="javacript:void(0)" onClick={() => this.setState({ needmodalVisible: true })}>
          确认销售合同
        </a>
      </Menu.Item>
      <Menu.Item>
        <a href="javacript:void(0)" onClick={this.costCheck}>
          成本核算
        </a>
      </Menu.Item>
    </Menu>
  );

  render() {
    const {
      form: { getFieldDecorator },
      global: { Saler, Company, TI_Z004 },
      addloading,
      updateloading,
      detailloading,
      location: { query },
    } = this.props;
    const {
      formVals,
      tabIndex,
      targetLine,
      linkmanList,
      addList,
      uploadmodalVisible,
      orderModalVisible,
      skuModalVisible,
      needmodalVisible,
      attachmentVisible,
      pushModalVisible,
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
    const pushParentMethods = {
      handleSubmit: this.submitPushLine,
      handleModalVisible: this.handleModalVisible,
    };

    const newdata = [...formVals.TI_Z03002];
    if (newdata.length > 0) {
      newdata.push({
        LineID: newdata[newdata.length - 1].LineID + 1,
        lastIndex: true,
        InquiryLineTotal: formVals.InquiryDocTotal,
        InquiryLineTotalLocal: formVals.InquiryDocTotalLocal,
        LineTotal: formVals.DocTotal,
        OtherTotal: formVals.OtherTotal,
        ProfitLineTotal: formVals.ProfitTotal,
      });
    }

    const attachmentList = [];
    formVals.TI_Z02603Fahter.map(item => {
      attachmentList.push(...item.TI_Z02603);
    });

    return (
      <Card bordered={false} loading={detailloading}>
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
              <FormItem key="UserID" {...this.formLayout} label="联系人">
                {getFieldDecorator('UserID', {
                  rules: [{ required: true, message: '请输入联系人！' }],
                  initialValue: formVals.UserID,
                })(
                  <Select
                    placeholder="请选择联系人"
                    onSelect={this.linkmanChange}
                    style={{ width: '100%' }}
                  >
                    {linkmanList.map(option => (
                      <Option key={option.UserID} value={option.UserID}>
                        {option.Name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="ToDate" {...this.formLayout} label="有效期至">
                {getFieldDecorator('ToDate', {
                  initialValue: formVals.ToDate ? moment(formVals.ToDate, 'YYYY-MM-DD') : null,
                })(<DatePicker style={{ width: '100%' }} />)}
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
        </Form>
        <Tabs tabBarExtraContent={this.rightButton(tabIndex)} onChange={this.tabChange}>
          <TabPane tab="物料" key="1">
            {query.DocEntry ? (
              <EditableFormTable
                rowChange={this.rowChange}
                rowKey="LineID"
                scroll={{ x: 4200 }}
                columns={this.skuColumns1}
                data={newdata}
              />
            ) : (
              <EditableFormTable
                rowChange={this.rowChange}
                rowKey="LineID"
                scroll={{ x: 3700 }}
                columns={this.skuColumns2}
                data={newdata}
              />
            )}
            <Row style={{ marginTop: 20 }} gutter={8}>
              <Col lg={10} md={12} sm={24}>
                <FormItem key="Owner" {...this.formLayout} label="销售员">
                  {getFieldDecorator('Owner', {
                    initialValue: formVals.Owner,
                    rules: [{ required: true, message: '请选择销售员！' }],
                  })(<MDMCommonality initialValue={formVals.Owner} data={Saler} />)}
                </FormItem>
              </Col>
              <Col lg={10} md={12} sm={24}>
                <FormItem key="Comment" {...this.formLayout} label="备注">
                  {getFieldDecorator('Comment', {
                    initialValue: formVals.Comment,
                  })(<TextArea placeholder="请输入备注" />)}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="常规" key="2">
            <Row gutter={8} className="rowFlex">
              <Col lg={8} md={12} sm={24}>
                <FormItem key="CellphoneNO" {...this.formLayout} label="手机号码">
                  {getFieldDecorator('CellphoneNO', {
                    initialValue: formVals.CellphoneNO,
                    rules: [{ required: true, message: '请输入手机号码！' }],
                  })(<Input disabled placeholder="手机号码" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="PhoneNO" {...this.formLayout} label="联系人电话">
                  {getFieldDecorator('PhoneNO', {
                    initialValue: formVals.PhoneNO,
                  })(<Input disabled placeholder="电话号码" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="Email " {...this.formLayout} label="联系人邮箱">
                  {getFieldDecorator('Email', {
                    rules: [{ validator: this.validatorEmail }],
                    initialValue: formVals.Email,
                  })(<Input disabled placeholder="请输入邮箱" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="address" {...this.formLayout} label="地址">
                  {getFieldDecorator('address', {
                    rules: [{ required: true, message: '请选择地址！' }],
                    initialValue: formVals.AddressID,
                  })(
                    <Select
                      placeholder="请选择地址"
                      onSelect={this.handleAdreessChange}
                      style={{ width: '100%' }}
                    >
                      {addList.map(option => (
                        <Option key={option.AddressID} value={option.AddressID}>
                          {`${option.Province}/${option.City}/${option.Area}`}
                        </Option>
                      ))}
                    </Select>
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
                <FormItem key="Transport" {...this.formLayout} label="单独运输">
                  {getFieldDecorator('Transport', {
                    initialValue: formVals.Transport,
                    rules: [{ required: true, message: '请选择运输方式' }],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
                  )}
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
            </Row>
          </TabPane>
          <TabPane tab="其余成本" key="3">
            <StandardTable
              data={{ list: formVals.TI_Z03004 }}
              rowKey="LineID"
              columns={otherCostCColumns}
            />
          </TabPane>
          <TabPane tab="附件" key="4">
            {formVals.TI_Z02603Fahter.length ? (
              <Collapse>
                {formVals.TI_Z02603Fahter.map(item => {
                  const header = (
                    <div>
                      单号：{' '}
                      <Link
                        target="_blank"
                        to={`/sellabout/TI_Z026/detail?DocEntry=${item.DocEntry}`}
                      >
                        {item.DocEntry}
                      </Link>
                      ; 创建日期：{moment(item.FCreateDate).format('YYYY-MM-DD')}； 创建人
                      <span>{getName(TI_Z004, item.FCreateUser)}</span>； 更新日期：
                      {moment(item.FUpdateDate).format('YYYY-MM-DD')}； 更新人:
                      <span>{getName(TI_Z004, item.FUpdateUser)}</span>
                      <Icon
                        title="上传附件"
                        className="icons"
                        style={{ color: '#08c', marginRight: 5, marginLeft: 5 }}
                        type="cloud-upload"
                        onClick={() => this.skuLineAttachment(item, '', false)}
                      />
                    </div>
                  );
                  return (
                    <Panel header={header} key={item.DocEntry}>
                      {item.TI_Z02603.map((line, index) => (
                        <ul key={line.OrderID}>
                          <li>序号:{line.OrderID}</li>
                          <li>
                            来源类型:<span>{getName(baseType, line.BaseType)}</span>
                          </li>
                          <li>来源单号:{line.BaseEntry}</li>
                          <li>附件代码:{line.AttachmentCode}</li>
                          <li>附件描述:{line.AttachmentName}</li>
                          <li>
                            附件路径:
                            <a href={line.AttachmentPath} target="_blank" rel="noopener noreferrer">
                              {line.AttachmentPath}
                            </a>
                          </li>
                          <li>
                            操作:{' '}
                            <Icon
                              title="删除行"
                              type="delete"
                              theme="twoTone"
                              onClick={() => this.deleteLine(item, index, false)}
                            />
                          </li>
                        </ul>
                      ))}
                    </Panel>
                  );
                })}
              </Collapse>
            ) : (
              <Empty />
            )}
          </TabPane>
          <TabPane tab="其他推送人" key="5">
            <StandardTable
              data={{ list: formVals.TI_Z03005 }}
              rowKey="UserID"
              columns={this.linkmanColumns}
            />
          </TabPane>
        </Tabs>

        <FooterToolbar>
          {formVals.DocEntry ? (
            <Fragment>
              <CancelOrder cancelSubmit={this.cancelSubmit} />

              <Button
                loading={updateloading}
                style={{ marginLeft: 10 }}
                onClick={this.updateHandle}
                type="primary"
              >
                更新
              </Button>
              <Dropdown overlay={this.topMenu} placement="topCenter">
                <Button type="primary">
                  更多
                  <Icon type="ellipsis" />
                </Button>
              </Dropdown>
            </Fragment>
          ) : (
            <Button loading={addloading} onClick={this.saveHandle} type="primary">
              保存
            </Button>
          )}
        </FooterToolbar>
        <OrderAttachUpload {...uploadmodalMethods} modalVisible={uploadmodalVisible} />
        <AskPriceFetch
          onRef={c => {
            this.getAskPriceOrder = c;
          }}
          SearchText={formVals.CardCode}
          {...orderParentMethods}
          modalVisible={orderModalVisible}
        />
        <SKUModal {...parentMethods} modalVisible={skuModalVisible} />

        <Modal
          width={960}
          destroyOnClose
          title="行预览"
          visible={attachmentVisible}
          onOk={() => this.handleModalVisible(false)}
          onCancel={() => this.handleModalVisible(false)}
        >
          <Tabs>
            <TabPane key="1" tab="行附件">
              <Attachment
                dataSource={targetLine.TI_Z02604}
                deleteLineFun={(record, index) => this.deleteLine(record, index, true)}
              />
            </TabPane>
            <TabPane key="2" tab="行成本核算">
              <StandardTable
                data={{ list: targetLine.TI_Z03003 }}
                rowKey="LineID"
                columns={otherCostCColumns}
              />
            </TabPane>
          </Tabs>
        </Modal>

        <NeedAskPrice
          data={formVals.TI_Z03002}
          {...needParentMethods}
          modalVisible={needmodalVisible}
        />
        {/* 其他推送人 */}
        <PushLink data={linkmanList} {...pushParentMethods} modalVisible={pushModalVisible} />
      </Card>
    );
  }
}

export default AgreementEdit;
