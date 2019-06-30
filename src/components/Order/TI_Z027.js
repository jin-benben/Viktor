import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Select, DatePicker, Icon, Tag } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import { getName } from '@/utils/utils';
import request from '@/utils/request';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loading, global }) => ({
  global,
  loading: loading.models.global,
}))
@Form.create()
class SupplierAsk extends PureComponent {
  state = {
    expandForm: false,
    queryData: {
      Content: {
        DocDateFrom: '',
        DocDateTo: '',
        QueryType: '',
        QueryKey: '',
        LineStatus: '',
        Closed: 'N',
        SearchText: '',
        SearchKey: '',
      },
      page: 1,
      rows: 30,
      sidx: 'DocEntry',
      sord: 'Desc',
    },
    pagination: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['30', '60', '90'],
      total: 0,
      pageSize: 30,
      current: 1,
    },
    orderList: [],
  };

  columns = [
    {
      title: '单号',
      width: 80,
      dataIndex: 'DocEntry',
      render: (text, record) => (
        <Link target="_blank" to={`/sellabout/TI_Z027/detail?DocEntry=${text}`}>
          {`${text}-${record.LineID}`}
        </Link>
      ),
    },
    {
      title: '单据日期',
      width: 100,
      dataIndex: 'DocDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '询价号',
      width: 80,
      dataIndex: 'BaseEntry',
      render: (text, record) => (
        <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${text}`}>
          {`${text}-${record.BaseLineID}`}
        </Link>
      ),
    },
    {
      title: '单据状态',
      dataIndex: 'LineStatus',
      width: 140,
      render: (text, record) => (
        <Fragment>
          {record.Closed === 'Y' ? (
            <Tag color="red">已关闭</Tag>
          ) : (
            <Fragment>
              {record.PriceRStatus === 'O' ? (
                <Tag color="gold">未返回</Tag>
              ) : (
                <Tag color="green">已返回</Tag>
              )}
              {record.LineStatus === 'O' ? (
                <Tag color="gold">未询价</Tag>
              ) : (
                <Tag color="green">已询价</Tag>
              )}
            </Fragment>
          )}
        </Fragment>
      ),
    },
    {
      title: '供应商',
      width: 150,
      dataIndex: 'CardName',
      render: (text, recond) => (
        <Link target="_blank" to={`/main/TI_Z006/detail?Code=${recond.CardCode}`}>
          {`${recond.CardCode}-${text}`}
        </Link>
      ),
    },
    {
      title: '物料',
      dataIndex: 'SKUName',
      render: (text, recond) =>
        recond.SKU ? (
          <Link target="_blank" to={`/main/product/TI_Z009/TI_Z00903?Code=${recond.SKU}`}>
            {`${text}-${recond.SKU}`}
          </Link>
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: '数量',
      width: 100,
      dataIndex: 'Quantity',
      render: (text, recond) => <span> {`${text}(${recond.Unit})`}</span>,
    },
    {
      title: '价格',
      width: 100,
      dataIndex: 'Price',
      render: (text, recond) => <span> {`${text}(${recond.Currency})`}</span>,
    },
    {
      title: '币种',
      width: 100,
      dataIndex: 'Currency',
      render: (text, recond) => <span> {`${text}(${recond.DocRate})`}</span>,
    },
    {
      title: '行总计',
      width: 100,
      dataIndex: 'LineTotal',
      render: (text, recond) => <span> {`${text}(${recond.Currency})`}</span>,
    },
    {
      title: '行本总计',
      width: 100,
      dataIndex: 'InquiryLineTotalLocal',
    },
    {
      title: '行备注',
      width: 100,
      dataIndex: 'LineComment',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '采购员',
      width: 80,
      dataIndex: 'Purchaser',
    },
    {
      title: '销售员',
      width: 80,
      dataIndex: 'Sales',
    },
  ];

  componentDidMount() {
    const { QueryType, QueryKey, dispatch } = this.props;
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Curr'],
        },
      },
    });

    const queryData = {
      Content: {
        DocDateFrom: '',
        DocDateTo: '',
        QueryType,
        QueryKey,
        LineStatus: '',
        Closed: 'N',
        SearchText: '',
        SearchKey: '',
      },
      page: 1,
      rows: 30,
      sidx: 'DocEntry',
      sord: 'Desc',
    };
    this.setState(
      {
        queryData,
      },
      () => {
        this.getOrder(queryData);
      }
    );
  }

  getOrder = async params => {
    const {
      global: { Curr },
    } = this.props;
    const response = await request('/Report/TI_Z027/TI_Z02708', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    if (response && response.Status === 200) {
      const { pagination } = this.state;
      if (response.Content) {
        const { rows, records, page } = response.Content;
       
        const orderList = rows.map(item => {
          const newItem = item;
          newItem.Currency = getName(Curr, newItem.Currency);
          return newItem;
        });
        this.setState({
          orderList,
          pagination: { ...pagination, total: records, current: page },
        });
      }else{
        this.setState({
          orderList:[],
          pagination: { ...pagination, total: 0, current: 1 },
        });
      }
    }
  };

  handleStandardTableChange = pagination => {
    const { queryData } = this.state;
    const { current, pageSize } = pagination;
    Object.assign(queryData, { page: current, rows: pageSize });
    this.setState(
      {
        queryData,
      },
      () => {
        this.getOrder(queryData);
      }
    );
  };

  handleSearch = e => {
    // 搜索
    e.preventDefault();
    const { form } = this.props;
    const { queryData } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let DocDateFrom;
      let DocDateTo;
      if (fieldsValue.dateArr) {
        DocDateFrom = moment(fieldsValue.dateArr[0]).format('YYYY-MM-DD');
        DocDateTo = moment(fieldsValue.dateArr[1]).format('YYYY-MM-DD');
      }
      // eslint-disable-next-line no-param-reassign
      delete fieldsValue.dateArr;
      const queryDataContent = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
      };
      Object.assign(queryData.Content, queryDataContent);
      Object.assign(queryData, { page: 1, rows: 30 });
      this.setState(
        {
          queryData,
        },
        () => {
          this.getOrder(queryData);
        }
      );
    });
  };

  toggleForm = () => {
    // 是否展开
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
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
          <Col md={4} sm={24}>
            <FormItem key="Sales" {...formLayout}>
              {getFieldDecorator('Sales')(<Input placeholder="请输入销售采购名字" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          {expandForm ? (
            <Fragment>
              <Col md={4} sm={24}>
                <FormItem key="Closed" {...formLayout}>
                  {getFieldDecorator('Closed')(
                    <Select style={{ width: '100%' }} placeholder="请选择关闭状态">
                      <Option value="Y">已关闭</Option>
                      <Option value="N">未关闭</Option>
                      <Option value="">全部</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={24}>
                <FormItem key="LineStatus" {...formLayout}>
                  {getFieldDecorator('LineStatus')(
                    <Select style={{ width: '100%' }} placeholder="请选择采购询价状态">
                      <Option value="O">未清</Option>
                      <Option value="C">已清</Option>
                      <Option value="">全部</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Fragment>
          ) : null}
          <Col md={5} sm={24}>
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
    const { loading, QueryType } = this.props;
    const { pagination, orderList } = this.state;
    if (QueryType === '3') {
      this.columns = this.columns.filter(item => item.dataIndex !== 'CardName');
    }
    if (QueryType === '2') {
      this.columns = this.columns.filter(item => item.dataIndex !== 'SKUName');
    }
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: orderList }}
              pagination={pagination}
              rowKey="key"
              columns={this.columns}
              scroll={{ x: 1500, y: 800 }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default SupplierAsk;
