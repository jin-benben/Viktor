import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Tabs,
  Modal,
  Button,
  Icon,
  message,
  Dropdown,
  Menu,
  Collapse,
  Empty,
  Tag,
  Badge,
} from 'antd';
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
import { getName } from '@/utils/utils';
import { baseType } from '@/utils/publicData';

const { Description } = DescriptionList;
const { TabPane } = Tabs;
const { Panel } = Collapse;

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
      title: '询价交期',
      width: 120,
      dataIndex: 'InquiryDueDate',
      align: 'center',
      render: (val, record) =>
        record.lastIndex ? '' : <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
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
      render: (val, record) =>
        record.lastIndex ? '' : <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
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
      formVals: {}, // 单据信息
      attachmentVisible: false,
      transferModalVisible: false,
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

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAskPreview/save',
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
          NumAtCard: '',
          Owner: '',
          IsInquiry: '',
          TI_Z02702: [],
          TI_Z02703: [],
          TI_Z02603Fahter: [],
        },
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.supplierAskPreview.supplierAskDetail !== prevState.formVals) {
      return {
        formVals: nextProps.supplierAskPreview.supplierAskDetail,
      };
    }
    return null;
  }

  topMenu = () => {
    const { formVals } = this.state;
    return (
      <Menu>
        <Menu.Item>
          <Link target="_blank" to="/purchase/TI_Z027/edit">
            新建采购询价单
          </Link>
        </Menu.Item>
        <Menu.Item>
          <OrderPrint BaseEntry={formVals.DocEntry} BaseType="TI_Z027" />
        </Menu.Item>
        <Menu.Item>
          <Emails BaseEntry={formVals.DocEntry} BaseType="TI_Z027" />
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
    this.setState({ attachmentVisible: !!flag, transferModalVisible: !!flag });
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
      });
    }
  };

  // 取消单据

  cancelSubmit = ClosedComment => {
    const { dispatch } = this.props;
    const {
      formVals: { DocEntry, UpdateTimestamp },
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
    const { formVals } = this.state;
    if (formVals.Closed !== 'Y') {
      router.push(`/purchase/TI_Z027/update?DocEntry=${formVals.DocEntry}`);
    } else {
      message.warn('此单已被关闭，暂不可编辑');
    }
  };

  render() {
    const {
      global: { TI_Z004, Company, Curr, Purchaser },
      location: { query },
    } = this.props;
    const { formVals, attachmentVisible, prviewList, transferModalVisible } = this.state;

    const newdata = [...formVals.TI_Z02702];
    if (newdata.length > 0) {
      newdata.push({
        LineID: newdata[newdata.length - 1].LineID + 1,
        lastIndex: true,
        LineTotal: formVals.InquiryDocTotal,
        InquiryLineTotalLocal: formVals.InquiryDocTotalLocal,
      });
    }

    const transferParentMethods = {
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Card bordered={false}>
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="单号">{formVals.DocEntry}</Description>
          <Description term="供应商">
            <Link to={`/main/TI_Z007/detail?Code=${formVals.CardCode}`}>
              {`${formVals.CardName}(${formVals.CardCode})`}
            </Link>
          </Description>
          <Description term="单据日期">{moment(formVals.DocDate).format('YYYY-MM-DD')}</Description>
          <Description term="创建日期">
            {moment(formVals.CreateDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="有效日期">
            {formVals.ToDate ? moment(formVals.ToDate).format('YYYY-MM-DD') : ''}
          </Description>
          <Description term="联系人">{formVals.Contacts}</Description>
          <Description term="备注">{formVals.Comment}</Description>
          <Description term="创建人">
            <span>{getName(TI_Z004, formVals.CreateUser)}</span>
          </Description>
          <Description term="采购">
            <span>{getName(Purchaser, formVals.Owner)}</span>
          </Description>
          <Description term="交易公司">
            <span>{getName(Company, formVals.CompanyCode)}</span>
          </Description>

          <Description term="交易币种">
            <span>{getName(Curr, formVals.Currency)}</span>
          </Description>
          <Description term="单据汇率">{formVals.DocRate}</Description>
          <Description term="客户参考号">{formVals.NumAtCard}</Description>
          <Description term="单据状态">
            {formVals.Closed === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                {formVals.DocStatus === 'C' ? (
                  <Tag color="green">已报价</Tag>
                ) : (
                  <Tag color="gold">未报价</Tag>
                )}
                {formVals.SendEmailStatus === 'C' ? (
                  <Tag color="green">已发送</Tag>
                ) : (
                  <Tag color="gold">未发送</Tag>
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
              scroll={{ x: 1900 }}
              columns={this.skuColumns}
            />
          </TabPane>
          <TabPane tab="常规" key="2">
            <DescriptionList style={{ marginBottom: 24 }}>
              <Description term="手机号码">{formVals.CellphoneNO}</Description>
              <Description term="联系人电话">{formVals.PhoneNO}</Description>
              <Description term="联系人邮箱">{formVals.Email}</Description>
            </DescriptionList>
          </TabPane>
          <TabPane tab="附件" key="3">
            {formVals.TI_Z02603Fahter.length ? (
              <Collapse>
                {formVals.TI_Z02603Fahter.map(item => {
                  const header = (
                    <div>
                      单号：{' '}
                      <Link
                        target="_blank"
                        to={`/sellabout/TI_Z026/detail?DocEntry=${item.DocEntry}`}
                      >
                        {item.DocEntry}
                      </Link>
                      ; 创建日期：{moment(item.FCreateDate).format('YYYY-MM-DD')}； 创建人
                      <span>{getName(TI_Z004, item.FCreateUser)}</span>； 更新日期：
                      {moment(item.FUpdateDate).format('YYYY-MM-DD')}； 更新人:
                      <span>{getName(TI_Z004, item.FUpdateUser)}</span>
                    </div>
                  );
                  return (
                    <Panel header={header} key={item.DocEntry}>
                      {item.TI_Z02603.map(line => (
                        <ul key={line.OrderID}>
                          <li>序号:{line.OrderID}</li>
                          <li>
                            来源类型:<span>{getName(baseType, line.BaseType)}</span>
                          </li>
                          <li>来源单号:{line.BaseEntry}</li>
                          <li>附件代码:{line.AttachmentCode}</li>
                          <li>附件描述:{line.AttachmentName}</li>
                          <li>
                            附件路径:
                            <a href={line.AttachmentPath} target="_blank" rel="noopener noreferrer">
                              {line.AttachmentPath}
                            </a>
                          </li>
                        </ul>
                      ))}
                    </Panel>
                  );
                })}
              </Collapse>
            ) : (
              <Empty />
            )}
          </TabPane>
          <TabPane tab="打印记录" key="4">
            <PrintHistory QueryType="2" QueryKey={query.DocEntry} />
          </TabPane>
          <TabPane tab="邮件发送记录" key="5">
            <SendEmail QueryType="2" QueryKey={query.DocEntry} />
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
          <StandardTable
            data={{ list: prviewList }}
            rowKey="LineID"
            columns={this.attachmentColumns}
          />
        </Modal>

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
          SourceEntry={formVals.DocEntry}
          SourceType="TI_Z027"
          modalVisible={transferModalVisible}
          {...transferParentMethods}
        />
      </Card>
    );
  }
}

export default InquiryEdit;
