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
  Upload,
  Modal,
  message,
  DatePicker,
  Select,
  Dropdown,
  Menu,
  Tag,
  Badge,
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
import SKUModal from '@/components/Modal/SKU';
import Brand from '@/components/Brand';
import MDMCommonality from '@/components/Select';
import NeedAskPrice from '../components/needAskPrice';
import CompanySelect from '@/components/Company/index';
import HSCode from '@/components/HSCode';
import PushLink from '@/components/PushLink';
import Attachment from '@/components/Attachment';
import MyTag from '@/components/Tag';
import Comparison from '@/components/Comparison';
import MyPageHeader from '../components/pageHeader';
import { getName } from '@/utils/utils';
import { orderSourceType, lineStatus } from '@/utils/publicData';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ inquiryEdit, loading, global }) => ({
  inquiryEdit,
  global,
  addloading: loading.effects['inquiryEdit/add'],
  updateloading: loading.effects['inquiryEdit/update'],
  detailLoading: loading.effects['inquiryEdit/fetch'],
}))
@Form.create()
class InquiryEdit extends React.Component {
  skuColumns1 = [
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
      width: 100,
      dataIndex: 'HSVatRate',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? '' : <span>{`${text}-${record.HSVatRateOther}`}</span>,
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
      title: '要求交期',
      width: 120,
      inputType: 'text',
      dataIndex: 'DueDate',
      editable: true,
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 80,
      render: (text, record, index) => {
        const {
          inquiryDetail: { DocEntry },
        } = this.state;
        return record.lastIndex ? null : (
          <Fragment>
            <Badge
              count={record.TI_Z02604 ? record.TI_Z02604.length : 0}
              showZero
              className="attachBadge"
            >
              <Icon
                title="预览"
                type="eye"
                onClick={() => this.lookLineAttachment(record, index)}
                style={{ color: '#08c', marginRight: 5 }}
              />
            </Badge>
            {DocEntry ? (
              <Icon
                title="上传附件"
                className="icons"
                style={{ color: '#08c', marginRight: 5, marginLeft: 5 }}
                type="cloud-upload"
                onClick={() => this.skuLineAttachment(record, index)}
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

  skuColumns2 = [
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
      title: '需询价',
      width: 100,
      dataIndex: 'IsInquiry',
      align: 'center',
      render: (text, record) => (record.lastIndex ? null : <MyTag type="IsInquiry" value={text} />),
    },
    {
      title: '询价价格',
      width: 120,
      dataIndex: 'InquiryPrice',
      align: 'center',
      render: (text, record) => {
        if (record.lastIndex) return '';
        if (!text) return '';
        return (
          <Ellipsis tooltip lines={1}>
            {`${text || ''}(${record.Currency || ''})[${record.DocRate || ''}]`}
          </Ellipsis>
        );
      },
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
          <Ellipsis tooltip lines={1}>
            {`${text || ''}${
              record.Currency ? `(${record.Currency})` : ''
            }-${record.InquiryLineTotalLocal || ''}`}
          </Ellipsis>
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
        record.lastIndex ? '' : <span>{`${text || 0}-${record.HSVatRateOther || 0}`}</span>,
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
      title: '要求交期',
      width: 120,
      inputType: 'text',
      dataIndex: 'DueDate',
      editable: true,
      align: 'center',
    },
    {
      title: '国外运费',
      width: 80,
      dataIndex: 'ForeignFreight',
      align: 'center',
    },
    {
      title: '建议价格',
      width: 100,
      dataIndex: 'AdvisePrice',
      align: 'center',
    },
    {
      title: '采购员',
      width: 100,
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
      title: '行状态',
      width: 80,
      dataIndex: 'LineStatus',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? null : <Tag color="green">{getName(lineStatus, text)}</Tag>,
    },
    {
      title: '采询确认',
      width: 80,
      dataIndex: 'PLineStatus',
      align: 'center',
      render: (text, record) => (record.lastIndex ? null : <MyTag type="确认" value={text} />),
    },
    {
      title: '处理人',
      width: 80,
      dataIndex: 'Processor',
      render: (val, record) => {
        const {
          global: { TI_Z004 },
        } = this.props;
        return record.lastIndex ? null : <span>{getName(TI_Z004, val)}</span>;
      },
    },
    {
      title: '转移备注',
      width: 100,
      dataIndex: 'TransferComment',
      render: (text, record) =>
        record.lastIndex ? null : (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
    },
    {
      title: '销报单号',
      width: 80,
      dataIndex: 'QuoteEntry',
      align: 'center',
      render: (text, recond) =>
        text ? (
          <Link target="_blank" to={`/sellabout/TI_Z029/detail?DocEntry=${text}`}>
            {`${text}-${recond.QuoteLine}`}
          </Link>
        ) : (
          ''
        ),
    },
    {
      title: '销合单号',
      width: 80,
      align: 'center',
      dataIndex: 'ContractEntry',
      render: (text, recond) =>
        text ? (
          <Link target="_blank" to={`/sellabout/TI_Z030/detail?DocEntry=${text}`}>
            {`${text}-${recond.ContractLine}`}
          </Link>
        ) : (
          ''
        ),
    },
    {
      title: '销订单号',
      width: 80,
      align: 'center',
      dataIndex: 'SoEntry',
      render: (text, recond) =>
        text ? (
          <Link target="_blank" to={`/sellabout/orderdetail?DocEntry=${text}`}>
            {`${text}-${recond.SoLine}`}
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
          inquiryDetail: { DocEntry },
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
                onClick={() => this.skuLineAttachment(record, index)}
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
      width: 80,
      dataIndex: 'UserID',
    },
    {
      title: '联系人',
      align: 'center',
      width: 100,
      dataIndex: 'Contacts',
    },
    {
      title: '手机号',
      align: 'center',
      width: 100,
      dataIndex: 'CellphoneNO',
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
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
      inquiryDetail: {
        SourceType: '1',
        OrderType: '1',
        DocDate: moment().format('YYYY-MM-DD'),
        CreateDate: moment().format('YYYY-MM-DD'),
        ToDate: moment()
          .add('30', 'day')
          .format('YYYY-MM-DD'),
        TI_Z02602: [],
        TI_Z02605: [],
        Comment: '',
        CardCode: '',
        CardName: '',
        Contacts: '',
        CellphoneNO: '',
        PhoneNO: '',
        Email: '',
        Fax: '',
        CompanyCode: '',
        DueDate: '',
        InquiryDocTotal: 0,
        InquiryDocTotalLocal: 0,
        DocTotal: 0,
        ProvinceID: '',
        Province: '',
        CityID: '',
        City: '',
        AreaID: '',
        Area: '',
        Address: '',
        AddressID: '',
        NumAtCard: '',
        Owner: '',
      }, // 单据信息
      tabIndex: '1', // tab
      uploadmodalVisible: false, // 上传Modal
      attachmentVisible: false, // 附件Modal
      skuModalVisible: false, // 物料选择 Modal
      needmodalVisible: false, // 确认需询价 Modal
      pushModalVisible: false, // 其他推送人 Modal
      LineID: Number, // 当前选中行index
      linkmanList: [], // 联系人list
      addList: [], // 地址list
      thisLine: {
        // 当前行
        TI_Z02604: [],
      },
      selectedRows: [], // 需询价
      DefaultWhsCode: '', // 当前仓库
    };
    this.formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
  }

  componentDidMount() {
    const {
      dispatch,
      global: { currentUser, CustomerList, BrandList, HSCodeList },
    } = this.props;
    const { CompanyCode, Owner, DefaultWhsCode, UserCode } = currentUser;
    const { inquiryDetail } = this.state;
    if (!CustomerList.length) {
      dispatch({
        type: 'global/getCustomer',
      });
    }
    if (!HSCodeList.length) {
      dispatch({
        type: 'global/getHscode',
      });
    }
    if (!BrandList.length) {
      dispatch({
        type: 'global/getBrand',
      });
    }
    this.setState({
      DefaultWhsCode,
      inquiryDetail: {
        ...inquiryDetail,
        CompanyCode,
        Owner,
        CreateUser: UserCode,
      },
    });

    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Purchaser', 'TI_Z042', 'TI_Z004', 'WhsCode', 'Company'],
          Key: '1',
        },
      },
    });
    this.getDetail();
  }

  topMenu = () => {
    const { inquiryDetail } = this.state;
    return (
      <Menu>
        <Menu.Item>
          <Link target="_blank" to={`/sellabout/TI_Z029/add?BaseEntry=${inquiryDetail.DocEntry}`}>
            复制到销售报价单
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link target="_blank" to="/sellabout/TI_Z026/TI_Z02601">
            新建客户询价单
          </Link>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.selectNeed}>确认需采购询价</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.copySelf}>复制到客户询价单</a>
        </Menu.Item>
      </Menu>
    );
  };

