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

@connect(({ odlnordnDetail, loading, global }) => ({
  odlnordnDetail,
  global,
  loading: loading.effects['odlnordnDetail/fetch'],
}))
class InquiryEdit extends PureComponent {
  skuColumns = [
    {
      title: '物料代码',
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
      dataIndex: 'InvntryUom',
    },
    {
      title: '数量',
      dataIndex: 'Quantity',
    },

    {
      title: '含税价格',
      dataIndex: 'PriceAfVAT',
    },
    {
      title: '行总计',
      dataIndex: 'LineTotal',
    },
    {
      title: '行备注',
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
          CodeList: ['Saler', 'Company', 'TI_Z004', 'Trnsp'],
        },
      },
    });
    this.getDetail();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'odlnordnDetail/save',
      payload: {
        odlnordnDetailInfo: {
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
    const { ObjType, DocEntry } = query;
    if (DocEntry && ObjType) {
      dispatch({
        type: 'odlnordnDetail/fetch',
        payload: {
          Content: {
            ObjType,
            DocEntry,
          },
        },
      });
    }
  };

  render() {
    const {
      global: { Saler, Company, TI_Z004, Trnsp },
      odlnordnDetail: { odlnordnDetailInfo },
      loading,
    } = this.props;
    const { attachmentVisible, prviewList } = this.state;
    let newdata = [];
    if (odlnordnDetailInfo.DocEntry) {
      newdata = odlnordnDetailInfo.DLN1RDN1.map((item, index) => {
        const newItem = item;
        newItem.key += index;
        return newItem;
      });
    }
    if (newdata.length > 0) {
      newdata.push({
        key: newdata[newdata.length - 1].key + 1,
        lastIndex: true,
        LineTotal: odlnordnDetailInfo.DocTotal,
      });
    }

    return (
      <Card
        bordered={false}
        loading={loading}
        title={odlnordnDetailInfo.ObjType === '15' ? '收货单' : '退货单'}
      >
        <DescriptionList style={{ marginBottom: 24, marginTop: 24 }}>
          <Description term="单号">{odlnordnDetailInfo.DocEntry}</Description>
          <Description term="客户">{`${odlnordnDetailInfo.CardName}(${
            odlnordnDetailInfo.CardCode
          })`}</Description>
          <Description term="单据日期">
            {moment(odlnordnDetailInfo.DocDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="发货时间">
            {moment(odlnordnDetailInfo.U_DeliverDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="交易公司">
            <span>{getName(Company, odlnordnDetailInfo.U_CompanyCode)}</span>
          </Description>
          <Description term="销售员">
            <span>{getName(Saler, odlnordnDetailInfo.SlpCode)}</span>
          </Description>
          <Description term="发货地址">{`${odlnordnDetailInfo.ShipToCode}${
            odlnordnDetailInfo.Address2
          }`}</Description>
          <Description term="客户参考号">{odlnordnDetailInfo.NumAtCard}</Description>
          <Description term="备注">{odlnordnDetailInfo.Comments}</Description>
          <Description term="单据总计">{odlnordnDetailInfo.DocTotal}</Description>
          <Description term="合同号">{odlnordnDetailInfo.U_ContractEntry}</Description>
          <Description term="联系人">
            {odlnordnDetailInfo.Contacts}-{odlnordnDetailInfo.Cellolar}
          </Description>
          <Description term="发货人">
            <span>{getName(TI_Z004, odlnordnDetailInfo.U_DeliverUser)}</span>
          </Description>
          <Description term="运输类型">
            <span>{getName(Trnsp, odlnordnDetailInfo.TrnspCode)}</span>
          </Description>
          <Description term="快递单号">{odlnordnDetailInfo.U_ExpressNumber}</Description>
          <Description term="客户参考号">{odlnordnDetailInfo.NumAtCard}</Description>
          <Description term="单据状态">
            {odlnordnDetailInfo.CANCELED === 'Y' ? (
              <MyTag type="关闭" value="Y" />
            ) : (
              <Fragment>
                {odlnordnDetailInfo.DocStatus === 'O' ? (
                  <Tag color="gold">未清</Tag>
                ) : (
                  <Tag color="green">已清</Tag>
                )}
                {odlnordnDetailInfo.U_DeliverSts === 'Y' ? (
                  <Tag color="gold">未发货</Tag>
                ) : (
                  <Tag color="green">已发火</Tag>
                )}
              </Fragment>
            )}
          </Description>
        </DescriptionList>
        <Tabs>
          <TabPane tab="物料" key="1">
            <StandardTable data={{ list: newdata }} rowKey="key" columns={this.skuColumns} />
          </TabPane>
          <TabPane tab="附件" key="3">
            <Attachment dataSource={odlnordnDetailInfo.DocEnclosure} iscan />
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

export default InquiryEdit;
