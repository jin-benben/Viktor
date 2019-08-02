import React, { Fragment, Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Button, Icon, message, Dropdown, Menu, Tag, Badge } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import Link from 'umi/link';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import StandardTable from '@/components/StandardTable';
import CancelOrder from '@/components/Modal/CancelOrder';
import OrderPrint from '@/components/Modal/OrderPrint';
import NeedAskPrice from '../components/needAskPrice';
import Emails from '@/components/Modal/Email';
import TargetLine from '@/components/TargetLine';
import Transfer from '@/components/Transfer';
import PrintHistory from '@/components/Order/PrintHistory';
import SendEmail from '@/components/Order/SendEmail';
import MyPageHeader from '../components/pageHeader';
import TransferHistory from '@/components/TransferHistory';
import OrderAttach from '@/components/Attachment/order';
import { getName } from '@/utils/utils';
import { orderSourceType, linkmanColumns, otherCostCColumns } from '@/utils/publicData';

const { Description } = DescriptionList;
const { TabPane } = Tabs;

@connect(({ SalesQuotationPreview, loading, global }) => ({
  SalesQuotationPreview,
  global,
  loading: loading.effects['SalesQuotationPreview/fetch'],
}))
class InquiryEdit extends Component {
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
      width: 140,
      dataIndex: 'LineStatus',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? null : (
          <Fragment>
            {record.Closed === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                {record.ApproveSts === 'Y' ? (
                  <Tag color="green">已审核</Tag>
                ) : (
                  <Tag color="gold">未审核</Tag>
                )}
                {text === 'C' ? <Tag color="green">已合同</Tag> : <Tag color="gold">未合同</Tag>}
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
      title: '报价交期',
      width: 100,
      dataIndex: 'DueDate',
      align: 'center',
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
      title: '重量[运费]',
      width: 100,
      dataIndex: 'Rweight',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? '' : <span>{`${text}(公斤)[${record.ForeignFreight}]`}</span>,
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
      render:text =>(
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
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
      render: text =>(
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
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
      render: text =>(
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '包装',
      width: 100,
      dataIndex: 'Package',
      align: 'center',
      render: text =>(
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '参数',
      dataIndex: 'Parameters',
      width: 100,
      align: 'center',
      render:text =>(
        <Ellipsis tooltip lines={1}>
          {text}
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
      render: text =>(
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '审核日期',
      width: 100,
      dataIndex: 'ApproveDate',
      align: 'center',
      render: val => (
        <Ellipsis tooltip lines={1}>
          {val}
        </Ellipsis>
      ),
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
      title: '销合单号',
      width: 100,
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
      width: 100,
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

  state = {
    formVals: {
      TI_Z02902: [],
      TI_Z02903: [],
      TI_Z02603Fahter: [],
    }, // 单据信息
    attachmentVisible: false,
    needmodalVisible: false,
    transferModalVisible: false,
    ApproveStsList: [],
    targetLine: {},
  };

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
    const { formVals } = this.state;
    return (
      <Menu>
        <Menu.Item>
          <Link target="_blank" to={`/sellabout/TI_Z030/add?BaseEntry=${formVals.DocEntry}`}>
            复制到销售合同
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link target="_blank" to="/sellabout/TI_Z029/add">
            新建销售报价单
          </Link>
        </Menu.Item>
        <Menu.Item>
          <a href="javacript:void(0)" onClick={this.confirmApproveSts}>
            确认销售报价
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="javacript:void(0)" onClick={this.costCheck}>
            成本核算
          </a>
        </Menu.Item>
        <Menu.Item>
          <OrderPrint BaseEntry={formVals.DocEntry} BaseType="TI_Z029" />
        </Menu.Item>
        <Menu.Item>
          <Emails BaseEntry={formVals.DocEntry} BaseType="TI_Z029" />
        </Menu.Item>
        <Menu.Item>
          <a href="javacript:void(0)" onClick={() => this.setState({ transferModalVisible: true })}>
            转移
          </a>
        </Menu.Item>
      </Menu>
    );
  };

  confirmApproveSts = () => {
    const { formVals } = this.state;
    const ApproveStsList = formVals.TI_Z02902.filter(item => item.ApproveSts === 'N');
    this.setState({ ApproveStsList, needmodalVisible: true });
  };

  lookLineAttachment = record => {
    this.setState({ attachmentVisible: true, targetLine: record });
  };

  prviewTransferHistory = recond => {
    this.setState({
      targetLine: recond,
      historyVisible: true,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      attachmentVisible: !!flag,
      needmodalVisible: !!flag,
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
        type: 'SalesQuotationPreview/fetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            this.setState({
              formVals: response.Content,
            });
          }
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
          this.getDetail();
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
      location: { query },
      location,
      loading,
    } = this.props;
    const {
      formVals,
      attachmentVisible,
      needmodalVisible,
      transferModalVisible,
      ApproveStsList,
      targetLine,
      historyVisible,
    } = this.state;

    const needParentMethods = {
      handleSubmit: this.submitNeedLine,
      handleModalVisible: this.handleModalVisible,
    };

    const transferParentMethods = {
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
      <Card bordered={false} loading={loading}>
        <MyPageHeader {...location} />
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="销售报价单号">{formVals.DocEntry}</Description>
          <Description term="客户">
            <Link to={`/main/TI_Z006/detail?Code=${formVals.CardCode}`}>
              {`${formVals.CardName}(${formVals.CardCode})`}
            </Link>
          </Description>
          <Description term="单据日期">{moment(formVals.DocDate).format('YYYY-MM-DD')}</Description>
          <Description term="创建日期">
            {moment(formVals.CreateDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="报价交期">{formVals.DueDate}</Description>
          <Description term="有效日期">
            {formVals.ToDate ? moment(formVals.ToDate).format('YYYY-MM-DD') : ''}
          </Description>
          <Description term="联系人">{formVals.Contacts}</Description>
          <Description term="备注"><span className="red">{formVals.Comment}</span></Description>
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
            <span>{getName(orderSourceType, formVals.OrderType)}</span>
          </Description>
          <Description term="客户参考号">{formVals.NumAtCard}</Description>
          <Description term="单据状态">
            {formVals.Closed === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                {formVals.DocStatus === 'C' ? (
                  <Tag color="green">已合同</Tag>
                ) : (
                  <Tag color="gold">未合同</Tag>
                )}
              </Fragment>
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
              scroll={{ x: 3400 }}
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
              columns={otherCostCColumns}
            />
          </TabPane>
          <TabPane tab="附件" key="4">
            <OrderAttach dataSource={formVals.TI_Z02603Fahter} />
          </TabPane>
          <TabPane tab="其他推送人" key="5">
            <StandardTable
              data={{ list: formVals.TI_Z02905 }}
              rowKey="UserID"
              columns={linkmanColumns}
            />
          </TabPane>
          <TabPane tab="打印记录" key="6">
            <PrintHistory QueryType="3" QueryKey={query.DocEntry} />
          </TabPane>
          <TabPane tab="邮件发送记录" key="7">
            <SendEmail QueryType="3" QueryKey={query.DocEntry} />
          </TabPane>
        </Tabs>
        <TargetLine
          attachmentVisible={attachmentVisible}
          otherCostList={targetLine.TI_Z02903}
          attachList={targetLine.TI_Z02604}
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
        <NeedAskPrice
          data={ApproveStsList}
          {...needParentMethods}
          rowKey="LineID"
          modalVisible={needmodalVisible}
        />
        <Transfer
          SourceEntry={formVals.DocEntry}
          SourceType="TI_Z029"
          modalVisible={transferModalVisible}
          {...transferParentMethods}
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
