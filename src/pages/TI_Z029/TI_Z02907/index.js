import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Divider, Select, DatePicker, Icon } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import MDMCommonality from '@/components/Select';
import DocEntryFrom from '@/components/DocEntryFrom';
import { getName } from '@/utils/utils';

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
  };

  columns = [
    {
      title: '单号',
      width: 50,
      fixed: 'left',
      dataIndex: 'DocEntry',
    },
    {
      title: '行号',
      width: 50,
      dataIndex: 'LineID',
    },
    {
      title: '单据日期',
      width: 100,
      dataIndex: 'DocDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '创建日期',
      width: 100,
      dataIndex: 'CreateDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '确认状态',
      dataIndex: 'LineStatus',
      width: 100,
      render: (text, record) => <span>确认状态{record.LineStatus}</span>,
    },
    {
      title: '合同状态',
      dataIndex: 'LineStatus',
      width: 100,
      render: (text, record) => <span>确认状态{record.LineStatus}</span>,
    },
    {
      title: '客户',
      width: 150,
      dataIndex: 'CardName',
    },
    {
      title: '客户参考号',
      width: 150,
      dataIndex: 'NumAtCard',
    },
    {
      title: '联系人',
      width: 100,
      dataIndex: 'Contacts',
    },
    {
      title: '联系方式',
      width: 100,
      dataIndex: 'contact',
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {record.CellphoneNO}
          {record.PhoneNO ? <Divider type="vertical" /> : null}
          {record.PhoneNO}
        </Ellipsis>
      ),
    },
    {
      title: 'SKU',
      width: 100,
      dataIndex: 'SKU',
    },
    {
      title: '产品描述',
      width: 150,
      dataIndex: 'SKUName',
    },
    {
      title: '品牌',
      width: 100,
      dataIndex: 'BrandName',
    },
    {
      title: '名称',
      width: 100,
      dataIndex: 'ProductName',
    },
    {
      title: '型号',
      width: 100,
      dataIndex: 'ManufactureNO',
    },
    {
      title: '参数',
      width: 100,
      dataIndex: 'Parameters',
    },
    {
      title: '包装',
      width: 100,
      dataIndex: 'Package',
    },

    {
      title: '数量',
      width: 100,
      dataIndex: 'Quantity',
    },
    {
      title: '单位',
      width: 100,
      dataIndex: 'Unit',
    },
    {
      title: '要求交期',
      dataIndex: 'DueDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '询价价格',
      width: 100,
      dataIndex: 'InquiryPrice',
    },
    {
      title: '价格',
      width: 100,
      dataIndex: 'Price',
    },
    {
      title: '其他成本',
      width: 100,
      dataIndex: 'OtherTotal',
    },
    // {
    //   title: '询价最终交期',
    //   width:100,
    //   dataIndex: 'InquiryDueDate',
    //   render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    // },
    {
      title: '行备注',
      width: 100,
      dataIndex: 'LineComment',
    },
    // {
    //   title: '采购行总计',
    //   width:150,
    //   dataIndex: 'InquiryDocTotal',
    // },
    // {
    //   title: '销售行总计',
    //   width:150,
    //   dataIndex: 'DocTotal',
    // },
    // {
    //   title: '采购员',
    //   width:100,
    //   dataIndex: 'Purchase',
    //   render: text => {
    //     const { global:{Purchaser} } = this.props;
    //     return <span>{getName(Purchaser, text)}</span>;
    //   },
    // },
    // {
    //   title: '所有人',
    //   dataIndex: 'Owner',
    //   render: text => {
    //     const { global:{Saler} } = this.props;
    //     return <span>{getName(Saler, text)}</span>;
    //   },
    // },
  ];

  componentDidMount() {
    const {
      dispatch,
      SalesQuotationSku: { queryData },
    } = this.props;
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
          CodeList: ['Saler', 'Purchaser'],
        },
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      SalesQuotationSku: { queryData },
    } = this.props;
    dispatch({
      type: 'SalesQuotationSku/fetch',
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
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let DocDateFrom;
      let DocDateTo;
      if (fieldsValue.dateArr) {
        DocDateFrom = moment(fieldsValue.dateArr[0]).format('YYYY-MM-DD');
        DocDateTo = moment(fieldsValue.dateArr[1]).format('YYYY-MM-DD');
      }
      const queryData = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
        ...fieldsValue.orderNo,
      };
      dispatch({
        type: 'SalesQuotationSku/fetch',
        payload: {
          Content: {
            SearchText: '',
            SearchKey: 'Name',
            ...queryData,
          },
          page: 1,
          rows: 30,
          sidx: 'Code',
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

  handleOnRow = record => ({
    // 详情or修改
    onClick: () => router.push(`/TI_Z029/edit?DocEntry=${record.DocEntry}`),
  });

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      global: { Saler, Purchaser },
    } = this.props;
    const { expandForm } = this.state;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 10 },
      },
    };
    const searchFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <Form onSubmit={this.handleSearch} {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem key="SearchText" label="客户名称" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入客户名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="日期" {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="SDocStatus" {...formLayout} label="合同状态">
              {getFieldDecorator('SDocStatus')(
                <Select placeholder="请选择">
                  <Option value="C">已报价</Option>
                  <Option value="O">未报价</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="LineStatus" {...formLayout} label="确认状态">
              {getFieldDecorator('LineStatus')(
                <Select placeholder="请选择">
                  <Option value="C">已报价</Option>
                  <Option value="O">未报价</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          {expandForm ? (
            <Fragment>
              <Col md={6} sm={24}>
                <FormItem key="orderNo" {...formLayout} label="单号">
                  {getFieldDecorator('orderNo', {
                    initialValue: { DocEntryFrom: '', DocEntryTo: '' },
                  })(<DocEntryFrom />)}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem label="所有者" {...formLayout}>
                  {getFieldDecorator('Owner')(<MDMCommonality data={Saler} />)}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem label="采购" {...formLayout}>
                  {getFieldDecorator('Purchaser')(<MDMCommonality data={Purchaser} />)}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem key="Closed" {...formLayout} label="关闭状态">
                  {getFieldDecorator('Closed')(
                    <Select placeholder="请选择">
                      <Option value="Y">已关闭</Option>
                      <Option value="N">未关闭</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>

              <Col md={6} sm={24}>
                <FormItem key="OrderType" {...formLayout} label="订单类型">
                  {getFieldDecorator('OrderType')(
                    <Select placeholder="请选择">
                      <Option value="1">正常订单</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Fragment>
          ) : null}
          <Col md={6} sm={24}>
            <FormItem key="searchBtn" {...searchFormItemLayout}>
              <span className="submitButtons">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                  icon="plus"
                  style={{ marginLeft: 8 }}
                  type="primary"
                  onClick={() => router.push('/TI_Z029/edit')}
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
    } = this.props;
    return (
      <Fragment>
        <Card title="销售报价单物料查询" bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: SalesQuotationSkuList }}
              pagination={pagination}
              scroll={{ x: 2500 }}
              rowKey="Key"
              columns={this.columns}
              onRow={this.handleOnRow}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default SalesQuotationSku;
