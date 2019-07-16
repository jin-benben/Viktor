import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Modal, Button, Icon, message, Dropdown, Menu, Tag, Badge } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import Link from 'umi/link';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import CancelOrder from '@/components/Modal/CancelOrder';
import StandardTable from '@/components/StandardTable';
import NeedAskPrice from '../components/needAskPrice';
import PrintHistory from '@/components/Order/PrintHistory';
import SendEmail from '@/components/Order/SendEmail';
import Transfer from '@/components/Transfer';
import Attachment from '@/components/Attachment';
import MyPageHeader from '../components/pageHeader';
import TransferHistory from '@/components/TransferHistory';
import { getName } from '@/utils/utils';
import { orderSourceType, linkmanColumns, lineStatus } from '@/utils/publicData';

const { Description } = DescriptionList;
const { TabPane } = Tabs;

@connect(({ inquiryPreview, loading, global }) => ({
  inquiryPreview,
  global,
  loading: loading.effects['inquiryPreview/fetch'],
}))
class InquiryEdit extends PureComponent {
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
      dataIndex: 'LineStatus',
      align: 'center',
      width: 180,
      render: (text, record) =>
        record.lastIndex ? null : (
          <Fragment>
            {record.Closed === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                <Tag color="green">{getName(lineStatus, text)}</Tag>
                {record.PLineStatus === 'C' ? (
                  <Tag color="green">已确认</Tag>
                ) : (
                  <Tag color="gold">未确认</Tag>
                )}
                {record.IsInquiry === 'Y' ? <Tag color="green">需询价</Tag> : ''}
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
      render: (text, record) => (record.lastIndex ? '' : <span>{`${text}-${record.Unit}`}</span>),
    },
    {
      title: '价格',
      width: 80,
      dataIndex: 'Price',
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
      title: '行备注',
      width: 100,
      dataIndex: 'LineComment',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? null : (
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
      render: (text, record) =>
        record.lastIndex ? null : (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
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
      title: '要求名称',
      width: 80,
      dataIndex: 'CustomerName',
      align: 'center',
    },

    {
      title: '建议价格',
      width: 80,
      dataIndex: 'AdvisePrice',
      align: 'center',
    },
    {
      title: '要求交期',
      width: 100,
      inputType: 'date',
      dataIndex: 'DueDate',
      align: 'center',
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
      width: 150,
      dataIndex: 'TransferComment',
      render: (text, record) =>
        record.lastIndex ? null : (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
    },
    {
      title: '转移日期',
      dataIndex: 'TransferDateTime',
      width: 100,
      sorter: true,
      align: 'center',
      render: val => (
        <Ellipsis tooltip lines={1}>
          <span>{val ? moment(val).format('YYYY-MM-DD hh:mm:ss') : ''}</span>
        </Ellipsis>
      ),
    },
    {
      title: '销报单号',
      width: 100,
      dataIndex: 'QuoteEntry',
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
      width: 100,
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

  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        TI_Z02602: [],
      }, // 单据信息
      attachmentVisible: false,
      selectedRows: [],
      needmodalVisible: false,
      transferModalVisible: false, // 转移modal
      historyVisible: false,
      prviewList: [],
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

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inquiryPreview/save',
      payload: {
        inquiryDetail: {
          TI_Z02602: [],
          TI_Z02604: [],
        },
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.inquiryPreview.inquiryDetail !== prevState.formVals) {
      return {
        formVals: nextProps.inquiryPreview.inquiryDetail,
      };
    }
    return null;
  }

  prviewTransferHistory = recond => {
    this.setState({
      targetLine: recond,
      historyVisible: true,
    });
  };

  topMenu = () => {
    const { formVals } = this.state;
    return (
      <Menu>
        <Menu.Item>
          <Link target="_blank" to={`/sellabout/TI_Z029/add?BaseEntry=${formVals.DocEntry}`}>
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
          <a onClick={() => this.setState({ transferModalVisible: true })}>转移</a>
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
        type: 'inquiryPreview/fetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
          },
        },
      });
    }
  };

  // 取消单据
  cancelSubmit = ClosedComment => {
    const { dispatch } = this.props;
    const {
      formVals: { UpdateTimestamp, DocEntry },
    } = this.state;
    dispatch({
      type: 'inquiryPreview/cancel',
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
    const { formVals } = this.state;
    if (formVals.Closed !== 'Y') {
      router.push(`/sellabout/TI_Z026/TI_Z02602?DocEntry=${formVals.DocEntry}`);
    } else {
      message.warn('此单已被关闭，暂不可编辑');
    }
  };

  // 发送需询价
  submitNeedLine = () => {
    message.success('提交成功');
    this.setState({ needmodalVisible: false });
    this.getDetail();
  };

  // 确认需要采购询价
  selectNeed = () => {
    const { formVals } = this.state;
    const selectedRows = formVals.TI_Z02602.filter((item, index) => {
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

  render() {
    const {
      global: { Saler, Company, TI_Z004 },
      loading,
      location: { query },
      location,
    } = this.props;
    const {
      formVals,
      attachmentVisible,
      prviewList,
      selectedRows,
      needmodalVisible,
      transferModalVisible,
      historyVisible,
      targetLine,
    } = this.state;
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
    const needParentMethods = {
      handleSubmit: this.submitNeedLine,
      handleModalVisible: this.handleModalVisible,
    };
    const transferParentMethods = {
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Card bordered={false} loading={loading}>
        <MyPageHeader {...location} />
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="单号">{formVals.DocEntry}</Description>
          <Description term="客户">
            <Link to={`/main/TI_Z006/detail?Code=${formVals.CardCode}`}>
              {`${formVals.CardName}(${formVals.CardCode})`}
            </Link>
          </Description>
          <Description term="单据日期">{moment(formVals.DocDate).format('YYYY-MM-DD')}</Description>
          <Description term="创建日期">
            {moment(formVals.CreateDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="要求交期">{formVals.DueDate}</Description>
          <Description term="有效日期">
            {formVals.ToDate ? moment(formVals.ToDate).format('YYYY-MM-DD') : ''}
          </Description>
          <Description term="联系人">{formVals.Contacts}</Description>
          <Description term="备注">{formVals.Comment}</Description>
          <Description term="创建人">
            <span>{getName(TI_Z004, formVals.CreateUser)}</span>
          </Description>
          <Description term="交易公司">
            <span>{getName(Company, formVals.CompanyCode)}</span>
          </Description>
          <Description term="销售员">
            <span>{getName(Saler, formVals.Owner)}</span>
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
                {formVals.SDocStatus === 'C' ? (
                  <Tag color="green">已报价</Tag>
                ) : (
                  <Tag color="gold">未报价</Tag>
                )}
                {formVals.PDocStatus === 'C' ? (
                  <Tag color="green">已询价</Tag>
                ) : (
                  <Tag color="gold">未询价</Tag>
                )}
                {formVals.IsInquiry === 'Y' ? (
                  <Tag color="green">需询价</Tag>
                ) : (
                  <Tag color="gold">不询价</Tag>
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
              scroll={{ x: 3200 }}
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
          <TabPane tab="附件" key="3">
            <Attachment dataSource={formVals.TI_Z02603} iscan />
          </TabPane>
          <TabPane tab="其他推送人" key="4">
            <StandardTable
              data={{ list: formVals.TI_Z02605 }}
              rowKey="UserID"
              columns={linkmanColumns}
            />
          </TabPane>
          <TabPane tab="打印记录" key="5">
            <PrintHistory QueryType="1" QueryKey={query.DocEntry} />
          </TabPane>
          <TabPane tab="邮件发送记录" key="6">
            <SendEmail QueryType="1" QueryKey={query.DocEntry} />
          </TabPane>
        </Tabs>

        <Modal
          width={960}
          destroyOnClose
          maskClosable={false}
          title="物料行附件"
          visible={attachmentVisible}
          onOk={() => this.handleModalVisible(false)}
          onCancel={() => this.handleModalVisible(false)}
        >
          <Attachment dataSource={prviewList} iscan={false} />
        </Modal>
        <FooterToolbar>
          {formVals.Closed === 'N' ? (
            <Fragment>
              {' '}
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
        </FooterToolbar>
        <NeedAskPrice data={selectedRows} {...needParentMethods} modalVisible={needmodalVisible} />
        <Transfer
          SourceEntry={formVals.DocEntry}
          SourceType="TI_Z026"
          modalVisible={transferModalVisible}
          {...transferParentMethods}
        />
        <TransferHistory
          modalVisible={historyVisible}
          handleModalVisible={this.handleModalVisible}
          BaseEntry={targetLine.DocEntry || ''}
          BaseLineID={targetLine.LineID || ''}
        />
      </Card>
    );
  }
}

export default InquiryEdit;
