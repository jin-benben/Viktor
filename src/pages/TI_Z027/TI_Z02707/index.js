import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Divider, Select, DatePicker, Icon } from 'antd';
import StandardTable from '@/components/StandardTable';
import Staffs from '@/components/Staffs';
import DocEntryFrom from '@/components/DocEntryFrom';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ supplierQuotationSku, loading }) => ({
  supplierQuotationSku,
  loading: loading.models.supplierQuotationSku,
}))
@Form.create()
class supplierQuotationSku extends PureComponent {
  state = {
    expandForm: false,
  };

  columns = [
    {
      title: '单号',
      width: 50,
      dataIndex: 'DocEntry',
    },
    {
      title: '行号',
      width: 50,
      dataIndex: 'LineID',
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '创建日期',
      dataIndex: 'CreateDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '单据状态',
      dataIndex: 'Status',
      render: (text, record) => (
        <Fragment>
          <span>销售报价状态{record.SDocStatus}</span>
          <span>关闭状态{record.Closed}</span>
          <span>采购询价确认状态{record.PDocStatus}</span>
        </Fragment>
      ),
    },
    {
      title: '供应商',
      dataIndex: 'CardName',
    },
    {
      title: '联系人',
      dataIndex: 'Contacts',
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      render: (text, record) => (
        <span>
          {record.CellphoneNO}
          {record.CellphoneNO ? <Divider type="vertical" /> : null}
          {record.PhoneNO}
        </span>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'SKU',
    },
    {
      title: '产品描述',
      dataIndex: 'SKUName',
    },
    {
      title: '品牌',

      dataIndex: 'BrandName',
    },
    {
      title: '名称',
      dataIndex: 'ProductName',
    },
    {
      title: '型号',

      dataIndex: 'ManufactureNO',
    },
    {
      title: '参数',

      dataIndex: 'Parameters',
    },
    {
      title: '包装',

      dataIndex: 'Package',
    },
    {
      title: '采购员',

      dataIndex: 'Purchaser',
    },
    {
      title: '数量',

      dataIndex: 'Quantity',
    },
    {
      title: '单位',
      dataIndex: 'Unit',
    },
    {
      title: '要求交期',
      dataIndex: 'DueDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '价格',
      dataIndex: 'Price',
    },
    {
      title: '询价交期',
      dataIndex: 'InquiryDueDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '行备注',
      dataIndex: 'LineComment',
    },
    {
      title: '询价行总计(外币)',
      dataIndex: 'LineTotal',
    },
    {
      title: '询价行总计(本币)',
      dataIndex: 'InquiryLineTotalLocal',
    },
    {
      title: '采购员',
      dataIndex: 'Purchase',
    },
    {
      title: '所有人',
      dataIndex: 'Owner',
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      supplierQuotationSku: { queryData },
    } = this.props;
    console.log(queryData);
    dispatch({
      type: 'supplierQuotationSku/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      supplierQuotationSku: { queryData },
    } = this.props;
    dispatch({
      type: 'supplierQuotationSku/fetch',
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
        type: 'supplierQuotationSku/fetch',
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
    onClick: () => router.push(`/TI_Z027/edit?DocEntry=${record.DocEntry}`),
  });

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
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
            <FormItem key="SearchText" label="供应商名称" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入供应商名称" />)}
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
            <FormItem label="所有者" {...formLayout}>
              {getFieldDecorator('Owner')(<Staffs />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="LineStatus" {...formLayout} label="确认状态">
              {getFieldDecorator('LineStatus')(
                <Select placeholder="请选择">
                  <Option value="1">已报价</Option>
                  <Option value="2">未报价</Option>
                  <Option value="3">不详</Option>
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
                <FormItem label="销售" {...formLayout}>
                  {getFieldDecorator('Saler')(<Staffs />)}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem key="Closed" {...formLayout} label="关闭状态">
                  {getFieldDecorator('Closed')(
                    <Select placeholder="请选择">
                      <Option value="1">已关闭</Option>
                      <Option value="2">未关闭</Option>
                      <Option value="3">全部</Option>
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
                  onClick={() => router.push('/inquiry/edit')}
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
      supplierQuotationSku: { supplierQuotationSkuList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card title="供应商询价单物料查询" bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: supplierQuotationSkuList }}
              pagination={pagination}
              rowKey="CreateDate"
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

export default supplierQuotationSku;
