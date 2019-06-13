import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Modal, Button, Icon, message } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import StandardTable from '@/components/StandardTable';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import MyTag from '@/components/Tag';
import CancelOrder from '@/components/Modal/CancelOrder';
import OrderPrint from '@/components/Modal/OrderPrint';
import NeedAskPrice from '../components/needAskPrice';
import Emails from '@/components/Modal/Email';
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
      title: '价格',
      width: 100,
      dataIndex: 'Price',
      align: 'center',
    },
    {
      title: '行总计',
      width: 120,
      align: 'center',
      dataIndex: 'LineTotal',
      render: (text, record) =>
        record.lastIndex ? <span style={{ fontWeight: 'bolder' }}>{text}</span> : text,
    },
    {
      title: '建议价',
      width: 100,
      dataIndex: 'AdvisePrice',
      align: 'center',
    },
    {
      title: '要求交期',
      width: 100,
      inputType: 'date',
      dataIndex: 'DueDate',
      align: 'center',
      render: (val, record) =>
        record.lastIndex ? '' : <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '仓库',
      width: 100,
      dataIndex: 'WhsCode',
      align: 'center',
      render: (text, record) => {
        const {
          global: { WhsCode },
        } = this.props;
        return record.lastIndex ? '' : <span>{getName(WhsCode, text)}</span>;
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
      render: (text, record) => {
        const {
          global: { Curr },
        } = this.props;
        return record.lastIndex ? '' : <span>{getName(Curr, text)}</span>;
      },
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
      render: (val, record) =>
        record.lastIndex ? '' : <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '采购员',
      width: 80,
      dataIndex: 'Purchaser',
      align: 'center',
      render: (text, record) => {
        const {
          global: { Purchaser },
        } = this.props;
        return record.lastIndex ? '' : <span>{getName(Purchaser, text)}</span>;
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
      render: (text, record) =>
        record.lastIndex ? <span style={{ fontWeight: 'bolder' }}>{text}</span> : text,
    },
    {
      title: '询价行总计(本币)',
      width: 150,
      align: 'center',
      dataIndex: 'InquiryLineTotalLocal',
      render: (text, record) =>
        record.lastIndex ? <span style={{ fontWeight: 'bolder' }}>{text}</span> : text,
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
      needmodalVisible: false,
      prviewList: [],
    };
  }

  componentDidMount() {
    const {
      dispatch,
      global: { Curr },
    } = this.props;
    if (!Curr.length) {
      dispatch({
        type: 'global/getMDMCommonality',
        payload: {
          Content: {
            CodeList: ['Saler', 'Purchaser', 'TI_Z004', 'Curr', 'WhsCode', 'Company'],
          },
        },
      });
    }
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
    this.setState({
      attachmentVisible: !!flag,
      needmodalVisible: !!flag,
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

  // 取消单据
  cancelSubmit = ClosedComment => {
    const { dispatch } = this.props;
    const {
      formVals: { UpdateTimestamp, DocEntry },
    } = this.state;
    dispatch({
      type: 'SalesQuotationPreview/cancel',
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
          this.getDetail();
        }
      },
    });
  };

  // 发送需询价
  submitNeedLine = select => {
    const { dispatch } = this.props;
    const { formVals } = this.state;
    // eslint-disable-next-line camelcase
    const TI_Z02908RequestItem = select.map(item => ({
      DocEntry: item.DocEntry,
      LineID: item.LineID,
      UpdateTimestamp: formVals.UpdateTimestamp,
    }));
    dispatch({
      type: 'SalesQuotationPreview/confirm',
      payload: {
        Content: {
          TI_Z02908RequestItem,
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

  // 成本核算
  costCheck = () => {
    const { dispatch } = this.props;
    const {
      formVals: { DocEntry, UpdateTimestamp },
    } = this.state;
    dispatch({
      type: 'SalesQuotationPreview/costCheck',
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

  render() {
    const {
      global: { TI_Z004, Saler, Company },
    } = this.props;
    const { formVals, attachmentVisible, prviewList, needmodalVisible } = this.state;

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
      });
    }
    return (
      <Card bordered={false}>
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
            <span>{getName(TI_Z004, formVals.CreateUser)}</span>
          </Description>
          <Description term="销售">
            <span>{getName(Saler, formVals.Owner)}</span>
          </Description>
          <Description term="交易公司">
            <span>{getName(Company, formVals.CompanyCode)}</span>
          </Description>
          <Description term="订单类型">{formVals.OrderType === '1' ? '正常订单' : ''}</Description>
          <Description term="来源类型">
            <span>{getName(OrderSource, formVals.OrderType)}</span>
          </Description>
          <Description term="客户参考号">{formVals.NumAtCard}</Description>
          <Description term="单据状态">
            {formVals.Closed === 'Y' ? (
              <MyTag type="关闭" value="Y" />
            ) : (
              <MyTag type="确认" value={formVals.DocStatus} />
            )}
          </Description>
          {formVals.Closed === 'N' ? null : (
            <Fragment>
              <Description term="关闭原因">{formVals.ClosedComment}</Description>
              <Description term="关闭人">{formVals.ClosedBy}</Description>
            </Fragment>
          )}
        </DescriptionList>
        <Tabs>
          <TabPane tab="物料" key="1">
            <StandardTable
              data={{ list: newdata }}
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
              <Description term="地址">
                {`${formVals.Province}${formVals.City}${formVals.Area}${formVals.Address}`}
              </Description>
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
          <TabPane tab="其他推送人" key="5">
            <StandardTable
              data={{ list: formVals.TI_Z02905 }}
              rowKey="UserID"
              columns={this.linkmanColumns}
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
          <CancelOrder cancelSubmit={this.cancelSubmit} />
          <Button
            icon="plus"
            style={{ marginLeft: 8 }}
            type="primary"
            onClick={() => router.push('/sellabout/TI_Z029/add')}
          >
            新建
          </Button>
          <Button onClick={this.toUpdate} type="primary">
            编辑
          </Button>
          <Button type="primary" onClick={this.costCheck}>
            成本核算
          </Button>
          <Button onClick={() => this.setState({ needmodalVisible: true })} type="primary">
            确认销售报价
          </Button>
          <Button
            type="primary"
            onClick={() => router.push(`/sellabout/TI_Z030/add?BaseEntry=${formVals.DocEntry}`)}
          >
            复制到销售合同
          </Button>
          <NeedAskPrice
            data={formVals.TI_Z02902}
            {...needParentMethods}
            rowKey="LineID"
            modalVisible={needmodalVisible}
          />
          <OrderPrint BaseEntry={formVals.DocEntry} BaseType="TI_Z029" />
          <Emails BaseEntry={formVals.DocEntry} BaseType="TI_Z029" />
        </FooterToolbar>
      </Card>
    );
  }
}

export default InquiryEdit;
