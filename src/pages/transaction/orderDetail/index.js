import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Modal, Icon, Tag } from 'antd';
import moment from 'moment';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import Attachment from '../components/attachment';
import { getName } from '@/utils/utils';

const { Description } = DescriptionList;
const { TabPane } = Tabs;

@connect(({ orderDetail, loading, global }) => ({
  orderDetail,
  global,
  loading: loading.effects['orderDetail/fetch'],
}))
class OrderDetailPage extends PureComponent {
  skuColumns = [
    {
      title: '物料代码',
      width: 80,
      dataIndex: 'ItemCode',
    },
    {
      title: '物料名称',
      dataIndex: 'ItemName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '单位',
      width: 80,
      dataIndex: 'InvntryUom',
    },
    {
      title: '数量',
      width: 80,
      dataIndex: 'Quantity',
    },
    {
      title: '未清数量',
      dataIndex: 'OpenQty',
      width: 80,
    },
    {
      title: '含税价格',
      width: 100,
      dataIndex: 'PriceAfVAT',
    },
    {
      title: '行总计',
      width: 100,
      dataIndex: 'LineTotal',
    },
    {
      title: '行备注',
      width: 200,
      dataIndex: 'FreeTxt',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '操作',
      align: 'center',
      width: 80,
      render: (text, record, index) =>
        record.lastIndex ? null : (
          <Fragment>
            {record.ItemEnclosure.length ? (
              <Icon
                title="预览"
                type="eye"
                onClick={() => this.lookLineAttachment(record, index)}
                style={{ color: '#08c', marginRight: 5 }}
              />
            ) : (
              <span />
            )}
          </Fragment>
        ),
    },
  ];

