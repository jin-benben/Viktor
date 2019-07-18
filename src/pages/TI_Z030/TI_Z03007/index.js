import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Tag, Select, DatePicker, Icon, Badge } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import MyPageHeader from '../components/pageHeader';
import Organization from '@/components/Organization/multiple';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';
import AttachmentModal from '@/components/Attachment/modal';
import { getName } from '@/utils/utils';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ agreementLine, loading, global }) => ({
  agreementLine,
  global,
  loading: loading.models.agreementLine,
}))
@Form.create()
class AgreementLine extends PureComponent {
  state = {
    expandForm: false,
    attachmentVisible: false,
    prviewList: [],
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
        <Link target="_blank" to={`/sellabout/TI_Z030/detail?DocEntry=${text}`}>
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
      render: (text, record) =>
        record.lastIndex ? null : (
          <Fragment>
            {record.Closed === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                {record.ApproveSts === 'Y' ? (
                  <Tag color="green">已确认</Tag>
                ) : (
                  <Tag color="gold">未确认</Tag>
                )}
                {text === 'C' ? <Tag color="green">已订单</Tag> : <Tag color="gold">未订单</Tag>}
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
      title: '数量',
      width: 100,
      dataIndex: 'Quantity',
      align: 'center',
      render: (text, record) => <span>{`${text}(${record.Unit})`}</span>,
    },
    {
      title: '建议价格',
      width: 100,
      dataIndex: 'AdvisePrice',
      align: 'center',
    },
    {
      title: '价格',
      width: 100,
      dataIndex: 'Price',
      sorter: true,
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
      render: (text, record) =>
        record.lastIndex ? null : (
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
      title: '订单交期',
      width: 100,
      dataIndex: 'DueDate',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '报价交期',
      width: 120,
      dataIndex: 'DueDateComment',
      align: 'center',
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
      width: 120,
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
      width: 120,
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
      title: '创建日期',
      width: 100,
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
      title: '销报单号',
      width: 100,
      align: 'center',
      dataIndex: 'QuotationEntry',
      render: (text, recond) =>
        text ? (
          <Link target="_blank" to={`/sellabout/TI_Z029/detail?DocEntry=${text}`}>
            {`${text}-${recond.QuotationLineID}`}
          </Link>
        ) : (
          ''
        ),
    },
    {
      title: '销订单号',
      align: 'center',
      width: 100,
      dataIndex: 'SoEntry',
      render: (text, recond) =>
        text ? (
          <Link target="_blank" to={`/sellabout/orderdetail?DocEntry=${text}`}>
            {`${text}-${recond.SoLineID}`}
          </Link>
        ) : (
          ''
        ),
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 50,
      render: (text, record) =>
        record.TI_Z02604.length ? (
          <Badge count={record.TI_Z02604.length} className="attachBadge">
            <Icon
              title="预览"
              type="eye"
              onClick={() => this.lookLineAttachment(record)}
              style={{ color: '#08c', marginRight: 5 }}
            />
          </Badge>
        ) : (
          ''
        ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      global: { currentUser },
      agreementLine: { queryData },
    } = this.props;
    Object.assign(queryData.Content, { Owner: [currentUser.Owner] });
    dispatch({
      type: 'agreementLine/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Purchaser', 'WhsCode', 'TI_Z042'],
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
      agreementLine: { queryData },
    } = this.props;
    const { field, order } = sorter;
    let sord = 'desc';
    if (order === 'ascend') {
      sord = 'asc';
    }
    dispatch({
      type: 'agreementLine/fetch',
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
      let DocDateFrom;
      let DocDateTo;
      if (fieldsValue.dateArr) {
        DocDateFrom = moment(fieldsValue.dateArr[0]).format('YYYY-MM-DD');
        DocDateTo = moment(fieldsValue.dateArr[1]).format('YYYY-MM-DD');
      }

      delete fieldsValue.dateArr;

      const queryData = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
      };
      dispatch({
        type: 'agreementLine/fetch',
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

  handleModalVisible = flag => {
    this.setState({
      attachmentVisible: !!flag,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      agreementLine: { queryData },
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
          <Col md={4} sm={24}>
            <FormItem key="SearchText" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
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
            <FormItem key="DocStatus" {...formLayout} label="订单状态">
              {getFieldDecorator('DocStatus')(
                <Select placeholder="请选择">
                  <Option value="C">已订单</Option>
                  <Option value="O">未订单</Option>
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
                <FormItem key="ApproveSts" {...formLayout} label="确认状态">
                  {getFieldDecorator('ApproveSts')(
                    <Select placeholder="请选择">
                      <Option value="Y">已确认</Option>
                      <Option value="N">未确认</Option>
                      <Option value="">全部</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={24}>
                <FormItem key="Closed" {...formLayout}>
                  {getFieldDecorator('Closed', { initialValue: 'N' })(
                    <Select placeholder="请选择关闭状态">
                      <Option value="Y">已关闭</Option>
                      <Option value="N">未关闭</Option>
                      <Option value="">全部</Option>
                    </Select>
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
                  onClick={() => router.push('/sellabout/TI_Z030/add')}
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
      agreementLine: { agreementLineList, pagination },
      loading,
      location,
    } = this.props;
    const { attachmentVisible, prviewList } = this.state;
    return (
      <Card bordered={false}>
        <MyPageHeader {...location} />
        <div className="tableList">
          <div className="tableListForm">{this.renderSimpleForm()}</div>
          <StandardTable
            loading={loading}
            data={{ list: agreementLineList }}
            pagination={pagination}
            scroll={{ x: 3700 }}
            rowKey="Key"
            columns={this.columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
        <AttachmentModal
          attachmentVisible={attachmentVisible}
          prviewList={prviewList}
          handleModalVisible={this.handleModalVisible}
        />
      </Card>
    );
  }
}

export default AgreementLine;
