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
} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Link from 'umi/link';
import StandardTable from '@/components/StandardTable';
import DocEntryFrom from '@/components/DocEntryFrom';
import NeedAskPrice from '../components/needAskPrice';
import Organization from '@/components/Organization/multiple';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';
import Transfer from '@/components/Transfer';
import MDMCommonality from '@/components/Select';
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
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '行状态',
      width: 250,
      dataIndex: 'LineStatus',
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
      dataIndex: 'CardName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
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
      title: '询价价格',
      width: 120,
      dataIndex: 'InquiryPrice',
      align: 'center',
      render: (text, record) => {
        if (!text) return '';
        return <span>{`${text || ''}(${record.Currency || ''})[${record.DocRate || ''}]`}</span>;
      },
    },
    {
      title: '询行总计',
      width: 150,
      align: 'center',
      dataIndex: 'InquiryLineTotal',
      render: (text, record) => (
        <span>
          {`${text || ''}${
            record.Currency ? `(${record.Currency})` : ''
          }-${record.InquiryLineTotalLocal || ''}`}
        </span>
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
      render: (text, record) =>
        record.lastIndex ? null : <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>,
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
      title: '要求交期',
      width: 100,
      inputType: 'date',
      dataIndex: 'DueDate',
      align: 'center',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
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
      title: '客户参考号',
      width: 100,
      dataIndex: 'NumAtCard',
      render: text => (
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
      render: text => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, text)}</span>;
      },
    },
    {
      title: '处理人',
      width: 120,
      dataIndex: 'Processor',
      render: val => {
        const {
          global: { TI_Z004 },
        } = this.props;
        return <span>{getName(TI_Z004, val)}</span>;
      },
    },
    {
      title: '转移备注',
      width: 100,
      dataIndex: 'TransferComment',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '采询状态',
      width: 100,
      dataIndex: 'InquiryStatus',
      render: text => (
        <span>
          {text === 'C' ? <Tag color="green">采已询价</Tag> : <Tag color="gold">采未询价</Tag>}
        </span>
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

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      orderLine: { queryData },
    } = this.props;
    dispatch({
      type: 'orderLine/fetch',
      payload: {
        ...queryData,
        page: pagination.current,
        rows: pagination.pageSize,
      },
    });
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
      let DocEntryFroms = '';
      let DocEntryTo = '';
      if (fieldsValue.orderNo) {
        DocEntryFroms = fieldsValue.orderNo.DocEntryFrom;
        DocEntryTo = fieldsValue.orderNo.DocEntryTo;
      }
      delete fieldsValue.orderNo;
      delete fieldsValue.dateArr;
      const newQueryData = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
        DocEntryFrom: DocEntryFroms,
        DocEntryTo,
        ...fieldsValue.orderNo,
        InquiryCfmDate: fieldsValue.InquiryCfmDate
          ? fieldsValue.InquiryCfmDate.format('YYYY-MM-DD')
          : '',
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
    this.setState({ modalVisible: !!flag, transferModalVisible: !!flag });
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
            <FormItem key="InquiryCfmDate" {...formLayout} label="采报价日期">
              {getFieldDecorator('InquiryCfmDate')(<DatePicker style={{ width: '100%' }} />)}
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
                <FormItem key="orderNo" {...formLayout} label="单号">
                  {getFieldDecorator('orderNo', {
                    initialValue: { DocEntryFrom: '', DocEntryTo: '' },
                  })(<DocEntryFrom />)}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem key="DeptList" {...this.formLayout} label="部门">
                  {getFieldDecorator('DeptList')(<Organization />)}
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
    } = this.props;
    const { needAsk, modalVisible, transferModalVisible, transferLine } = this.state;

    const columns = this.columns.map(item => {
      // eslint-disable-next-line no-param-reassign
      item.align = 'Center';
      return item;
    });

    const parentMethods = {
      handleSubmit: this.submitNeedLine,
      handleModalVisible: this.handleModalVisible,
    };

    const transferParentMethods = {
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: orderLineList }}
              pagination={pagination}
              rowKey="Key"
              scroll={{ x: 3700 }}
              columns={columns}
              rowSelection={{
                onSelectRow: this.onSelectRow,
              }}
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
        </FooterToolbar>
        <Transfer
          SourceEntry={transferLine.DocEntry}
          SourceType="TI_Z026"
          modalVisible={transferModalVisible}
          {...transferParentMethods}
        />
      </Fragment>
    );
  }
}

export default orderLine;
