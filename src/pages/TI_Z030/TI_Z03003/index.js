import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Button, Icon, message, Dropdown, Menu, Collapse, Empty } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import Link from 'umi/link';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import CancelOrder from '@/components/Modal/CancelOrder';
import MyTag from '@/components/Tag';
import NeedAskPrice from '../components/needAskPrice';
import OrderPrint from '@/components/Modal/OrderPrint';
import TargetLine from '@/components/TargetLine';
import Emails from '@/components/Modal/Email';

import { getName } from '@/utils/utils';
import { orderSourceType, linkmanColumns, otherCostCColumns, baseType } from '@/utils/publicData';

const { Description } = DescriptionList;
const { TabPane } = Tabs;
const { Panel } = Collapse;

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
      title: '品牌',
      width: 80,
      align: 'center',
      dataIndex: 'BrandName',
    },
    {
      title: '名称',
      dataIndex: 'ProductName',
      width: 150,
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '型号',
      width: 150,
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
      width: 150,
      dataIndex: 'Parameters',
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '包装',
      width: 150,
      dataIndex: 'Package',
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
      width: 50,

      dataIndex: 'Quantity',

      align: 'center',
    },
    {
      title: '销建议价',
      width: 80,
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
      title: '行利润',
      width: 80,
      dataIndex: 'ProfitLineTotal',
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
      render: (text, record) => {
        const {
          global: { WhsCode },
        } = this.props;
        return record.lastIndex ? '' : <span>{getName(WhsCode, text)}</span>;
      },
    },
    {
      title: '询价最终价',
      width: 100,
      dataIndex: 'InquiryPrice',
      align: 'center',
    },
    {
      title: '供应商',
      width: 100,
      dataIndex: 'SupplierName',
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '询价币种',
      width: 80,
      dataIndex: 'Currency',
      align: 'center',
      render: (text, record) => {
        const {
          global: { Curr },
        } = this.props;
        return record.lastIndex ? '' : <span>{getName(Curr, text)}</span>;
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
      render: (text, record) => {
        const {
          global: { Purchaser },
        } = this.props;
        return record.lastIndex ? '' : <span>{getName(Purchaser, text)}</span>;
      },
    },
    {
      title: '询价备注',
      dataIndex: 'InquiryComment',
      width: 100,
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '询行总计',
      width: 100,
      align: 'center',
      dataIndex: 'InquiryLineTotal',
      render: (text, record) =>
        record.lastIndex ? <span style={{ fontWeight: 'bolder' }}>{text}</span> : text,
    },
    {
      title: '询行本总计',
      width: 100,
      align: 'center',
      dataIndex: 'InquiryLineTotalLocal',
      render: (text, record) =>
        record.lastIndex ? <span style={{ fontWeight: 'bolder' }}>{text}</span> : text,
    },
    {
      title: '确认状态',
      dataIndex: 'LineStatus',
      width: 80,
      render: (text, record) =>
        record.lastIndex ? '' : <MyTag type="确认" value={record.LineStatus} />,
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
      title: '销报单',
      width: 80,
      dataIndex: 'QuotationEntry',
      render: (val, record) =>
        record.lastIndex ? null : (
          <Link target="_blank" to={`/sellabout/TI_Z029/detail?DocEntry=${record.QuotationEntry}`}>
            {`${val}-${record.QuotationLineID}`}
          </Link>
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
            <Icon
              title="预览"
              type="eye"
              onClick={() => this.lookLineAttachment(record, index)}
              style={{ color: '#08c', marginRight: 5 }}
            />
          </Fragment>
        ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      formVals: {}, // 单据信息
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
          CodeList: ['Saler', 'Purchaser', 'TI_Z004', 'Curr', 'WhsCode', 'Company'],
        },
      },
    });
    this.getDetail();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'agreementPreview/save',
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
          ProvinceID: '',
          Province: '',
          CityID: '',
          City: '',
          AreaID: '',
          Area: '',
          Address: '',
          NumAtCard: '',
          Owner: '',
          IsInquiry: '',
          TI_Z03002: [],
          TI_Z03003: [],
          TI_Z02603Fahter: [],
        },
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.agreementPreview.agreementDetail !== prevState.formVals) {
      return {
        formVals: nextProps.agreementPreview.agreementDetail,
      };
    }
    return null;
  }

  topMenu = () => {
    const { formVals } = this.state;
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
          <OrderPrint BaseEntry={formVals.DocEntry} BaseType="TI_Z030" />
        </Menu.Item>
        <Menu.Item>
          <Emails BaseEntry={formVals.DocEntry} BaseType="TI_Z030" />
        </Menu.Item>
      </Menu>
    );
  };

  // 取消单据
  cancelSubmit = ClosedComment => {
    const { dispatch } = this.props;
    const {
      formVals: { UpdateTimestamp, DocEntry },
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
      });
    }
  };

  toUpdate = () => {
    const { formVals } = this.state;
    router.push(`/sellabout/TI_Z030/update?DocEntry=${formVals.DocEntry}`);
  };

  // 发送需询价
  submitNeedLine = () => {
    const {
      dispatch,
      global: { currentUser },
    } = this.props;
    const {
      formVals: { UpdateTimestamp, DocEntry },
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
      formVals: { DocEntry, UpdateTimestamp },
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
    } = this.props;
    const { formVals, attachmentVisible, targetLine, needmodalVisible } = this.state;

    const needParentMethods = {
      handleSubmit: this.submitNeedLine,
      handleModalVisible: this.handleModalVisible,
    };

    const newdata = [...formVals.TI_Z03002];
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
      <Card bordered={false}>
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="单号">{formVals.DocEntry}</Description>
          <Description term="客户ID">{formVals.CardCode}</Description>
          <Description term="客户名称">{formVals.CardName}</Description>
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
              <MyTag type="关闭" value="Y" />
            ) : (
              <MyTag type="确认" value={formVals.DocStatus} />
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
              scroll={{ x: 2800, y: 600 }}
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
              data={{ list: formVals.TI_Z03004 }}
              rowKey="LineID"
              columns={otherCostCColumns}
            />
          </TabPane>
          <TabPane tab="附件" key="4">
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
          <TabPane tab="其他推送人" key="5">
            <StandardTable
              data={{ list: formVals.TI_Z03005 }}
              rowKey="UserID"
              columns={linkmanColumns}
            />
          </TabPane>
        </Tabs>
        <TargetLine
          attachmentVisible={attachmentVisible}
          otherCostList={targetLine.TI_Z03003}
          attachList={targetLine.TI_Z02604}
          handleModalVisible={this.handleModalVisible}
        />
        <FooterToolbar>
          {formVals.Closed !== 'Y' ? (
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
            data={formVals.TI_Z03002}
            {...needParentMethods}
            modalVisible={needmodalVisible}
          />
        </FooterToolbar>
      </Card>
    );
  }
}

export default InquiryEdit;
