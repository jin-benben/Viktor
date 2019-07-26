import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Tag,
  Select,
  DatePicker,
  Icon,
  message,
  Tooltip,
  Badge,
  Spin,
} from 'antd';
import Link from 'umi/link';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import StandardTable from '@/components/StandardTable';
import NeedAskPrice from '../components/needAskPrice';
import Transfer from '@/components/Transfer';
import Organization from '@/components/Organization/multiple';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';
import ProcessorSelect from '@/components/Select/SalerPurchaser';
import Comparison from '@/components/Comparison';
import MyPageHeader from '../components/pageHeader';
// import AttachmentModal from '@/components/Attachment/modal';
import TransferHistory from '@/components/TransferHistory';

import { getName } from '@/utils/utils';

const AttachmentModal = React.lazy(() => import('@/components/Attachment/modal'));
const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ SalesQuotationSku, loading, global }) => ({
  SalesQuotationSku,
  global,
  loading: loading.models.SalesQuotationSku,
}))
@Form.create()
class SalesQuotationSku extends PureComponent {
  state = {
    expandForm: false,
    needmodalVisible: false,
    transferModalVisible: false,
    attachmentVisible: false,
    historyVisible: false,
    targetLine: {},
    prviewList: [],
    transferLine: {},
    selectedRows: [],
  };