  comColumns = [
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '发货状态',
      dataIndex: 'U_DeliverSts',
      width: 80,
      render: text =>
        text === 'Y' ? <Tag color="green">已发货</Tag> : <Tag color="gold">未发货</Tag>,
    },
    {
      title: '发货人',
      dataIndex: 'U_DeliverUser',
      width: 80,
    },
    {
      title: '发货时间',
      dataIndex: 'U_DeliverDate',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '快递单号',
      dataIndex: 'U_ExpressNumber',
      width: 100,
    },
    {
      title: '运输类型',
      dataIndex: 'TrnspCode',
      width: 100,
      render: text => {
        const {
          global: { Trnsp },
        } = this.props;
        return <span>{getName(Trnsp, text)}</span>;
      },
    },
  ];

  Columns1 = [
    {
      title: '单据类型',
      dataIndex: 'ObjType',
      width: 80,
      render: val => <span>{val === '15' ? '交货单' : '退货单'}</span>,
    },
    ...this.comColumns,
  ];

  Columns2 = [
    {
      title: '单据类型',
      dataIndex: 'ObjType',
      width: 80,
      render: val => <span>{val === '13' ? '发票' : '贷项'}</span>,
    },
    ...this.comColumns,
  ];

  Columns3 = [
    {
      title: '单据类型',
      dataIndex: 'ObjType',
      width: 80,
      render: val => <span>{val === '24' ? '收款' : '付款'}</span>,
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '转帐金额',
      width: 100,
      dataIndex: 'TrsfrSum',
    },
    {
      title: '记账名称',
      width: 200,
      dataIndex: 'AcctName',
    },

    {
      title: '备注',
      width: 200,
      dataIndex: 'Comments',
    },
    {
      title: '单据总计',
      width: 100,
      dataIndex: 'DocTotal',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
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
          CodeList: ['Saler', 'Company', 'TI_Z004', 'Trnsp'],
        },
      },
    });
    this.getDetail();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/save',
      payload: {
        orderDetailInfo: {
          DocEntry: '',
        },
      },
    });
  }

  lookLineAttachment = record => {
    this.setState({ attachmentVisible: true, prviewList: [...record.ItemEnclosure] });
  };

  handleModalVisible = flag => {
    this.setState({
      attachmentVisible: !!flag,
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
        type: 'orderDetail/fetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
          },
        },
      });
    }
  };

  render() {
    const {
      global: { Saler, Company },
      orderDetail: { orderDetailInfo },
      loading,
    } = this.props;
    const { attachmentVisible, prviewList } = this.state;
    let newdata = [];
    if (orderDetailInfo.DocEntry) {
      newdata = orderDetailInfo.RDR1.map((item, index) => {
        const newItem = item;
        newItem.key += index;
        return newItem;
      });
    }
    if (newdata.length > 0) {
      newdata.push({
        key: newdata[newdata.length - 1].key + 1,
        lastIndex: true,
        LineTotal: orderDetailInfo.DocTotal,
      });
    }

    return (
      <Card bordered={false} loading={loading}>
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="单号">{orderDetailInfo.DocEntry}</Description>
          <Description term="客户">
            {`${orderDetailInfo.CardName}(${orderDetailInfo.CardCode})`}
          </Description>
          <Description term="单据日期">
            {moment(orderDetailInfo.DocDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="交易公司">
            <span>{getName(Company, orderDetailInfo.U_CompanyCode)}</span>
          </Description>
          <Description term="销售员">
            <span>{getName(Saler, orderDetailInfo.SlpCode)}</span>
          </Description>
          <Description term="发货地址">
            {`${orderDetailInfo.ShipToCode}${orderDetailInfo.Address2}`}
          </Description>
          <Description term="客户参考号">{orderDetailInfo.NumAtCard}</Description>
          <Description term="备注">
            <span className="red">{orderDetailInfo.Comments}</span>
          </Description>
          <Description term="单据总计">{orderDetailInfo.DocTotal}</Description>
          <Description term="合同号">{orderDetailInfo.U_ContractEntry}</Description>
          <Description term="联系人">
            {orderDetailInfo.Contacts}-{orderDetailInfo.Cellolar}
          </Description>
          <Description term="客户参考号">{orderDetailInfo.NumAtCard}</Description>
          <Description term="单据状态">
            {orderDetailInfo.CANCELED === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                {orderDetailInfo.DocStatus === 'O' ? (
                  <Tag color="gold">未清</Tag>
                ) : (
                  <Tag color="green">已清</Tag>
                )}
              </Fragment>
            )}
          </Description>
        </DescriptionList>
        <Tabs>
          <TabPane tab="物料" key="1">
            <StandardTable
              data={{ list: newdata }}
              scroll={{ x: 1000 }}
              rowKey="key"
              columns={this.skuColumns}
            />
          </TabPane>
          <TabPane tab="附件" key="3">
            <Attachment dataSource={orderDetailInfo.DocEnclosure} iscan />
          </TabPane>
          <TabPane tab="交退货单" key="4">
            <StandardTable
              data={{ list: orderDetailInfo.ODLNORDN }}
              scroll={{ x: 1000 }}
              rowKey="key"
              columns={this.Columns1}
            />
          </TabPane>
          <TabPane tab="发票贷项" key="5">
            <StandardTable
              data={{ list: orderDetailInfo.OINVORIN }}
              scroll={{ x: 1000 }}
              rowKey="key"
              columns={this.Columns2}
            />
          </TabPane>
          <TabPane tab="收款单" key="6">
            <StandardTable
              data={{ list: orderDetailInfo.ORCTOVPM }}
              scroll={{ x: 1000 }}
              rowKey="key"
              columns={this.Columns3}
            />
          </TabPane>
        </Tabs>
        <Modal
          width={960}
          maskClosable={false}
          destroyOnClose
          title="物料行附件"
          visible={attachmentVisible}
          onOk={() => this.handleModalVisible(false)}
          onCancel={() => this.handleModalVisible(false)}
        >
          <Attachment dataSource={prviewList} />
        </Modal>
      </Card>
    );
  }
}

export default OrderDetailPage;
