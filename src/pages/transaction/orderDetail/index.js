import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Modal, Icon, Tag } from 'antd';
import moment from 'moment';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import MyTag from '@/components/Tag';
import Attachment from '@/components/Attachment/other';
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
      width: 200,
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
          CodeList: ['Saler', 'Company'],
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
          <Description term="备注">{orderDetailInfo.Comments}</Description>
          <Description term="单据总计">{orderDetailInfo.DocTotal}</Description>
          <Description term="合同号">{orderDetailInfo.U_ContractEntry}</Description>
          <Description term="联系人">
            {orderDetailInfo.Contacts}-{orderDetailInfo.Cellolar}
          </Description>
          <Description term="客户参考号">{orderDetailInfo.NumAtCard}</Description>
          <Description term="单据状态">
            {orderDetailInfo.CANCELED === 'Y' ? (
              <MyTag type="关闭" value="Y" />
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
        </Tabs>
        <Modal
          width={960}
          destroyOnClose
          title="物料行附件"
          visible={attachmentVisible}
          onOk={() => this.handleModalVisible(false)}
          onCancel={() => this.handleModalVisible(false)}
        >
          <Attachment dataSource={prviewList} iscan={false} />
        </Modal>
      </Card>
    );
  }
}

export default OrderDetailPage;