  columns = [
    {
      title: '单号',
      width: 100,
      fixed: 'left',
      dataIndex: 'DocEntry',
      sorter: true,
      align: 'center',
      render: (text, recond) => (
        <Link target="_blank" to={`/sellabout/TI_Z029/detail?DocEntry=${text}`}>
          {`${text}-${recond.LineID}`}
        </Link>
      ),
    },
    {
      title: '状态',
      width: 140,
      dataIndex: 'LineStatus',
      sorter: true,
      align: 'center',
      render: (text, record) => (
        <Fragment>
          {record.Closed === 'Y' ? (
            <Tag color="red">已关闭</Tag>
          ) : (
            <Fragment>
              {record.ApproveSts === 'Y' ? (
                <Tag color="green">已发送</Tag>
              ) : (
                <Tag color="gold">未发送</Tag>
              )}
              {text === 'C' ? <Tag color="green">已合同</Tag> : <Tag color="gold">未合同</Tag>}
            </Fragment>
          )}
        </Fragment>
      ),
    },
    {
      title: '单据日期',
      width: 100,
      dataIndex: 'DocDate',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '客户',
      width: 150,
      dataIndex: 'CardName',
      sorter: true,
      align: 'center',
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
      title: '数量',
      width: 100,
      dataIndex: 'Quantity',
      align: 'center',
      render: (text, record) => <span>{`${text}-${record.Unit}`}</span>,
    },
    {
      title: '建议价格',
      width: 100,
      dataIndex: 'AdvisePrice',
      align: 'center',
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
    },
    {
      title: '总费用',
      width: 100,
      align: 'center',
      dataIndex: 'OtherTotal',
    },
    {
      title: '费用备注',
      width: 100,
      align: 'center',
      dataIndex: 'OtherComment',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '行利润',
      width: 100,
      align: 'center',
      dataIndex: 'ProfitLineTotal',
    },
    {
      title: '报价交期',
      width: 100,
      dataIndex: 'DueDate',
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
      width: 150,
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
      width: 100,
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
        return <span>{getName(HS, text)}</span>;
      },
    },
    {
      title: '税率',
      width: 80,
      dataIndex: 'HSVatRate',
      align: 'center',
      render: (text, record) => <span>{`${text}-${record.HSVatRateOther}`}</span>,
    },
    {
      title: '备注',
      dataIndex: 'LineComment',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {text} {record.ForeignParameters}
        </Ellipsis>
      ),
    },
    {
      title: '包装',
      width: 100,
      dataIndex: 'Package',
      align: 'center',
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {text} {record.ForeignParameters}
        </Ellipsis>
      ),
    },
    {
      title: '名称(外)',
      dataIndex: 'ForeignName',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {text} {record.ForeignParameters}
        </Ellipsis>
      ),
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
      title: '要求名称',
      width: 80,
      dataIndex: 'CustomerName',
      align: 'center',
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {text} {record.ForeignParameters}
        </Ellipsis>
      ),
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
      title: '创建日期',
      width: 100,
      dataIndex: 'CreateDate',
      sorter: true,
      align: 'center',
      render: val => (
        <Ellipsis tooltip lines={1}>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '客询价单',
      width: 80,
      dataIndex: 'BaseEntry',
      render: (val, record) => (
        <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${record.BaseEntry}`}>
          {`${val}-${record.BaseLineID}`}
        </Link>
      ),
    },
    {
      title: '销合单号',
      width: 80,
      align: 'center',
      dataIndex: 'ContractEntry',
      render: (text, recond) => (
        <Link target="_blank" to={`/sellabout/TI_Z030/detail?DocEntry=${text}`}>
          {`${text}-${recond.ContractLine}`}
        </Link>
      ),
    },
    {
      title: '销订单号',
      align: 'center',
      dataIndex: 'SoEntry',
      render: (text, recond) => (
        <Link target="_blank" to={`/sellabout/orderdetail?DocEntry=${text}`}>
          {`${text}-${recond.SoLine}`}
        </Link>
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
              <Badge count={record.TI_Z02604.length} title="查看附件" className="attachBadge" />
            </a>
          ) : (
            ''
          )}
          <a onClick={() => this.prviewTransferHistory(record)}>
            <Icon
              title="查看转移记录"
              type="history"
              style={{ color: '#08c', marginLeft: 5, fontSize: 15 }}
            />
          </a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      global: { currentUser },
      SalesQuotationSku: { queryData },
    } = this.props;
    Object.assign(queryData.Content, { Owner: [currentUser.Owner] });
    dispatch({
      type: 'SalesQuotationSku/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Purchaser', 'WhsCode', 'TI_Z042', 'TI_Z004'],
        },
      },
    });
    dispatch({
      type: 'global/getAuthority',
    });
  }

  lookLineAttachment = record => {
    this.setState({ attachmentVisible: true, prviewList: record.TI_Z02604 });
  };

  handleStandardTableChange = (pagination, filters, sorter) => {
    const {
      dispatch,
      SalesQuotationSku: { queryData },
    } = this.props;
    const { field, order } = sorter;
    let sord = 'desc';
    if (order === 'ascend') {
      sord = 'asc';
    }
    dispatch({
      type: 'SalesQuotationSku/fetch',
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
      let InquiryCfmDateFrom = '';
      let InquiryCfmDateTo = '';
      if (fieldsValue.InquiryCfmDate && fieldsValue.InquiryCfmDate.length) {
        InquiryCfmDateFrom = moment(fieldsValue.InquiryCfmDate[0]).format('YYYY-MM-DD');
        InquiryCfmDateTo = moment(fieldsValue.InquiryCfmDate[1]).format('YYYY-MM-DD');
      }
      let TransferDateTimeFrom = '';
      let TransferDateTimeTo = '';
      if (fieldsValue.TransferDate && fieldsValue.TransferDate.length) {
        TransferDateTimeFrom = moment(fieldsValue.TransferDate[0]).format('YYYY-MM-DD');
        TransferDateTimeTo = moment(fieldsValue.TransferDate[1]).format('YYYY-MM-DD');
      }

      delete fieldsValue.dateArr;
      delete fieldsValue.InquiryCfmDate;
      delete fieldsValue.TransferDate;
      const queryData = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
        TransferDateTimeFrom,
        TransferDateTimeTo,
        InquiryCfmDateFrom,
        InquiryCfmDateTo,
      };
      dispatch({
        type: 'SalesQuotationSku/fetch',
        payload: {
          Content: {
            SearchText: '',
            QueryType: '1',
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

  toConfrim = () => {
    const { selectedRows } = this.state;
    if (!selectedRows.length) {
      message.warning('请先选择');
    }
    this.setState({ needmodalVisible: true });
  };

  // 发送需报价
  submitNeedLine = selectedRows => {
    const {
      dispatch,
      SalesQuotationSku: { queryData },
    } = this.props;
    // eslint-disable-next-line camelcase
    const TI_Z02908RequestItem = selectedRows.map(item => ({
      DocEntry: item.DocEntry,
      LineID: item.LineID,
      UpdateTimestamp: item.UpdateTimestamp,
    }));
    dispatch({
      type: 'SalesQuotationSku/confirm',
      payload: {
        Content: {
          TI_Z02908RequestItem,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('提交成功');
          this.setState({ needmodalVisible: false });
          dispatch({
            type: 'SalesQuotationSku/fetch',
            payload: {
              ...queryData,
            },
          });
        }
      },
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

  prviewTransferHistory = recond => {
    this.setState({
      targetLine: recond,
      historyVisible: true,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      needmodalVisible: !!flag,
      transferModalVisible: !!flag,
      attachmentVisible: !!flag,
      historyVisible: !!flag,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      SalesQuotationSku: { queryData },
      global: { OSLPList },
    } = this.props;
    const { Owner } = queryData.Content;
    const { expandForm } = this.state;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem key="SearchText" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>

          <Col md={5} sm={24}>
            <FormItem key="ApproveSts" {...formLayout} label="确认状态">
              {getFieldDecorator('ApproveSts')(
                <Select placeholder="请选择">
                  <Option value="Y">已发送</Option>
                  <Option value="N">未发送</Option>
                  <Option value="">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="LineStatus" {...formLayout} label="合同状态">
              {getFieldDecorator('LineStatus')(
                <Select placeholder="请选择">
                  <Option value="C">已合同</Option>
                  <Option value="O">未合同</Option>
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
          {expandForm ? (
            <Fragment>
              <Col md={5} sm={24}>
                <FormItem label="日期" {...formLayout}>
                  {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                    <RangePicker style={{ width: '100%' }} />
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
              <Col md={5} sm={24}>
                <FormItem key="Closed" {...formLayout}>
                  {getFieldDecorator('Closed')(
                    <Select placeholder="请选择关闭状态">
                      <Option value="Y">已关闭</Option>
                      <Option value="N">未关闭</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem key="DeptList" {...this.formLayout} label="部门">
                  {getFieldDecorator('DeptList')(<Organization />)}
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
                <Button
                  icon="plus"
                  style={{ marginLeft: 8 }}
                  type="primary"
                  onClick={() => router.push('/sellabout/TI_Z029/add')}
                >
                  新建
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
      SalesQuotationSku: { SalesQuotationSkuList, pagination },
      loading,
      location,
    } = this.props;
    const {
      needmodalVisible,
      selectedRows,
      transferModalVisible,
      transferLine,
      attachmentVisible,
      prviewList,
      historyVisible,
      targetLine,
    } = this.state;
    const needParentMethods = {
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
              data={{ list: SalesQuotationSkuList }}
              pagination={pagination}
              scroll={{ x: 4000 }}
              rowKey="Key"
              columns={this.columns}
              rowSelection={{
                onSelectRow: this.onSelectRow,
              }}
              selectedRows={selectedRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <NeedAskPrice data={selectedRows} {...needParentMethods} modalVisible={needmodalVisible} />

        <Transfer
          SourceEntry={transferLine.DocEntry}
          SourceType="TI_Z029"
          modalVisible={transferModalVisible}
          handleModalVisible={this.handleModalVisible}
        />
        <React.Suspense fallback={<Spin />}>
          <AttachmentModal
            attachmentVisible={attachmentVisible}
            prviewList={prviewList}
            handleModalVisible={this.handleModalVisible}
          />
        </React.Suspense>
        <FooterToolbar>
          <Button onClick={this.toConfrim} type="primary">
            确认销售报价
          </Button>
          <Button style={{ marginLeft: 8 }} type="primary" onClick={this.toTransfer}>
            转移
          </Button>
          <Comparison
            type="TI_Z029"
            rowkey="Key"
            dataSource={selectedRows.length ? selectedRows : SalesQuotationSkuList}
          />
        </FooterToolbar>
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

export default SalesQuotationSku;
