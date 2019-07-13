/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Icon,
  Tooltip,
  message,
  Tag,
  Badge,
} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Link from 'umi/link';
import StandardTable from '@/components/StandardTable';
import NeedAskPrice from '../components/needAskPrice';
import Organization from '@/components/Organization/multiple';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';
import Transfer from '@/components/Transfer';
import MyPageHeader from '../components/pageHeader';
import MDMCommonality from '@/components/Select';
import ProcessorSelect from '@/components/Select/SalerPurchaser';
import Comparison from '@/components/Comparison';
import AttachmentModal from '@/components/Attachment/modal';
import TransferHistory from '@/components/TransferHistory';
import { lineStatus } from '@/utils/publicData';
import { getName } from '@/utils/utils';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ orderLine, loading, global }) => ({
  orderLine,
  global,
  loading: loading.models.orderLine,
}))
@Form.create()
class orderLine extends PureComponent {
  state = {
    expandForm: false,
    modalVisible: false,
    transferModalVisible: false,
    attachmentVisible: false,
    historyVisible: false,
    targetLine: {},
    prviewList: [],
    selectedRows: [],
    needAsk: [],
    transferLine: {
      DocEntry: '',
    },
  };

  columns = [
    {
      title: '单号',
      width: 100,
      fixed: 'left',
      sorter: true,
      align: 'center',
      dataIndex: 'DocEntry',
      render: (text, recond) => (
        <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${text}`}>
          {`${text}-${recond.LineID}`}
        </Link>
      ),
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      sorter: true,
      align: 'center',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '行状态',
      width: 250,
      dataIndex: 'LineStatus',
      sorter: true,
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? null : (
          <Fragment>
            {record.Closed === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                <Tag color="green">{getName(lineStatus, text)}</Tag>
                {record.PLineStatus === 'C' ? (
                  <Tag color="green">采已确认</Tag>
                ) : (
                  <Tag color="gold">采未确认</Tag>
                )}
                {record.InquiryStatus === 'C' ? (
                  <Tag color="green">采已生成</Tag>
                ) : (
                  <Tag color="gold">采未生成</Tag>
                )}
                {record.IsInquiry === 'Y' ? (
                  <Tag color="green">需询价</Tag>
                ) : (
                  <Tag color="gold">不询价</Tag>
                )}
              </Fragment>
            )}
          </Fragment>
        ),
    },
    {
      title: '客户',
      width: 180,
      sorter: true,
      align: 'center',
      dataIndex: 'CardName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },

    {
      title: '物料',
      dataIndex: 'SKUName',
      sorter: true,
      align: 'center',
      width: 300,
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {text ? (
            <Link target="_blank" to={`/main/product/TI_Z009/TI_Z00903?Code${record.SKU}`}>
              {record.SKU}-
            </Link>
          ) : (
            ''
          )}
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '名称(外)',
      width: 100,
      dataIndex: 'ForeignName',
      render: (text, record) => (
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
      render: (text, record) => <span>{`${text}(${record.Unit})`}</span>,
    },
    {
      title: '价格',
      width: 80,
      dataIndex: 'Price',
      sorter: true,
      align: 'center',
    },
    {
      title: '行总计',
      width: 100,
      sorter: true,
      align: 'center',
      dataIndex: 'LineTotal',
      render: (text, record) =>
        record.lastIndex ? <span style={{ fontWeight: 'bolder' }}>{text}</span> : text,
    },
    {
      title: '行备注',
      width: 100,
      dataIndex: 'LineComment',
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '采报价日期',
      width: 120,
      dataIndex: 'InquiryCfmDate',
      sorter: true,
      align: 'center',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '询价价格',
      width: 100,
      dataIndex: 'InquiryPrice',
      sorter: true,
      align: 'center',
      render: (text, record) => {
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
      width: 120,
      dataIndex: 'ForeignFreight',
      sorter: true,
      align: 'center',
      render: (text, record) => <span>{`${record.Rweight}(公斤)[${text}]`}</span>,
    },
    {
      title: '询行总计',
      width: 100,
      sorter: true,
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
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '询价交期',
      width: 120,
      dataIndex: 'InquiryDueDate',
      sorter: true,
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
      sorter: true,
      align: 'center',
      render: text => {
        const {
          global: { TI_Z042 },
        } = this.props;
        return <span>{getName(TI_Z042, text)}</span>;
      },
    },
    {
      title: 'HS编码',
      width: 100,
      dataIndex: 'HSCode',
      render: text => {
        const {
          global: { HS },
        } = this.props;
        return (
          <Ellipsis tooltip lines={1}>
            {getName(HS, text)}
          </Ellipsis>
        );
      },
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
      render: text => {
        const {
          global: { WhsCode },
        } = this.props;
        return <span>{getName(WhsCode, text)}</span>;
      },
    },
    {
      title: '联系人',
      width: 150,
      dataIndex: 'KHContacts',
      render: (text, record) => (
        <Tooltip
          title={
            <Fragment>
              {record.CellphoneNO}
              <br />
              {record.Email}
              <br />
              {record.PhoneNO}
            </Fragment>
          }
        >
          {text}
        </Tooltip>
      ),
    },

    {
      title: '采购员',
      width: 120,
      dataIndex: 'Purchaser',
      sorter: true,
      align: 'center',
      render: text => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, text)}</span>;
      },
    },
    {
      title: '销售员',
      width: 120,
      dataIndex: 'Owner',
      sorter: true,
      align: 'center',
      render: text => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, text)}</span>;
      },
    },
    {
      title: '处理人',
      width: 120,
      dataIndex: 'Processor',
      sorter: true,
      align: 'center',
      render: val => {
        const {
          global: { TI_Z004 },
        } = this.props;
        return <span>{getName(TI_Z004, val)}</span>;
      },
    },
    {
      title: '转移备注',
      width: 120,
      sorter: true,
      align: 'center',
      dataIndex: 'TransferComment',
      render: text => (
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
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '创建日期',
      width: 100,
      sorter: true,
      align: 'center',
      dataIndex: 'CreateDate',
      render: val => (
        <Ellipsis tooltip lines={1}>
          <span>{val ? moment(val).format('YYYY-MM-DD HH:DD:MM') : ''}</span>
        </Ellipsis>
      ),
    },
    {
      title: '销报单号',
      width: 80,
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
      width: 80,
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
      width: 80,
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
      render: (text, record) => (
        <Fragment>
          {record.TI_Z02604.length ? (
            <a onClick={() => this.lookLineAttachment(record)}>
              {' '}
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

  componentDidMount() {
    const {
      dispatch,
      global: { currentUser },
      orderLine: { queryData },
    } = this.props;
    Object.assign(queryData.Content, { Owner: [currentUser.Owner] });
    dispatch({
      type: 'orderLine/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Purchaser', 'TI_Z042', 'TI_Z004', 'HS', 'WhsCode'],
        },
      },
    });
    dispatch({
      type: 'global/getAuthority',
    });
  }

  handleStandardTableChange = (pagination, filters, sorter) => {
    const {
      dispatch,
      orderLine: { queryData },
    } = this.props;
    const { field, order } = sorter;
    let sord = 'desc';
    if (order === 'ascend') {
      sord = 'asc';
    }
    dispatch({
      type: 'orderLine/fetch',
      payload: {
        ...queryData,
        page: pagination.current,
        rows: pagination.pageSize,
        sidx: field || 'DocEntry',
        sord,
      },
    });
    this.setState({
      selectedRows: [],
    });
  };

  lookLineAttachment = record => {
    this.setState({ attachmentVisible: true, prviewList: record.TI_Z02604 });
  };

  handleSearch = e => {
    // 搜索
    e.preventDefault();
    const {
      dispatch,
      form,
      orderLine: { queryData },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let DocDateFrom;
      let DocDateTo;
      if (fieldsValue.dateArr) {
        DocDateFrom = moment(fieldsValue.dateArr[0]).format('YYYY-MM-DD');
        DocDateTo = moment(fieldsValue.dateArr[1]).format('YYYY-MM-DD');
      }
      let InquiryCfmDateFrom;
      let InquiryCfmDateTo;
      if (fieldsValue.InquiryCfmDate) {
        InquiryCfmDateFrom = moment(fieldsValue.InquiryCfmDate[0]).format('YYYY-MM-DD');
        InquiryCfmDateTo = moment(fieldsValue.InquiryCfmDate[1]).format('YYYY-MM-DD');
      }
      let TransferDateTimeFrom = '';
      let TransferDateTimeTo = '';
      if (fieldsValue.TransferDate) {
        TransferDateTimeFrom = moment(fieldsValue.TransferDate[0]).format('YYYY-MM-DD');
        TransferDateTimeTo = moment(fieldsValue.TransferDate[1]).format('YYYY-MM-DD');
      }

      delete fieldsValue.InquiryCfmDate;
      delete fieldsValue.dateArr;
      delete fieldsValue.TransferDate;
      const newQueryData = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
        InquiryCfmDateFrom,
        InquiryCfmDateTo,
        TransferDateTimeFrom,
        TransferDateTimeTo,
      };
      Object.assign(queryData.Content, { ...newQueryData });
      Object.assign(queryData, { page: 1 });
      dispatch({
        type: 'orderLine/fetch',
        payload: {
          ...queryData,
        },
      });
    });
  };

  toggleForm = () => {
    // 是否展开
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  prviewTransferHistory = recond => {
    this.setState({
      targetLine: recond,
      historyVisible: true,
    });
  };

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  // 发送需询价success回调
  submitNeedLine = () => {
    message.success('提交成功');
    this.setState({ modalVisible: false });
    this.getDetail();
  };

  // 确认需要采购询价
  selectNeed = () => {
    const { selectedRows } = this.state;
    let { needAsk } = this.state;
    needAsk = selectedRows.filter(item => item.IsInquiry === 'N');
    if (selectedRows.length) {
      this.setState({ needAsk: [...needAsk], modalVisible: true });
    } else {
      message.warning('暂无需询价的行');
    }
  };

  // 需询价弹窗
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      transferModalVisible: !!flag,
      attachmentVisible: !!flag,
      historyVisible: !!flag,
    });
  };

  toTransfer = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length) {
      this.setState({
        transferLine: selectedRows[0],
        transferModalVisible: true,
      });
    } else {
      message.warning('请先选择转移的行');
    }
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      orderLine: { queryData },
      global: { OSLPList },
    } = this.props;
    const { expandForm } = this.state;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { Closed, Owner } = queryData.Content;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem key="SearchText" {...formLayout} label="关键字">
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="PLineStatus" {...formLayout} label="采确状态">
              {getFieldDecorator('PLineStatus')(
                <Select style={{ width: '100%' }} placeholder="请选择">
                  <Option value="C">已确认</Option>
                  <Option value="O">未确认</Option>
                  <Option value="">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="Owner" {...formLayout} label="销售员">
              {getFieldDecorator('Owner', { initialValue: Owner })(
                <SalerPurchaser initialValue={Owner} />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="采报价日期" {...formLayout}>
              {getFieldDecorator('InquiryCfmDate', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          {expandForm ? (
            <Fragment>
              <Col md={5} sm={24}>
                <FormItem key="IsInquiry" {...formLayout} label="需询价">
                  {getFieldDecorator('IsInquiry')(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      <Option value="Y">需询价</Option>
                      <Option value="N">不询价</Option>
                      <Option value="">全部</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem key="Closed" {...formLayout} label="关闭状态">
                  {getFieldDecorator('Closed', { initialValue: Closed })(
                    <Select style={{ width: '100%' }} placeholder="请选择关闭状态">
                      <Option value="Y">已关闭</Option>
                      <Option value="N">未关闭</Option>
                      <Option value="">全部</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem key="LineStatus" {...formLayout} label="询价状态">
                  {getFieldDecorator('LineStatus')(<MDMCommonality data={lineStatus} />)}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem key="InquiryStatus" {...formLayout} label="采生成状态">
                  {getFieldDecorator('InquiryStatus')(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      <Option value="C">已生成</Option>
                      <Option value="O">未生成</Option>
                      <Option value="">全部</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem label="日期" {...formLayout}>
                  {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                    <RangePicker style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem {...formLayout} label="单号">
                  <FormItem className="lineFormItem" key="DocEntryFrom">
                    {getFieldDecorator('DocEntryFrom')(<Input placeholder="开始单号" />)}
                  </FormItem>
                  <span className="lineFormItemCenter">-</span>
                  <FormItem className="lineFormItem" key="DocEntryTo">
                    {getFieldDecorator('DocEntryTo')(<Input placeholder="结束单号" />)}
                  </FormItem>
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem key="DeptList" {...this.formLayout} label="部门">
                  {getFieldDecorator('DeptList')(<Organization />)}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem label="转移日期" {...formLayout}>
                  {getFieldDecorator('TransferDate', { rules: [{ type: 'array' }] })(
                    <RangePicker style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem key="Processor" {...formLayout} label="处理人">
                  {getFieldDecorator('Processor')(<ProcessorSelect data={OSLPList} type="Code" />)}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem key="AutoTransfer" {...formLayout} label="自动转移">
                  {getFieldDecorator('AutoTransfer')(
                    <Select placeholder="请选择">
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                      <Option value="">全部</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Fragment>
          ) : null}
          <Col md={4} sm={24}>
            <FormItem key="searchBtn">
              <span className="submitButtons">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  {expandForm ? (
                    <span>
                      收起 <Icon type="up" />
                    </span>
                  ) : (
                    <span>
                      展开 <Icon type="down" />
                    </span>
                  )}
                </a>
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      orderLine: { orderLineList, pagination },
      loading,
      location,
    } = this.props;
    const {
      needAsk,
      modalVisible,
      transferModalVisible,
      transferLine,
      selectedRows,
      attachmentVisible,
      prviewList,
      targetLine,
      historyVisible,
    } = this.state;

    const parentMethods = {
      handleSubmit: this.submitNeedLine,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Fragment>
        <Card bordered={false}>
          <MyPageHeader {...location} />
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: orderLineList }}
              pagination={pagination}
              rowKey="Key"
              scroll={{ x: 4000 }}
              columns={this.columns}
              rowSelection={{
                onSelectRow: this.onSelectRow,
              }}
              selectedRows={selectedRows}
              onChange={this.handleStandardTableChange}
            />
            <NeedAskPrice data={needAsk} {...parentMethods} modalVisible={modalVisible} />
          </div>
        </Card>
        <FooterToolbar>
          <Button onClick={this.selectNeed} type="primary">
            确认需采购询价
          </Button>
          <Button type="primary" onClick={this.toTransfer}>
            转移
          </Button>
          <Comparison
            rowkey="Key"
            dataSource={selectedRows.length ? selectedRows : orderLineList}
          />
        </FooterToolbar>
        <Transfer
          SourceEntry={transferLine.DocEntry}
          SourceType="TI_Z026"
          modalVisible={transferModalVisible}
          handleModalVisible={this.handleModalVisible}
        />
        <AttachmentModal
          attachmentVisible={attachmentVisible}
          prviewList={prviewList}
          handleModalVisible={this.handleModalVisible}
        />

        <TransferHistory
          modalVisible={historyVisible}
          handleModalVisible={this.handleModalVisible}
          BaseEntry={targetLine.DocEntry || ''}
          BaseLineID={targetLine.LineID || ''}
        />
      </Fragment>
    );
  }
}

export default orderLine;
