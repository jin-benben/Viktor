import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Modal, Button, Icon, message, Dropdown, Menu } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import Link from 'umi/link';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import CancelOrder from '@/components/Modal/CancelOrder';
import StandardTable from '@/components/StandardTable';
import MyTag from '@/components/Tag';
import NeedAskPrice from '../components/needAskPrice';
import Transfer from '@/components/Transfer';
import Attachment from '@/components/Attachment';
import { getName } from '@/utils/utils';
import { orderSourceType, linkmanColumns } from '@/utils/publicData';

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
      title: '单位',
      width: 50,
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
      title: '品牌',
      width: 80,
      align: 'center',
      dataIndex: 'BrandName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '名称',
      dataIndex: 'ProductName',
      width: 100,
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '外文名称',
      dataIndex: 'ForeignName',
      width: 100,
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '型号',
      width: 100,
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
      width: 100,
      dataIndex: 'Parameters',
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '规格(外)',
      width: 100,
      dataIndex: 'ForeignParameters',
      align: 'center',
      render: text => (
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
    },
    {
      title: '产地',
      width: 80,
      dataIndex: 'ManLocation',
      align: 'center',
    },
    {
      title: 'HS编码',
      width: 100,
      dataIndex: 'HSCode',
    },
    {
      title: '报关税率',
      width: 80,
      dataIndex: 'HSVatRate',
      align: 'center',
    },
    {
      title: '附加税率',
      width: 80,
      dataIndex: 'HSVatRateOther',
      align: 'center',
    },
    {
      title: '要求名称',
      width: 80,
      dataIndex: 'CustomerName',
      align: 'center',
    },
    {
      title: '重量',
      width: 80,
      dataIndex: 'Rweight',
      align: 'center',
    },
    {
      title: '国外运费',
      width: 80,
      dataIndex: 'ForeignFreight',
      align: 'center',
    },
    {
      title: '建议价格',
      width: 80,
      dataIndex: 'AdvisePrice',
      align: 'center',
    },

    {
      title: '价格',
      width: 100,
      dataIndex: 'Price',

      align: 'center',
    },
    {
      title: '销行总计',
      width: 100,
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
      align: 'center',
      render: (val, record) =>
        record.lastIndex ? '' : <span>{moment(val).format('YYYY-MM-DD')}</span>,
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
      render: text => {
        const {
          global: { Curr },
        } = this.props;
        return <span>{getName(Curr, text)}</span>;
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
      title: '询行总计',
      width: 100,
      align: 'center',
      dataIndex: 'InquiryLineTotal',
    },
    {
      title: '询行本总计',
      width: 100,
      align: 'center',
      dataIndex: 'InquiryLineTotalLocal',
    },
    {
      title: '报价状态',
      width: 80,
      dataIndex: 'SLineStatus',
      align: 'center',
      render: (text, record) => (record.lastIndex ? null : <MyTag type="报价" value={text} />),
    },
    {
      title: '采询确认',
      width: 80,
      dataIndex: 'PLineStatus',
      align: 'center',
      render: (text, record) => (record.lastIndex ? null : <MyTag type="确认" value={text} />),
    },
    {
      title: '需询价',
      width: 100,
      dataIndex: 'IsInquiry',
      align: 'center',
      render: (text, record) => (record.lastIndex ? null : <MyTag type="IsInquiry" value={text} />),
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
      render: (text, record, index) =>
        record.lastIndex ? null : (
          <Fragment>
            {record.TI_Z02604.length ? (
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
      formVals: {
        TI_Z02602: [],
      }, // 单据信息
      attachmentVisible: false,
      selectedRows: [],
      needmodalVisible: false,
      transferModalVisible: false, // 转移modal
      prviewList: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Purchaser', 'TI_Z004', 'Curr', 'WhsCode', 'Company'],
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
          <a href="javacript:void(0)" onClick={this.selectNeed}>
            确认需采购询价
          </a>
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
      needmodalVisible: !!flag,
      transferModalVisible: !!flag,
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
    const { formVals } = this.state;
    dispatch({
      type: 'inquiryPreview/cancel',
      payload: {
        Content: {
          DocEntry: formVals.DocEntry,
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
    } = this.props;
    const {
      formVals,
      attachmentVisible,
      prviewList,
      selectedRows,
      needmodalVisible,
      transferModalVisible,
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
    //  let tablwidth=0;
    // this.skuColumns.map(item=>{
    //   if(item.width){
    //     tablwidth+=item.width
    //   }
    // })
    // console.log(tablwidth)
    return (
      <Card bordered={false} loading={loading}>
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="单号">{formVals.DocEntry}</Description>
          <Description term="客户">{`${formVals.CardName}(${formVals.CardCode})`}</Description>
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
          <Description term="需询价">
            <MyTag type="IsInquiry" value={formVals.IsInquiry} />
          </Description>
          <Description term="单据状态">
            {formVals.Closed === 'Y' ? (
              <MyTag type="关闭" value="Y" />
            ) : (
              <Fragment>
                <MyTag type="报价" value={formVals.SDocStatus} />
                <MyTag type="询价" value={formVals.PDocStatus} />
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
              scroll={{ x: 3540, y: 600 }}
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
          <NeedAskPrice
            data={selectedRows}
            {...needParentMethods}
            modalVisible={needmodalVisible}
          />
          <Transfer
            SourceEntry={formVals.DocEntry}
            SourceType="TI_Z026"
            modalVisible={transferModalVisible}
            {...transferParentMethods}
          />
        </FooterToolbar>
      </Card>
    );
  }
}

export default InquiryEdit;
