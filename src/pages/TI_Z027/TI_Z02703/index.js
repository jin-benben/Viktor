import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Modal, Button, Icon, message, Dropdown, Menu, Tag, Badge } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import Link from 'umi/link';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import StandardTable from '@/components/StandardTable';
import CancelOrder from '@/components/Modal/CancelOrder';
import Emails from '@/components/Modal/Email';
import Transfer from '@/components/Transfer';
import OrderPrint from '@/components/Modal/OrderPrint';
import PrintHistory from '@/components/Order/PrintHistory';
import SendEmail from '@/components/Order/SendEmail';
import MyPageHeader from '../components/pageHeader';
import TransferHistory from '@/components/TransferHistory';
import OrderAttach from '@/components/Attachment/order';
import AttachmentModal from '@/components/Attachment/modal';
import { getName } from '@/utils/utils';
import { baseType } from '@/utils/publicData';

const { Description } = DescriptionList;
const { TabPane } = Tabs;

@connect(({ supplierAskPreview, loading, global }) => ({
  supplierAskPreview,
  global,
  loading: loading.models.supplierAskPreview,
}))
class InquiryEdit extends React.Component {
  skuColumns = [
    {
      title: '行号',
      dataIndex: 'LineID',
      fixed: 'left',
      width: 50,
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? <span style={{ fontWeight: 'bolder' }}>合计</span> : text,
    },
    {
      title: '行状态',
      width: 150,
      dataIndex: 'LineStatus',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? null : (
          <Fragment>
            {record.Closed === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                {record.PriceRStatus === 'C' ? (
                  <Tag color="green">已确认</Tag>
                ) : (
                  <Tag color="gold">未确认</Tag>
                )}
                {text === 'C' ? <Tag color="green">已报价</Tag> : <Tag color="gold">未报价</Tag>}
              </Fragment>
            )}
          </Fragment>
        ),
    },
    {
      title: '物料',
      dataIndex: 'SKU',
      align: 'center',
      width: 100,
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
      title: '名称(外)',
      width: 100,
      dataIndex: 'ForeignName',
      render: (text, record) =>
        record.lastIndex ? null : (
          <Ellipsis tooltip lines={1}>
            {text}-{record.ForeignParameters}
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
      title: '价格',
      width: 100,
      dataIndex: 'Price',
      align: 'center',
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
      title: '询价交期',
      width: 120,
      dataIndex: 'InquiryDueDate',
      align: 'center',
    },
    {
      title: '行备注',
      dataIndex: 'LineComment',
      width: 100,
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },

    {
      title: '销行备注',
      dataIndex: 'BaseLineComment',
      width: 100,
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '采总计',
      width: 120,
      align: 'center',
      dataIndex: 'LineTotal',
    },
    {
      title: '本币总计',
      width: 100,
      align: 'center',
      dataIndex: 'InquiryLineTotalLocal',
    },
    {
      title: '销售员',
      width: 120,
      dataIndex: 'Saler',
      align: 'center',
      render: text => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, text)}</span>;
      },
    },
    {
      title: '要求交期',
      width: 100,
      dataIndex: 'DueDate',
      align: 'center',
    },
    {
      title: '客询价单',
      width: 80,
      dataIndex: 'BaseEntry',
      align: 'center',
      render: (val, record) =>
        record.lastIndex ? null : (
          <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${record.BaseEntry}`}>
            {`${val}-${record.BaseLineID}`}
          </Link>
        ),
    },
    {
      title: '上一次价格',
      width: 100,
      dataIndex: 'LastPrice',
      align: 'center',
    },
    {
      title: '转移单号',
      width: 100,
      dataIndex: 'TransferEntry',
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 80,
      render: (text, record, index) =>
        record.lastIndex ? null : (
          <Fragment>
            {record.TI_Z02604.length ? (
              <a onClick={() => this.lookLineAttachment(record, index)}>
                <Badge count={record.TI_Z02604.length} title="查看附件" className="attachBadge" />
              </a>
            ) : (
              ''
            )}
            <a onClick={() => this.prviewTransferHistory(record)}>
              <Icon title="查看转移记录" type="history" style={{ color: '#08c', marginLeft: 5 }} />
            </a>
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
      width: 100,
      dataIndex: 'BaseType',
      render: text => <span>{getName(baseType, text)}</span>,
    },
    {
      title: '来源单号',
      align: 'center',
      width: 100,
      dataIndex: 'BaseEntry',
    },
    {
      title: '附件代码',
      align: 'center',
      width: 200,
      dataIndex: 'AttachmentCode',
      render: text => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>,
    },
    {
      title: '附件描述',
      align: 'center',
      width: 100,
      dataIndex: 'AttachmentName',
    },
    {
      title: '附件路径',
      align: 'center',
      width: 200,
      dataIndex: 'AttachmentPath',
      render: text => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>,
    },

    {
      title: '操作',
      width: 100,
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
      supplierAskDetail: {
        TI_Z02702: [],
        TI_Z02703: [],
        TI_Z02603Fahter: [],
      }, // 单据信息
      attachmentVisible: false,
      transferModalVisible: false,
      historyVisible: false,
      targetLine: {},
      prviewList: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Purchaser', 'Curr', 'TI_Z004', 'TI_Z042', 'WhsCode', 'Company'],
        },
      },
    });
    this.getDetail();
  }

  prviewTransferHistory = recond => {
    this.setState({
      targetLine: recond,
      historyVisible: true,
    });
  };

  topMenu = () => {
    const { supplierAskDetail } = this.state;
    return (
      <Menu>
        <Menu.Item>
          <Link target="_blank" to="/purchase/TI_Z027/edit">
            新建采购询价单
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link
            target="_blank"
            to={`/purchase/TI_Z028/TI_Z02801?PInquiryEntry=${supplierAskDetail.DocEntry}`}
          >
            添加到询价确认单
          </Link>
        </Menu.Item>

        <Menu.Item>
          <OrderPrint BaseEntry={supplierAskDetail.DocEntry} BaseType="TI_Z027" />
        </Menu.Item>
        <Menu.Item>
          <Emails BaseEntry={supplierAskDetail.DocEntry} BaseType="TI_Z027" />
        </Menu.Item>
        <Menu.Item>
          <a href="javacript:void(0)" onClick={() => this.setState({ transferModalVisible: true })}>
            转移
          </a>
        </Menu.Item>
      </Menu>
    );
  };

  lookLineAttachment = record => {
    this.setState({ attachmentVisible: true, prviewList: [...record.TI_Z02604] });
  };

  handleModalVisible = flag => {
    this.setState({
      attachmentVisible: !!flag,
      transferModalVisible: !!flag,
      historyVisible: !!flag,
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
        type: 'supplierAskPreview/fetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            this.setState({
              supplierAskDetail: response.Content,
            });
          }
        },
      });
    }
  };

  // 取消单据

  cancelSubmit = ClosedComment => {
    const { dispatch } = this.props;
    const {
      supplierAskDetail: { DocEntry, UpdateTimestamp },
    } = this.state;
    dispatch({
      type: 'supplierAskPreview/cancel',
      payload: {
        Content: {
          DocEntry,
          ClosedComment,
          UpdateTimestamp,
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

  toUpdate = () => {
    const { supplierAskDetail } = this.state;
    if (supplierAskDetail.Closed !== 'Y') {
      router.push(`/purchase/TI_Z027/update?DocEntry=${supplierAskDetail.DocEntry}`);
    } else {
      message.warn('此单已被关闭，暂不可编辑');
    }
  };

  render() {
    const {
      global: { TI_Z004, Company, Curr, Purchaser },
      location: { query },
      location,
    } = this.props;
    const {
      supplierAskDetail,
      attachmentVisible,
      prviewList,
      transferModalVisible,
      historyVisible,
      targetLine,
    } = this.state;

    const newdata = [...supplierAskDetail.TI_Z02702];
    if (newdata.length > 0) {
      newdata.push({
        LineID: newdata[newdata.length - 1].LineID + 1,
        lastIndex: true,
        LineTotal: supplierAskDetail.InquiryDocTotal,
        InquiryLineTotalLocal: supplierAskDetail.InquiryDocTotalLocal,
      });
    }

    return (
      <Card bordered={false}>
        <MyPageHeader {...location} />
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="单号">{supplierAskDetail.DocEntry}</Description>
          <Description term="供应商">
            <Link to={`/main/TI_Z007/detail?Code=${supplierAskDetail.CardCode}`}>
              {`${supplierAskDetail.CardName}(${supplierAskDetail.CardCode})`}
            </Link>
          </Description>
          <Description term="单据日期">
            {moment(supplierAskDetail.DocDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="创建日期">
            {moment(supplierAskDetail.CreateDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="有效日期">
            {supplierAskDetail.ToDate ? moment(supplierAskDetail.ToDate).format('YYYY-MM-DD') : ''}
          </Description>
          <Description term="联系人">{supplierAskDetail.Contacts}</Description>
          <Description term="备注">{supplierAskDetail.Comment}</Description>
          <Description term="创建人">
            <span>{getName(TI_Z004, supplierAskDetail.CreateUser)}</span>
          </Description>
          <Description term="采购">
            <span>{getName(Purchaser, supplierAskDetail.Owner)}</span>
          </Description>
          <Description term="交易公司">
            <span>{getName(Company, supplierAskDetail.CompanyCode)}</span>
          </Description>

          <Description term="交易币种">
            <span>{getName(Curr, supplierAskDetail.Currency)}</span>
          </Description>
          <Description term="单据汇率">{supplierAskDetail.DocRate}</Description>
          <Description term="客户参考号">{supplierAskDetail.NumAtCard}</Description>
          <Description term="单据状态">
            {supplierAskDetail.Closed === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                {supplierAskDetail.DocStatus === 'C' ? (
                  <Tag color="green">已报价</Tag>
                ) : (
                  <Tag color="gold">未报价</Tag>
                )}
                {supplierAskDetail.SendEmailStatus === 'C' ? (
                  <Tag color="green">已发送</Tag>
                ) : (
                  <Tag color="gold">未发送</Tag>
                )}
              </Fragment>
            )}
          </Description>
          {supplierAskDetail.Closed === 'N' ? null : (
            <Fragment>
              <Description term="关闭原因">{supplierAskDetail.ClosedComment}</Description>
              <Description term="关闭人">{supplierAskDetail.ClosedBy}</Description>
            </Fragment>
          )}
        </DescriptionList>
        <Tabs>
          <TabPane tab="物料" key="1">
            <StandardTable
              data={{ list: newdata }}
              rowKey="LineID"
              scroll={{ x: 1900 }}
              columns={this.skuColumns}
            />
          </TabPane>
          <TabPane tab="常规" key="2">
            <DescriptionList style={{ marginBottom: 24 }}>
              <Description term="手机号码">{supplierAskDetail.CellphoneNO}</Description>
              <Description term="联系人电话">{supplierAskDetail.PhoneNO}</Description>
              <Description term="联系人邮箱">{supplierAskDetail.Email}</Description>
            </DescriptionList>
          </TabPane>
          <TabPane tab="附件" key="3">
            <OrderAttach dataSource={supplierAskDetail.TI_Z02603Fahter} />
          </TabPane>
          <TabPane tab="打印记录" key="4">
            <PrintHistory QueryType="2" QueryKey={query.DocEntry} />
          </TabPane>
          <TabPane tab="邮件发送记录" key="5">
            <SendEmail QueryType="2" QueryKey={query.DocEntry} />
          </TabPane>
        </Tabs>
        <AttachmentModal
          attachmentVisible={attachmentVisible}
          prviewList={prviewList}
          handleModalVisible={this.handleModalVisible}
        />
        <FooterToolbar>
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
        </FooterToolbar>
        <Transfer
          SourceEntry={supplierAskDetail.DocEntry}
          SourceType="TI_Z027"
          modalVisible={transferModalVisible}
          handleModalVisible={this.handleModalVisible}
        />
        <TransferHistory
          modalVisible={historyVisible}
          handleModalVisible={this.handleModalVisible}
          BaseEntry={targetLine.BaseEntry || ''}
          BaseLineID={targetLine.BaseLineID || ''}
        />
      </Card>
    );
  }
}

export default InquiryEdit;