  copySelf = () => {
    const { inquiryDetail } = this.state;
    this.setState({
      inquiryDetail: {
        ...inquiryDetail,
        DocEntry: '',
      },
    });
  };

  // 获取单据详情
  getDetail = () => {
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
        callback: response => {
          if (response && response.Status === 200) {
            this.setState({
              inquiryDetail: response.Content,
            });
            this.getCompany(response.Content.CardCode);
          }
        },
      });
    }
  };

  getCompany = Code => {
    const { dispatch } = this.props;
    dispatch({
      type: 'inquiryEdit/company',
      payload: {
        Content: { Code },
      },
      callback: response => {
        if (response && response.Status === 200) {
          const { TI_Z00603List, TI_Z00602List } = response.Content;
          this.setState({
            addList: TI_Z00603List,
            linkmanList: TI_Z00602List,
          });
        }
      },
    });
  };

  // 删除 其他推送人
  deletePushLine = index => {
    const { inquiryDetail } = this.state;
    inquiryDetail.TI_Z02605.splice(index, 1);
    this.setState({ inquiryDetail: { ...inquiryDetail } });
  };

  // 添加推送人
  submitPushLine = selectedRows => {
    const { inquiryDetail } = this.state;
    if (inquiryDetail.TI_Z02605.length) {
      Object.assign(inquiryDetail, { TI_Z02605: [...inquiryDetail.TI_Z02605, ...selectedRows] });
    } else {
      Object.assign(inquiryDetail, { TI_Z02605: [...selectedRows] });
    }
    this.setState({ inquiryDetail: { ...inquiryDetail }, pushModalVisible: false });
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

  // 海关编码change
  codeChange = (select, record, index) => {
    const { Code, U_VatRate } = select;
    const { inquiryDetail } = this.state;
    Object.assign(record, { HSCode: Code, HSVatRate: U_VatRate, HSVatRateOther: '' });
    inquiryDetail.TI_Z02602[index] = record;
    this.setState({ inquiryDetail });
  };

  //  行内容改变
  rowChange = record => {
    const { inquiryDetail } = this.state;
    inquiryDetail.TI_Z02602.map(item => {
      if (item.LineID === record.LineID) {
        record.SKUName = `${record.BrandName}  ${record.ProductName}  ${record.ManufactureNO}  ${
          record.Parameters
        }  ${record.Package}`;
        return record;
      }
      return item;
    });
    this.setState({ inquiryDetail }, () => {
      this.getTotal();
    });
  };

  //  计算总计
  getTotal = () => {
    const { inquiryDetail } = this.state;
    let DocTotal = 0;
    // eslint-disable-next-line array-callback-return
    inquiryDetail.TI_Z02602.map(record => {
      record.LineTotal = isNaN(record.Quantity * record.Price) ? 0 : record.Quantity * record.Price;
      record.LineTotal = round(record.LineTotal, 2);
      DocTotal += record.LineTotal;
    });
    inquiryDetail.DocTotal = DocTotal;
    this.setState({ inquiryDetail });
  };

  // 品牌,仓库改变

  rowSelectChange = (value, record, index, key) => {
    const { inquiryDetail } = this.state;
    record[key] = value;
    record.SKUName = `${record.BrandName}  ${record.ProductName}  ${record.ManufactureNO}  ${
      record.Parameters
    }  ${record.Package}`;
    inquiryDetail.TI_Z02602[index] = record;

    this.setState({ inquiryDetail: { ...inquiryDetail } });
  };

  // sku输入框获取焦点
  focusLine = (record, LineID) => {
    this.setState({ thisLine: { ...record }, LineID, skuModalVisible: true });
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
    const { thisLine, LineID, inquiryDetail } = this.state;
    inquiryDetail.TI_Z02602[LineID] = {
      ...thisLine,
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
    this.setState({ inquiryDetail: { ...inquiryDetail } });
    this.handleModalVisible(false);
  };

  // 删除附件
  deleteLine = (record, index) => {
    const {
      inquiryDetail,
      inquiryDetail: { DocEntry },
      LineID,
    } = this.state;
    let attch;
    if (LineID >= 0) {
      inquiryDetail.TI_Z02602[LineID].TI_Z02604.splice(index, 1);
      attch = {
        Content: {
          Type: '2',
          DocEntry,
          ItemLine: record.LineID,
          EnclosureList: [inquiryDetail.TI_Z02602[LineID].TI_Z02604],
        },
      };
    } else {
      inquiryDetail.TI_Z02603.splice(index, 1);
      attch = {
        Content: {
          Type: '1',
          DocEntry,
          ItemLine: 0,
          EnclosureList: [...inquiryDetail.TI_Z02603],
        },
      };
    }
    this.attachmentHandle(attch);
  };

  // 行物料附件弹窗显隐
  skuLineAttachment = (record, index) => {
    this.setState({ LineID: index, uploadmodalVisible: true, thisLine: record });
  };

  // 查看行物料

  lookLineAttachment = (record, index) => {
    this.setState({ LineID: index, attachmentVisible: true, thisLine: { ...record } });
  };

  // 删除行物料
  deleteSKULine = (record, index) => {
    const { inquiryDetail } = this.state;
    inquiryDetail.TI_Z02602.splice(index, 1);
    this.setState({ inquiryDetail }, () => {
      this.getTotal();
    });
  };

  // 获取上传成功附件，插入到对应数组
  handleSubmit = fileList => {
    const {
      inquiryDetail,
      inquiryDetail: { DocEntry },
      LineID,
      thisLine,
    } = this.state;

    const lastsku = inquiryDetail.TI_Z02603[inquiryDetail.TI_Z02603.length - 1];

    let attch;
    if (LineID >= 0) {
      const thisLineChild = inquiryDetail.TI_Z02602[LineID].TI_Z02604;
      const last = thisLineChild[thisLineChild.length - 1];
      const ID = last ? last.OrderID + 1 : 1;
      attch = {
        Content: {
          Type: '2',
          DocEntry,
          ItemLine: thisLine.LineID,
          EnclosureList: [...thisLineChild],
        },
      };
      fileList.map((file, index) => {
        const { AttachmentPath, AttachmentCode, AttachmentName, AttachmentExtension } = file;
        attch.Content.EnclosureList.push({
          DocEntry,
          OrderID: ID + index,
          ItemLine: thisLine.LineID,
          BaseType: 'TI_Z026',
          BaseEntry: DocEntry,
          BaseLineID: thisLine.LineID,
          AttachmentCode,
          AttachmentName,
          AttachmentPath,
          AttachmentExtension,
        });
      });
    } else {
      attch = {
        Content: {
          Type: '1',
          DocEntry,
          ItemLine: 0,
          EnclosureList: [...inquiryDetail.TI_Z02603],
        },
      };
      fileList.map((file, index) => {
        const { AttachmentPath, AttachmentCode, AttachmentName, AttachmentExtension } = file;
        attch.Content.EnclosureList.push({
          DocEntry,
          OrderID: lastsku ? lastsku.OrderID + index + 1 : 1,
          ItemLine: 0,
          BaseType: 'TI_Z026',
          BaseEntry: DocEntry,
          BaseLineID: lastsku ? lastsku.BaseLineID + 1 : 1,
          AttachmentCode,
          AttachmentName,
          AttachmentPath,
          AttachmentExtension,
        });
      });
    }
    this.attachmentHandle(attch);
  };

  attachmentHandle = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'inquiryEdit/upload',
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
      skuModalVisible: !!flag,
      needmodalVisible: !!flag,
      pushModalVisible: !!flag,
      LineID: Number,
    });
  };

  // change tab
  tabChange = tabIndex => {
    this.setState({ tabIndex });
  };

  rightButton = tabIndex => {
    const {
      inquiryDetail: { DocEntry },
    } = this.state;
    if (tabIndex === '1') {
      return (
        <Button icon="plus" style={{ marginLeft: 8 }} type="primary" onClick={this.addLineSku}>
          添加新物料
        </Button>
      );
    }
    if (tabIndex === '3' && DocEntry) {
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
    if (tabIndex === '4') {
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
    const { inquiryDetail } = this.state;
    this.setState(
      {
        inquiryDetail: {
          ...inquiryDetail,
          CardCode: company.Code,
          CardName: company.Name,
        },

        linkmanList: TI_Z00602List,
        addList: TI_Z00603List,
      },
      () => {
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
      }
    );
  };

  // 联系人change
  linkmanChange = value => {
    const { inquiryDetail, linkmanList } = this.state;
    const select = linkmanList.find(item => item.UserID === value);
    const { CellphoneNO, Email, PhoneNO, UserID, Name } = select;
    this.setState({
      inquiryDetail: { ...inquiryDetail, CellphoneNO, Email, PhoneNO, UserID, Contacts: Name },
    });
  };

  // 地址改变
  handleAdreessChange = value => {
    const { addList, inquiryDetail } = this.state;
    const select = addList.find(item => item.AddressID === value);
    const { Province, ProvinceID, City, CityID, Area, AreaID, AddressID, Address } = select;
    this.setState({
      inquiryDetail: {
        ...inquiryDetail,
        Province,
        ProvinceID,
        City,
        CityID,
        Area,
        AreaID,
        AddressID,
        Address,
      },
    });
  };

  addLineSku = () => {
    // 添加物料
    const { inquiryDetail, DefaultWhsCode } = this.state;
    const last = inquiryDetail.TI_Z02602[inquiryDetail.TI_Z02602.length - 1];
    const LineID = last ? last.LineID + 1 : 1;
    inquiryDetail.TI_Z02602.push({
      LineID,
      SKU: '',
      SKUName: '',
      BrandName: last?last.BrandName:'',
      ProductName: '',
      ManufactureNO: '',
      ManLocation: '',
      HSCode: '',
      HSVatRate: '',
      HSVatRateOther: '',
      CustomerName: '',
      Rweight: '',
      ForeignFreight: '',
      AdvisePrice: '',
      ForeignName: '',
      Parameters: '',
      Package: '',
      Quantity: '',
      Unit: '',
      DueDate: inquiryDetail.DueDate,
      WhsCode: DefaultWhsCode,
      Price: '',
      LineTotal: '',
      TI_Z02604: [],
    });
    this.setState({ inquiryDetail });
  };

  saveHandle = () => {
    // 保存主数据
    const { form, dispatch } = this.props;
    const { inquiryDetail } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        // eslint-disable-next-line compat/compat
        message.error(Object.values(err)[0].errors[0].message);
        return;
      }
      delete fieldsValue.address;
      delete fieldsValue.CardCode;
      delete fieldsValue.CardName;
      dispatch({
        type: 'inquiryEdit/add',
        payload: {
          Content: {
            ...inquiryDetail,
            ...fieldsValue,
            ToDate: fieldsValue.ToDate ? fieldsValue.ToDate.format('YYYY-MM-DD') : '',
            DocDate: fieldsValue.DocDate ? fieldsValue.DocDate.format('YYYY-MM-DD') : '',
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('添加成功');
            router.push(`/sellabout/TI_Z026/detail?DocEntry=${response.Content.DocEntry}`);
          }
        },
      });
    });
  };

  // 更新主数据
  updateHandle = () => {
    const { form, dispatch } = this.props;
    const { inquiryDetail } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        // eslint-disable-next-line compat/compat
        message.error(Object.values(err)[0].errors[0].message);
        return;
      }
      delete fieldsValue.address;
      delete fieldsValue.CardCode;
      delete fieldsValue.CardName;
      dispatch({
        type: 'inquiryEdit/update',
        payload: {
          Content: {
            ...inquiryDetail,
            ...fieldsValue,
            ToDate: fieldsValue.ToDate ? fieldsValue.ToDate.format('YYYY-MM-DD') : '',
            DocDate: fieldsValue.DocDate ? fieldsValue.DocDate.format('YYYY-MM-DD') : '',
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
    const { inquiryDetail } = this.state;
    dispatch({
      type: 'inquiryEdit/cancel',
      payload: {
        Content: {
          DocEntry: inquiryDetail.DocEntry,
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
    message.success('提交成功');
    this.setState({ needmodalVisible: false });
    this.getDetail();
  };

  // 确认需要采购询价
  selectNeed = () => {
    const { inquiryDetail } = this.state;
    const selectedRows = inquiryDetail.TI_Z02602.filter((item, index) => {
      const newItem = item;
      newItem.Key = index;
      return newItem.IsInquiry === 'N';
    });
    if (selectedRows.length) {
      this.setState({ selectedRows: [...selectedRows], needmodalVisible: true });
    } else {
      message.warning('暂无需询价的行');
    }
  };

  // 上传需求文件
  uploadChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.response.Status === 200) {
      const { inquiryDetail, DefaultWhsCode } = this.state;
      const last = inquiryDetail.TI_Z02602[inquiryDetail.TI_Z02602.length - 1];
      const LineID = last ? last.LineID + 1 : 1;
      const {
        loTI_Z026ExcelFiledList: { rows },
      } = info.file.response;
      const newArr = rows.map((item, index) => {
        const newItem = item;
        newItem.LineID = LineID + index;
        newItem.SKUName = `${newItem.BrandName}  ${newItem.ProductName}  ${
          newItem.ManufactureNO
        }  ${newItem.Parameters}  ${newItem.Package}`;
        newItem.WhsCode = DefaultWhsCode;
        newItem.HSVatRate = 0;
        newItem.HSVatRateOther = 0;
        newItem.TI_Z02604 = [];
        return newItem;
      });
      Object.assign(inquiryDetail, { TI_Z02602: [...newArr, ...inquiryDetail.TI_Z02602] });
      this.setState({ inquiryDetail });
    } else {
      message.warning(info.file.response.MessageString);
    }
  };

  dueDateChange = val => {
    const { inquiryDetail } = this.state;
    const newArr = inquiryDetail.TI_Z02602.map(item => {
      const newitem = item;
      newitem.DueDate = val.target.value;
      return newitem;
    });
    Object.assign(inquiryDetail, { TI_Z02602: newArr, DueDate: val.target.value });
    this.setState({
      inquiryDetail,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      addloading,
      updateloading,
      global: { Saler, Company, currentUser },
      detailLoading,
      location: { query },
    } = this.props;
    const {
      inquiryDetail,
      tabIndex,
      thisLine,
      linkmanList,
      addList,
      uploadmodalVisible,
      skuModalVisible,
      needmodalVisible,
      attachmentVisible,
      pushModalVisible,
      selectedRows,
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
    const pushParentMethods = {
      handleSubmit: this.submitPushLine,
      handleModalVisible: this.handleModalVisible,
    };
    const newdata = [...inquiryDetail.TI_Z02602];
    if (newdata.length > 0) {
      newdata.push({
        LineID: newdata[newdata.length - 1].LineID + 1,
        lastIndex: true,
        InquiryLineTotal: inquiryDetail.InquiryDocTotal,
        InquiryLineTotalLocal: inquiryDetail.InquiryDocTotalLocal,
        LineTotal: inquiryDetail.DocTotal,
      });
    }
    return (
      <Card bordered={false} loading={detailLoading}>
        <MyPageHeader {...location} />
        <Form {...formItemLayout}>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="CardCode" {...this.formLayout} label="客户ID">
                {getFieldDecorator('CardCode', {
                  rules: [{ required: true, message: '请选择客户！' }],
                  initialValue: { key: inquiryDetail.CardName, label: inquiryDetail.CardCode },
                })(
                  <CompanySelect
                    initialValue={{ key: inquiryDetail.CardName, label: inquiryDetail.CardCode }}
                    onChange={this.changeCompany}
                    keyType="Code"
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="DocEntry" {...this.formLayout} label="单号">
                {getFieldDecorator('DocEntry', {
                  initialValue: inquiryDetail.DocEntry,
                })(<Input disabled placeholder="单号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="CardName" {...this.formLayout} label="客户名称">
                {getFieldDecorator('CardName', {
                  rules: [{ required: true, message: '请输入客户名称！' }],
                  initialValue: { key: inquiryDetail.CardCode, label: inquiryDetail.CardName },
                })(
                  <CompanySelect
                    initialValue={{ key: inquiryDetail.CardCode, label: inquiryDetail.CardName }}
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
                  initialValue: inquiryDetail.DocDate
                    ? moment(inquiryDetail.DocDate, 'YYYY-MM-DD')
                    : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="UserID" {...this.formLayout} label="联系人">
                {getFieldDecorator('UserID', {
                  rules: [{ required: true, message: '请输入联系人！' }],
                  initialValue: inquiryDetail.UserID,
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
              <FormItem key="OrderType" {...this.formLayout} label="订单类型">
                {getFieldDecorator('OrderType', {
                  initialValue: inquiryDetail.OrderType,
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
                  initialValue: inquiryDetail.NumAtCard,
                })(<Input placeholder="请输入客户参考号" />)}
              </FormItem>
            </Col>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="ToDate" {...this.formLayout} label="有效期至">
                {getFieldDecorator('ToDate', {
                  initialValue: inquiryDetail.ToDate
                    ? moment(inquiryDetail.ToDate, 'YYYY-MM-DD')
                    : null,
                  rules: [{ required: true, message: '请选择有效期！' }],
                })(<DatePicker style={{ width: '100%' }} />)}
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
                scroll={{ x: 4100 }}
                columns={this.skuColumns2}
                data={newdata}
              />
            ) : (
              <EditableFormTable
                rowChange={this.rowChange}
                rowKey="LineID"
                scroll={{ x: 2700 }}
                columns={this.skuColumns1}
                data={newdata}
              />
            )}
            <Row style={{ marginTop: 20 }} gutter={8}>
              <Col lg={10} md={12} sm={24}>
                <FormItem key="Owner" {...this.formLayout} label="销售员">
                  {getFieldDecorator('Owner', {
                    initialValue: inquiryDetail.Owner,
                    rules: [{ required: true, message: '请选择销售员！' }],
                  })(<MDMCommonality initialValue={inquiryDetail.Owner} data={Saler} />)}
                </FormItem>
              </Col>
              <Col lg={10} md={12} sm={24}>
                <FormItem key="CreateDate" {...this.formLayout} label="创建日期">
                  <span>{moment(inquiryDetail.CreateDate).format('YYYY-MM-DD')}</span>
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="常规" key="2">
            <Row className="rowFlex" gutter={8}>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="CellphoneNO" {...this.formLayout} label="手机号码">
                  {getFieldDecorator('CellphoneNO', {
                    initialValue: inquiryDetail.CellphoneNO,
                  })(<Input disabled placeholder="手机号码" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="PhoneNO" {...this.formLayout} label="联系人电话">
                  {getFieldDecorator('PhoneNO', {
                    initialValue: inquiryDetail.PhoneNO,
                  })(<Input disabled placeholder="电话号码" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="Email " {...this.formLayout} label="联系人邮箱">
                  {getFieldDecorator('Email', {
                    rules: [{ validator: this.validatorEmail }],
                    initialValue: inquiryDetail.Email,
                  })(<Input disabled placeholder="请输入邮箱" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="address" {...this.formLayout} label="地址">
                  {getFieldDecorator('address', {
                    initialValue: inquiryDetail.AddressID,
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
                    initialValue: inquiryDetail.Address,
                  })(<Input placeholder="请输入详细地址！" />)}
                </FormItem>
              </Col>

              <Col lg={8} md={12} sm={24}>
                <FormItem key="CompanyCode" {...this.formLayout} label="交易公司">
                  {getFieldDecorator('CompanyCode', {
                    initialValue: inquiryDetail.CompanyCode,
                    rules: [{ required: true, message: '请选择交易公司！' }],
                  })(<MDMCommonality initialValue={inquiryDetail.CompanyCode} data={Company} />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="SourceType" {...this.formLayout} label="来源类型">
                  {getFieldDecorator('SourceType', {
                    initialValue: inquiryDetail.SourceType,
                    rules: [{ required: true, message: '请选择来源类型！' }],
                  })(
                    <MDMCommonality
                      initialValue={inquiryDetail.SourceType}
                      data={orderSourceType}
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="Comment" {...this.formLayout} label="备注">
                  {getFieldDecorator('Comment', {
                    initialValue: inquiryDetail.Comment,
                  })(<Input placeholder="请输入备注" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="DueDate" {...this.formLayout} label="要求交期">
                  {getFieldDecorator('DueDate', {
                    initialValue: inquiryDetail.DueDate,
                  })(<Input onChange={this.dueDateChange} placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="附件" key="3">
            <Attachment dataSource={inquiryDetail.TI_Z02603} deleteLineFun={this.deleteLine} />
          </TabPane>
          <TabPane tab="其他推送人" key="4">
            <StandardTable
              data={{ list: inquiryDetail.TI_Z02605 }}
              rowKey="UserID"
              columns={this.linkmanColumns}
            />
          </TabPane>
        </Tabs>

        <FooterToolbar>
          {inquiryDetail.DocEntry ? (
            <Fragment>
              <CancelOrder cancelSubmit={this.cancelSubmit} />
              <Button onClick={this.updateHandle} type="primary" loading={updateloading}>
                更新
              </Button>
              <Comparison rowkey="LineID" dataSource={inquiryDetail.TI_Z02602} />
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
          <Upload
            action="http://47.104.65.49:8001/TI_Z026/TI_Z02609"
            showUploadList={false}
            onChange={this.uploadChange}
            data={{ UserCode: currentUser.UserCode, Tonken: currentUser.Token }}
          >
            <Button style={{ marginLeft: 8 }} type="primary">
              上传物料
            </Button>
          </Upload>
        </FooterToolbar>
        <OrderAttachUpload {...uploadmodalMethods} modalVisible={uploadmodalVisible} />
        <SKUModal {...parentMethods} modalVisible={skuModalVisible} />
        <Modal
          width={960}
          destroyOnClose
          maskClosable={false}
          title="物料行附件"
          visible={attachmentVisible}
          onOk={() => this.handleModalVisible(false)}
          onCancel={() => this.handleModalVisible(false)}
        >
          <Attachment dataSource={thisLine.TI_Z02604} deleteLineFun={this.deleteLine} />
        </Modal>
        <NeedAskPrice data={selectedRows} {...needParentMethods} modalVisible={needmodalVisible} />
        {/* 其他推送人 */}
        <PushLink data={linkmanList} {...pushParentMethods} modalVisible={pushModalVisible} />
      </Card>
    );
  }
}

export default InquiryEdit;
