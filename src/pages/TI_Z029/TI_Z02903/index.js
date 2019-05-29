import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Modal, Button, Icon, message } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import StandardTable from '@/components/StandardTable';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { getName } from '@/utils/utils';

const { Description } = DescriptionList;
const { TabPane } = Tabs;
const OrderSource = [
  {
    Code: '1',
    Name: '线下',
  },
  {
    Code: '2',
    Name: '网站',
  },
  {
    Code: '3',
    Name: '电话',
  },
  {
    Code: '4',
    Name: '其他来源',
  },
];

@connect(({ SalesQuotationPreview, loading, global }) => ({
  SalesQuotationPreview,
  global,
  loading: loading.models.SalesQuotationPreview,
}))
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
      width: 80,
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
      width: 80,
      align: 'center',
      dataIndex: 'BrandName',
    },
    {
      title: '名称',
      dataIndex: 'ProductName',
      width: 150,
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '型号',
      width: 150,
      dataIndex: 'ManufactureNO',
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '参数',
      width: 150,
      dataIndex: 'Parameters',
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '包装',
      width: 150,
      dataIndex: 'Package',
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '单位',
      width: 80,
      dataIndex: 'Unit',

      align: 'center',
    },
    {
      title: '数量',
      width: 80,

      dataIndex: 'Quantity',

      align: 'center',
    },
    {
      title: '销售建议价',
      width: 100,

      dataIndex: 'Price',

      align: 'center',
    },
    {
      title: '销售行总计',
      width: 120,
      align: 'center',
      dataIndex: 'LineTotal',
      render: (text, record) =>
        record.lastIndex ? <span style={{ fontWeight: 'bolder' }}>{text}</span> : text,
    },
    {
      title: '要求交期',
      width: 100,
      inputType: 'date',
      dataIndex: 'DueDate',
      render: text => <span>{moment(text).format('YYYY-MM-DD')}</span>,
      align: 'center',
    },
    {
      title: '仓库',
      width: 100,
      dataIndex: 'WhsCode',
      align: 'center',
      render: text => {
        const {
          global: { WhsCode },
        } = this.props;
        return <span>{getName(WhsCode, text)}</span>;
      },
    },

    {
      title: '询价最终价',
      width: 100,
      dataIndex: 'InquiryPrice',
      align: 'center',
    },
    {
      title: '询价币种',
      width: 80,
      dataIndex: 'Currency',
      align: 'center',
    },
    {
      title: '单据汇率',
      width: 80,

      dataIndex: 'DocRate',
      align: 'center',
    },
    {
      title: '最终交期',
      width: 100,
      dataIndex: 'InquiryDueDate',
      align: 'center',
      render: text => <span>{moment(text).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '采购员',
      width: 80,
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
      width: 100,
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
      render: (text, record) => (
        <Fragment>
          <a target="_blnk" href={record.AttachmentPath}>
            <Icon title="预览" type="eye" style={{ color: '#08c', marginRight: 5 }} />
          </a>
        </Fragment>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      formVals: {}, // 单据信息
      attachmentVisible: false,
      prviewList: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

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
      type: 'SalesQuotationPreview/save',
      payload: {
        inquiryDetail: {
          Comment: '',
          SDocStatus: '',
          PDocStatus: '',
          Closed: '',
          ClosedBy: '',
          SourceType: '1',
          OrderType: '1',
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
          TI_Z02903: [],
        },
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.SalesQuotationPreview.SalesQuotationDetail !== prevState.formVals) {
      return {
        formVals: nextProps.SalesQuotationPreview.SalesQuotationDetail,
      };
    }
    return null;
  }

  lookLineAttachment = record => {
    this.setState({ attachmentVisible: true, prviewList: [...record.TI_Z02903] });
  };

  handleModalVisible = flag => {
    this.setState({ attachmentVisible: !!flag });
  };

  // 获取单据详情
  getDetail = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.DocEntry) {
      dispatch({
        type: 'SalesQuotationPreview/fetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
          },
        },
      });
    }
  };

  toUpdate = () => {
    const { formVals } = this.state;
    if (formVals.Closed !== 'Y') {
      router.push(`/sellabout/TI_Z029/update?DocEntry=${formVals.DocEntry}`);
    } else {
      message.warn('此单已被关闭，暂不可编辑');
    }
  };

  render() {
    const {
      global: { Saler, Company },
    } = this.props;
    const { formVals, attachmentVisible, prviewList } = this.state;

    const newdata = [...formVals.TI_Z02902];
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
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="单号">{formVals.DocEntry}</Description>
          <Description term="客户ID">{formVals.CardCode}</Description>
          <Description term="客户名称">{formVals.CardName}</Description>
          <Description term="单据日期">{moment(formVals.DocDate).format('YYYY-MM-DD')}</Description>
          <Description term="创建日期">
            {moment(formVals.CreateDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="要求交期">{moment(formVals.DueDate).format('YYYY-MM-DD')}</Description>
          <Description term="有效日期">{moment(formVals.ToDate).format('YYYY-MM-DD')}</Description>
          <Description term="联系人">{formVals.Contacts}</Description>
          <Description term="备注">{formVals.Comment}</Description>
          <Description term="创建人">
            <span>{getName(Saler, formVals.CreateUser)}</span>
          </Description>
          <Description term="交易公司">
            <span>{getName(Company, formVals.CompanyCode)}</span>
          </Description>
          <Description term="订单类型">{formVals.OrderType === '1' ? '正常订单' : ''}</Description>
          <Description term="来源类型">
            <span>{getName(OrderSource, formVals.OrderType)}</span>
          </Description>
          <Description term="客户参考号">{formVals.NumAtCard}</Description>
          <Description term="状态">{formVals.DocStatus === 'O' ? '未清' : '已清'}</Description>
          <Description term="报价状态">
            {formVals.SDocStatus === 'O' ? '已报价' : '未报价'}
          </Description>
          <Description term="关闭状态">{formVals.Closed === 'Y' ? '已关闭' : '未关闭'}</Description>
        </DescriptionList>
        <Tabs>
          <TabPane tab="物料" key="1">
            <StandardTable
              data={{ list: formVals.TI_Z02902 }}
              rowKey="LineID"
              scroll={{ x: 2600, y: 600 }}
              columns={this.skuColumns}
            />
          </TabPane>
          <TabPane tab="常规" key="2">
            <DescriptionList style={{ marginBottom: 24 }}>
              <Description term="手机号码">{formVals.CellphoneNO}</Description>
              <Description term="联系人电话">{formVals.PhoneNO}</Description>
              <Description term="联系人邮箱">{formVals.Email}</Description>
              <Description term="地址">{`${formVals.Province}${formVals.City}${formVals.Area}${
                formVals.Street
              }${formVals.Address}`}</Description>
            </DescriptionList>
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

        <Modal
          width={640}
          destroyOnClose
          title="物料行附件"
          visible={attachmentVisible}
          onOk={() => this.handleModalVisible(false)}
          onCancel={() => this.handleModalVisible(false)}
        >
          <StandardTable
            data={{ list: prviewList }}
            rowKey="LineID"
            columns={this.attachmentColumns}
          />
        </Modal>

        <FooterToolbar>
          <Button onClick={this.toUpdate} type="primary">
            编辑
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}

export default InquiryEdit;
