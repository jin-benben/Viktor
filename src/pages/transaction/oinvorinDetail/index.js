import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Modal, Icon, Tag } from 'antd';
import moment from 'moment';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import Attachment from '@/components/Attachment/other';
import { getName } from '@/utils/utils';

const { Description } = DescriptionList;
const { TabPane } = Tabs;

@connect(({ oinvorinDetail, loading, global }) => ({
  oinvorinDetail,
  global,
  loading: loading.effects['oinvorinDetail/fetch'],
}))
class InquiryEdit extends PureComponent {
  skuColumns = [
    {
      title: '物料代码',
      width: 80,
      dataIndex: 'ItemCode',
    },
    {
      title: '物料名称',
      width: 300,
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
      width: 80,
      dataIndex: 'PriceAfVAT',
    },
    {
      title: '行总计',
      width: 80,
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
          CodeList: ['Saler', 'Company', 'TI_Z004', 'Trnsp'],
        },
      },
    });
    this.getDetail();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'oinvorinDetail/save',
      payload: {
        oinvorinDetailInfo: {
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
        type: 'oinvorinDetail/fetch',
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
      oinvorinDetail: { oinvorinDetailInfo },
      loading,
    } = this.props;
    const { attachmentVisible, prviewList } = this.state;
    let newdata = [];
    if (oinvorinDetailInfo.DocEntry) {
      newdata = oinvorinDetailInfo.INV1RIN1.map((item, index) => {
        const newItem = item;
        newItem.key += index;
        return newItem;
      });
    }
    if (newdata.length > 0) {
      newdata.push({
        key: newdata[newdata.length - 1].key + 1,
        lastIndex: true,
        LineTotal: oinvorinDetailInfo.DocTotal,
      });
    }

    return (
      <Card
        bordered={false}
        loading={loading}
        title={oinvorinDetailInfo.ObjType === '13' ? '发票' : '贷项'}
      >
        <DescriptionList style={{ marginBottom: 24, marginTop: 24 }}>
          <Description term="单号">{oinvorinDetailInfo.DocEntry}</Description>
          <Description term="客户">
            {`${oinvorinDetailInfo.CardName}(${oinvorinDetailInfo.CardCode})`}
          </Description>
          <Description term="单据日期">
            {moment(oinvorinDetailInfo.DocDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="发货时间">
            {moment(oinvorinDetailInfo.U_DeliverDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="交易公司">
            <span>{getName(Company, oinvorinDetailInfo.U_CompanyCode)}</span>
          </Description>
          <Description term="销售员">
            <span>{getName(Saler, oinvorinDetailInfo.SlpCode)}</span>
          </Description>
          <Description term="发货地址">
            {`${oinvorinDetailInfo.ShipToCode}${oinvorinDetailInfo.Address2}`}
          </Description>
          <Description term="客户参考号">{oinvorinDetailInfo.NumAtCard}</Description>
          <Description term="备注">{oinvorinDetailInfo.Comments}</Description>
          <Description term="单据总计">{oinvorinDetailInfo.DocTotal}</Description>
          <Description term="合同号">{oinvorinDetailInfo.U_ContractEntry}</Description>
          <Description term="联系人">
            {oinvorinDetailInfo.Contacts}-{oinvorinDetailInfo.Cellolar}
          </Description>
          <Description term="发货人">
            <span>
              {getName(TI_Z004, oinvorinDetailInfo.U_DeliverUser) ||
                oinvorinDetailInfo.U_DeliverUser}
            </span>
          </Description>
          <Description term="运输类型">
            <span>{getName(Trnsp, oinvorinDetailInfo.TrnspCode)}</span>
          </Description>
          <Description term="快递单号">{oinvorinDetailInfo.U_ExpressNumber}</Description>
          <Description term="客户参考号">{oinvorinDetailInfo.NumAtCard}</Description>
          <Description term="单据状态">
            {oinvorinDetailInfo.CANCELED === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                {oinvorinDetailInfo.DocStatus === 'O' ? (
                  <Tag color="gold">未清</Tag>
                ) : (
                  <Tag color="green">已清</Tag>
                )}
                {oinvorinDetailInfo.U_DeliverSts === 'N' ? (
                  <Tag color="gold">未发货</Tag>
                ) : (
                  <Tag color="green">已发货</Tag>
                )}
              </Fragment>
            )}
          </Description>
        </DescriptionList>
        <Tabs>
          <TabPane tab="物料" key="1">
            <StandardTable
              data={{ list: newdata }}
              scroll={{ x: 1200 }}
              rowKey="key"
              columns={this.skuColumns}
            />
          </TabPane>
          <TabPane tab="附件" key="3">
            <Attachment dataSource={oinvorinDetailInfo.DocEnclosure} iscan />
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
          <Attachment dataSource={prviewList} iscan={false} />
        </Modal>
      </Card>
    );
  }
}

export default InquiryEdit;
