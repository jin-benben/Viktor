import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Tooltip,
  Select,
  DatePicker,
  Icon,
  Tag,
  message,
  Badge,
} from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import Organization from '@/components/Organization/multiple';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';
import ProcessorSelect from '@/components/Select/SalerPurchaser';
import Transfer from '@/components/Transfer';
import MyPageHeader from '../components/pageHeader';
import AttachmentModal from '@/components/Attachment/modal';
import TransferHistory from '@/components/TransferHistory';
import { getName } from '@/utils/utils';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ supplierQuotationSku, loading, global }) => ({
  supplierQuotationSku,
  global,
  loading: loading.models.supplierQuotationSku,
}))
@Form.create()
class supplierQuotationSku extends PureComponent {
  columns = [
    {
      title: '单号',
      width: 80,
      fixed: 'left',
      sorter: true,
      align: 'center',
      dataIndex: 'DocEntry',
      render: (text, recond) => (
        <Link target="_blank" to={`/purchase/TI_Z027/detail?DocEntry=${text}`}>
          {`${text}-${recond.LineID}`}
        </Link>
      ),
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
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      sorter: true,
      align: 'center',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '行状态',
      width: 200,
      dataIndex: 'LineStatus',
      align: 'center',
      sorter: true,
      render: (text, record) =>
        record.lastIndex ? null : (
          <Fragment>
            {record.Closed === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                {record.PriceRStatus === 'C' ? (
                  <Tag color="green">已返回</Tag>
                ) : (
                  <Tag color="gold">未返回</Tag>
                )}
                {record.SendEmailStatus === 'C' ? (
                  <Tag color="green">已发送</Tag>
                ) : (
                  <Tag color="gold">未发送</Tag>
                )}
                {text === 'C' ? <Tag color="green">已报价</Tag> : <Tag color="gold">未报价</Tag>}
              </Fragment>
            )}
          </Fragment>
        ),
    },
    {
      title: '供应商',
      width: 100,
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
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '规格(外)',
      dataIndex: 'ForeignParameters',
      width: 100,
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
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
      width: 100,
      sorter: true,
      align: 'center',
      dataIndex: 'Price',
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
      title: '询价交期',
      width: 120,
      sorter: true,
      align: 'center',
      dataIndex: 'InquiryDueDate',
    },
    {
      title: '参数',
      dataIndex: 'Parameters',
      width: 100,
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
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
      title: '采购员',
      width: 120,
      dataIndex: 'Owner',
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
      dataIndex: 'Saler',
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
      title: '联系人',
      width: 100,
      dataIndex: 'Contacts',
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
      sorter: true,
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
      title: '要求交期',
      width: 100,
      dataIndex: 'DueDate',
      align: 'center',
    },
    {
      title: '上一次价格',
      width: 100,
      dataIndex: 'LastPrice',
      align: 'center',
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
      width: 150,
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
      render: val => (
        <Ellipsis tooltip lines={1}>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '邮件发送',
      width: 100,
      align: 'center',
      dataIndex: 'SendEmailDateTime',
      render: val => (
        <Ellipsis tooltip lines={1}>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '采确认日期',
      width: 120,
      dataIndex: 'InquiryCfmDate',
      align: 'center',
      render: val => (
        <Ellipsis tooltip lines={1}>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '确认人',
      width: 120,
      dataIndex: 'InquiryCfmUser',
      align: 'center',
      render: val => {
        const {
          global: { TI_Z004 },
        } = this.props;
        return <span>{getName(TI_Z004, val)}</span>;
      },
    },

    {
      title: '创建日期',
      width: 120,
      sorter: true,
      align: 'center',
      dataIndex: 'CreateDate',
      render: val => (
        <Ellipsis tooltip lines={1}>
          {val}
        </Ellipsis>
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
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 80,
      render: (text, record) =>
        record.lastIndex ? null : (
          <Fragment>
            {record.TI_Z02604.length ? (
              <a onClick={() => this.lookLineAttachment(record)}>
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

  state = {
    expandForm: false,
    transferModalVisible: false,
    attachmentVisible: false,
    historyVisible: false,
    targetLine: {},
    selectedRows: [],
    prviewList: [],
    transferLine: '',
  };

  componentDidMount() {
    const {
      dispatch,
      global: { currentUser },
      supplierQuotationSku: { queryData },
    } = this.props;
    Object.assign(queryData.Content, { Owner: [currentUser.Owner] });
    dispatch({
      type: 'supplierQuotationSku/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Company', 'Purchaser', 'TI_Z004'],
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
      supplierQuotationSku: { queryData },
    } = this.props;
    const { field, order } = sorter;
    let sord = 'desc';
    if (order === 'ascend') {
      sord = 'asc';
    }
    dispatch({
      type: 'supplierQuotationSku/fetch',
      payload: {
        ...queryData,
        page: pagination.current,
        rows: pagination.pageSize,
        sidx: field || 'DocEntry',
        sord,
      },
    });
  };

  lookLineAttachment = record => {
    this.setState({ attachmentVisible: true, prviewList: record.TI_Z02604 });
  };

  handleSearch = e => {
    // 搜索
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let DocDateFrom = '';
      let DocDateTo = '';
      if (fieldsValue.dateArr && fieldsValue.dateArr.length) {
        DocDateFrom = moment(fieldsValue.dateArr[0]).format('YYYY-MM-DD');
        DocDateTo = moment(fieldsValue.dateArr[1]).format('YYYY-MM-DD');
      }

      let TransferDateTimeFrom = '';
      let TransferDateTimeTo = '';
      if (fieldsValue.TransferDate && fieldsValue.TransferDate.length) {
        TransferDateTimeFrom = moment(fieldsValue.TransferDate[0]).format('YYYY-MM-DD');
        TransferDateTimeTo = moment(fieldsValue.TransferDate[1]).format('YYYY-MM-DD');
      }
      delete fieldsValue.dateArr;
      delete fieldsValue.TransferDate;
      const queryData = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
        TransferDateTimeFrom,
        TransferDateTimeTo,
      };
      dispatch({
        type: 'supplierQuotationSku/fetch',
        payload: {
          Content: {
            SearchText: '',
            SearchKey: 'Name',
            ...queryData,
          },
          page: 1,
          rows: 30,
          sidx: 'DocEntry',
          sord: 'Desc',
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

  handleModalVisible = flag => {
    this.setState({
      transferModalVisible: !!flag,
      attachmentVisible: !!flag,
      historyVisible: !!flag,
    });
  };

  prviewTransferHistory = recond => {
    this.setState({
      targetLine: recond,
      historyVisible: true,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      supplierQuotationSku: { queryData },
      global: { ProcessorList },
    } = this.props;
    const { Closed, Owner } = queryData.Content;
    const { expandForm } = this.state;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem key="SearchText" {...formLayout} label="关键字">
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>

          <Col md={5} sm={24}>
            <FormItem key="LineStatus" {...formLayout} label="报价状态">
              {getFieldDecorator('LineStatus')(
                <Select placeholder="请选择">
                  <Option value="C">已报价</Option>
                  <Option value="O">未报价</Option>
                  <Option value="">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="SendEmailStatus" {...formLayout} label="邮件状态">
              {getFieldDecorator('SendEmailStatus')(
                <Select placeholder="请选择">
                  <Option value="C">已发送</Option>
                  <Option value="O">未发送</Option>
                  <Option value="">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="Owner" {...formLayout} label="采购员">
              {getFieldDecorator('Owner', { initialValue: Owner })(
                <SalerPurchaser initialValue={Owner} />
              )}
            </FormItem>
          </Col>
          {expandForm ? (
            <Fragment>
              <Col md={5} sm={24}>
                <FormItem key="Closed" {...formLayout} label="关闭状态">
                  {getFieldDecorator('Closed', { initialValue: Closed })(
                    <Select placeholder="请选择关闭状态">
                      <Option value="Y">已关闭</Option>
                      <Option value="N">未关闭</Option>
                      <Option value="">全部</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem key="PriceRStatus" {...formLayout} label=" 价格状态">
                  {getFieldDecorator('PriceRStatus')(
                    <Select placeholder="请选择">
                      <Option value="C">已返回</Option>
                      <Option value="O">未返回</Option>
                      <Option value="">全部</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem label="单据日期" {...formLayout}>
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
                <FormItem {...formLayout} label="客询价单">
                  <FormItem className="lineFormItem" key="BaseEntryFrom">
                    {getFieldDecorator('BaseEntryFrom')(<Input placeholder="开始单号" />)}
                  </FormItem>
                  <span className="lineFormItemCenter">-</span>
                  <FormItem className="lineFormItem" key="BaseEntryTo">
                    {getFieldDecorator('BaseEntryTo')(<Input placeholder="结束单号" />)}
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
                  {getFieldDecorator('Processor')(
                    <ProcessorSelect data={ProcessorList} type="Code" />
                  )}
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
      supplierQuotationSku: { supplierQuotationSkuList, pagination },
      loading,
      location,
    } = this.props;
    const {
      transferModalVisible,
      transferLine,
      attachmentVisible,
      prviewList,
      targetLine,
      historyVisible,
    } = this.state;

    return (
      <Fragment>
        <Card bordered={false}>
          <MyPageHeader {...location} />
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: supplierQuotationSkuList }}
              pagination={pagination}
              rowKey="Key"
              scroll={{ x: 3620 }}
              rowSelection={{
                type: 'radio',
                onSelectRow: this.onSelectRow,
              }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <FooterToolbar>
          <Button
            icon="plus"
            style={{ marginLeft: 8 }}
            type="primary"
            onClick={() => router.push('/purchase/TI_Z027/edit')}
          >
            新建
          </Button>
          <Button type="primary" onClick={this.toTransfer}>
            转移
          </Button>
          <Transfer
            SourceEntry={transferLine.DocEntry}
            SourceType="TI_Z027"
            modalVisible={transferModalVisible}
            handleModalVisible={this.handleModalVisible}
          />
        </FooterToolbar>
        <AttachmentModal
          attachmentVisible={attachmentVisible}
          prviewList={prviewList}
          handleModalVisible={this.handleModalVisible}
        />
        <TransferHistory
          modalVisible={historyVisible}
          handleModalVisible={this.handleModalVisible}
          BaseEntry={targetLine.BaseEntry || ''}
          BaseLineID={targetLine.BaseLineID || ''}
        />
      </Fragment>
    );
  }
}

export default supplierQuotationSku;
