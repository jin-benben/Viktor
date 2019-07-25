import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Button, Icon, message, Dropdown, Menu, Tag, Badge } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import Link from 'umi/link';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import CancelOrder from '@/components/Modal/CancelOrder';
import NeedAskPrice from '../components/needAskPrice';
import OrderPrint from '@/components/Modal/OrderPrint';
import TargetLine from '@/components/TargetLine';
import Emails from '@/components/Modal/Email';
import PrintHistory from '@/components/Order/PrintHistory';
import SendEmail from '@/components/Order/SendEmail';
import MyPageHeader from '../components/pageHeader';
import OrderAttach from '@/components/Attachment/order';
import { getName } from '@/utils/utils';
import { orderSourceType, linkmanColumns, otherCostCColumns } from '@/utils/publicData';

const { Description } = DescriptionList;
const { TabPane } = Tabs;

@connect(({ agreementPreview, loading, global }) => ({
  agreementPreview,
  global,
  loading: loading.models.agreementPreview,
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
                {text === 'C' ? <Tag color="green">已订单</Tag> : <Tag color="gold">未订单</Tag>}
              </Fragment>
            )}
          </Fragment>
        ),
    },
    {
      title: '物料',
      dataIndex: 'SKU',
      align: 'center',
      width: 300,
      render: (text, record) =>
        record.lastIndex ? (
          ''
        ) : (
          <Ellipsis tooltip lines={1}>
            {text ? (
              <Link target="_blank" to={`/main/product/TI_Z009/TI_Z00903?Code${text}`}>
                {text}-
              </Link>
            ) : (
              ''
            )}
            {record.SKUName}
          </Ellipsis>
        ),
    },
    {
      title: '数量',
      width: 100,
      dataIndex: 'Quantity',
      align: 'center',
      render: (text, record) => (record.lastIndex ? '' : <span>{`${text}(${record.Unit})`}</span>),
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
      dataIndex: 'Price',
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
      title: '订单交期',
      width: 100,
      dataIndex: 'DueDate',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? null : <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>,
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
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {`${text || ''}${
            record.Currency ? `(${record.Currency})` : ''
          }-${record.InquiryLineTotalLocal || ''}`}
        </Ellipsis>
      ),
    },
    {
      title: '重量[运费]',
      width: 100,
      dataIndex: 'Rweight',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? '' : <span>{`${text}(公斤)[${record.ForeignFreight}]`}</span>,
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
      width: 80,
      dataIndex: 'ManLocation',
      align: 'center',
      render: (text, record) => {
        const {
          global: { TI_Z042 },
        } = this.props;
        return record.lastIndex ? null : <span>{getName(TI_Z042, text)}</span>;
      },
    },
    {
      title: 'HS编码',
      width: 100,
      dataIndex: 'HSCode',
      render: (text, record) => {
        const {
          global: { HS },
        } = this.props;
        return record.lastIndex ? null : (
          <Ellipsis tooltip lines={1}>
            {getName(HS, text)}
          </Ellipsis>
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
      title: '备注',
      dataIndex: 'LineComment',
      width: 100,
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? null : (
          <Ellipsis tooltip lines={1}>
            {text} {record.ForeignParameters}
          </Ellipsis>
        ),
    },
    {
      title: '包装',
      width: 100,
      dataIndex: 'Package',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? null : (
          <Ellipsis tooltip lines={1}>
            {text} {record.ForeignParameters}
          </Ellipsis>
        ),
    },
    {
      title: '名称(外)',
      dataIndex: 'ForeignName',
      width: 100,
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? null : (
          <Ellipsis tooltip lines={1}>
            {text} {record.ForeignParameters}
          </Ellipsis>
        ),
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
        return record.lastIndex ? null : <span>{getName(WhsCode, text)}</span>;
      },
    },
    {
      title: '要求名称',
      width: 80,
      dataIndex: 'CustomerName',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? null : (
          <Ellipsis tooltip lines={1}>
            {text} {record.ForeignParameters}
          </Ellipsis>
        ),
    },
    {
      title: '报价交期',
      width: 120,
      dataIndex: 'DueDateComment',
      align: 'center',
    },
    {
      title: '客询价单',
      width: 80,
      dataIndex: 'BaseEntry',
      render: (val, record) =>
        record.lastIndex ? null : (
          <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${record.BaseEntry}`}>
            {`${val}-${record.BaseLineID}`}
          </Link>
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
      render: (text, record, index) =>
        record.lastIndex ? null : (
          <Fragment>
            <Badge count={record.TI_Z02604.length} showZero className="attachBadge">
              <Icon
                title="预览"
                type="eye"
                onClick={() => this.lookLineAttachment(record, index)}
                style={{ color: '#08c', marginRight: 5 }}
              />
            </Badge>
          </Fragment>
        ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      agreementDetail: {
        TI_Z03002: [],
        TI_Z03003: [],
        TI_Z02603Fahter: [],
      }, // 单据信息
      attachmentVisible: false,
      needmodalVisible: false,
      targetLine: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: [
            'Saler',
            'Purchaser',
            'TI_Z004',
            'TI_Z042',
            'HS',
            'Curr',
            'WhsCode',
            'Company',
          ],
        },
      },
    });
    this.getDetail();
  }

  topMenu = () => {
    const { agreementDetail } = this.state;
    return (
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
        <Menu.Item>
          <OrderPrint BaseEntry={agreementDetail.DocEntry} BaseType="TI_Z030" />
        </Menu.Item>
        <Menu.Item>
          <Emails BaseEntry={agreementDetail.DocEntry} BaseType="TI_Z030" />
        </Menu.Item>
      </Menu>
    );
  };

  // 取消单据
  cancelSubmit = ClosedComment => {
    const { dispatch } = this.props;
    const {
      agreementDetail: { UpdateTimestamp, DocEntry },
    } = this.state;
    dispatch({
      type: 'agreementPreview/cancel',
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

  lookLineAttachment = record => {
    this.setState({ attachmentVisible: true, targetLine: record });
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
        type: 'agreementPreview/fetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            const { InquiryDocTotal, InquiryDocTotalLocal, DocTotal, TI_Z03002 } = response.Content;
            if (TI_Z03002.length > 0) {
              TI_Z03002.push({
                LineID: TI_Z03002[TI_Z03002.length - 1].LineID + 1,
                lastIndex: true,
                InquiryLineTotal: InquiryDocTotal,
                InquiryLineTotalLocal: InquiryDocTotalLocal,
                LineTotal: DocTotal,
              });
            }
            this.setState({
              agreementDetail: response.Content,
            });
          }
        },
      });
    }
  };

  toUpdate = () => {
    const { agreementDetail } = this.state;
    router.push(`/sellabout/TI_Z030/update?DocEntry=${agreementDetail.DocEntry}`);
  };

  // 发送需询价
  submitNeedLine = () => {
    const {
      dispatch,
      global: { currentUser },
    } = this.props;
    const {
      agreementDetail: { UpdateTimestamp, DocEntry },
    } = this.state;
    dispatch({
      type: 'agreementPreview/confirm',
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
      agreementDetail: { DocEntry, UpdateTimestamp },
    } = this.state;
    dispatch({
      type: 'agreementPreview/costCheck',
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
      global: { Saler, Company, TI_Z004 },
      location: { query },
      loading,
      location,
    } = this.props;
    const { agreementDetail, attachmentVisible, targetLine, needmodalVisible } = this.state;

    const needParentMethods = {
      handleSubmit: this.submitNeedLine,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Card bordered={false} loading={loading}>
        <MyPageHeader {...location} />
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="销售合同单号">{agreementDetail.DocEntry}</Description>
          <Description term="客户">
            <Link to={`/main/TI_Z006/detail?Code=${agreementDetail.CardCode}`}>
              {`${agreementDetail.CardName}(${agreementDetail.CardCode})`}
            </Link>
          </Description>
          <Description term="单据日期">
            {moment(agreementDetail.DocDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="创建日期">
            {moment(agreementDetail.CreateDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="订单交期">
            {agreementDetail.DueDate ? moment(agreementDetail.DueDate).format('YYYY-MM-DD') : ''}
          </Description>
          <Description term="有效日期">
            {agreementDetail.ToDate ? moment(agreementDetail.ToDate).format('YYYY-MM-DD') : ''}
          </Description>
          <Description term="联系人">{agreementDetail.Contacts}</Description>
          <Description term="备注">{agreementDetail.Comment}</Description>
          <Description term="创建人">
            <span>{getName(TI_Z004, agreementDetail.CreateUser)}</span>
          </Description>
          <Description term="销售">
            <span>{getName(Saler, agreementDetail.Owner)}</span>
          </Description>
          <Description term="交易公司">
            <span>{getName(Company, agreementDetail.CompanyCode)}</span>
          </Description>
          <Description term="订单类型">
            {agreementDetail.OrderType === '1' ? '正常订单' : ''}
          </Description>
          <Description term="来源类型">
            <span>{getName(orderSourceType, agreementDetail.OrderType)}</span>
          </Description>
          <Description term="客户参考号">{agreementDetail.NumAtCard}</Description>
          <Description term="单据状态">
            {agreementDetail.Closed === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                {agreementDetail.ApproveSts === 'Y' ? (
                  <Tag color="green">已审核</Tag>
                ) : (
                  <Tag color="gold">未审核</Tag>
                )}
                {agreementDetail.DocStatus === 'C' ? (
                  <Tag color="green">已订单</Tag>
                ) : (
                  <Tag color="gold">未订单</Tag>
                )}
              </Fragment>
            )}
          </Description>
          {agreementDetail.Closed === 'N' ? null : (
            <Fragment>
              <Description term="关闭原因">{agreementDetail.ClosedComment}</Description>
              <Description term="关闭人">{agreementDetail.ClosedBy}</Description>
            </Fragment>
          )}
        </DescriptionList>
        <Tabs>
          <TabPane tab="物料" key="1">
            <StandardTable
              data={{ list: agreementDetail.TI_Z03002 }}
              rowKey="LineID"
              scroll={{ x: 3200 }}
              columns={this.skuColumns}
            />
          </TabPane>
          <TabPane tab="常规" key="2">
            <DescriptionList style={{ marginBottom: 24 }}>
              <Description term="手机号码">{agreementDetail.CellphoneNO}</Description>
              <Description term="联系人电话">{agreementDetail.PhoneNO}</Description>
              <Description term="联系人邮箱">{agreementDetail.Email}</Description>
              <Description term="地址">
                {`${agreementDetail.Province}${agreementDetail.City}${agreementDetail.Area}${
                  agreementDetail.Address
                }`}
              </Description>
            </DescriptionList>
          </TabPane>
          <TabPane tab="其余成本" key="3">
            <StandardTable
              data={{ list: agreementDetail.TI_Z03004 }}
              rowKey="LineID"
              columns={otherCostCColumns}
            />
          </TabPane>
          <TabPane tab="附件" key="4">
            <OrderAttach dataSource={agreementDetail.TI_Z02603Fahter} />
          </TabPane>
          <TabPane tab="其他推送人" key="5">
            <StandardTable
              data={{ list: agreementDetail.TI_Z03005 }}
              rowKey="UserID"
              columns={linkmanColumns}
            />
          </TabPane>
          <TabPane tab="打印记录" key="6">
            <PrintHistory QueryType="4" QueryKey={query.DocEntry} />
          </TabPane>
          <TabPane tab="邮件发送记录" key="7">
            <SendEmail QueryType="4" QueryKey={query.DocEntry} />
          </TabPane>
        </Tabs>
        <TargetLine
          attachmentVisible={attachmentVisible}
          otherCostList={targetLine.TI_Z03003}
          attachList={targetLine.TI_Z02604}
          handleModalVisible={this.handleModalVisible}
        />
        <FooterToolbar>
          {agreementDetail.Closed !== 'Y' ? (
            <Fragment>
              <CancelOrder cancelSubmit={this.cancelSubmit} />
              <Button onClick={this.toUpdate} type="primary">
                编辑
              </Button>
              <Dropdown overlay={this.topMenu} placement="topCenter">
                <Button type="primary">
                  更多
                  <Icon type="ellipsis" />
                </Button>
              </Dropdown>
            </Fragment>
          ) : (
            ''
          )}

          <NeedAskPrice
            data={agreementDetail.TI_Z03002}
            {...needParentMethods}
            modalVisible={needmodalVisible}
          />
        </FooterToolbar>
      </Card>
    );
  }
}

export default InquiryEdit;
