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
  Divider,
  Select,
  Badge,
  DatePicker,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import Staffs from '@/components/Staffs';
import DocEntryFrom from '@/components/DocEntryFrom';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ inquiryFetch, loading }) => ({
  inquiryFetch,
  loading: loading.models.inquiryFetch,
}))
@Form.create()
class inquiryListPage extends PureComponent {
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
      title: '单据日期',
      width: 100,
      dataIndex: 'DocDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '创建日期',
      dataIndex: 'CreateDate',
      width: 100,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '单据状态',
      dataIndex: 'Status',
      width: 100,
      render: (text, record) => (
        <Fragment>
          {record.Closed === 'Y' ? (
            <Badge color="red" text="已关闭" />
          ) : (
            <Fragment>
              <span>
                {record.SDocStatus === 'O' ? (
                  <Badge color="green" text="未报价" />
                ) : (
                  <Badge color="blue" text="已报价" />
                )}
              </span>
              <span>
                {record.PDocStatus === 'O' ? (
                  <Badge color="green" text="未询价" />
                ) : (
                  <Badge color="blue" text="已询价" />
                )}{' '}
              </span>
            </Fragment>
          )}
        </Fragment>
      ),
    },
    {
      title: '客户',
      width: 150,
      dataIndex: 'CardName',
    },
    {
      title: '客户参考号',
      width: 100,
      dataIndex: 'NumAtCard',
    },
    {
      title: '联系方式',
      width: 120,
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
      title: '送货地址',
      dataIndex: 'address',
      width: 300,
      render: (text, record) => (
        <span>{`${record.Province}/${record.City}/${record.Area}/${record.Street}/${
          record.Address
        }`}</span>
      ),
    },
    {
      title: '所有人',
      width: 100,
      dataIndex: 'Owner',
    },
    {
      title: '询价总计',
      width: 100,
      dataIndex: 'InquiryDocTotal',
    },
    {
      title: '销售总计',
      width: 100,
      dataIndex: 'DocTotal',
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      inquiryFetch: { queryData },
    } = this.props;
    dispatch({
      type: 'inquiryFetch/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      inquiryFetch: { queryData },
    } = this.props;
    dispatch({
      type: 'inquiryFetch/fetch',
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
        type: 'inquiryFetch/fetch',
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
    onClick: () => router.push(`/inquiry/detail?DocEntry=${record.DocEntry}`),
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
            <FormItem key="SDocStatus" {...formLayout} label="报价状态">
              {getFieldDecorator('SDocStatus')(
                <Select placeholder="请选择">
                  <Option value="C">已报价</Option>
                  <Option value="O">报价</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所有者" {...formLayout}>
              {getFieldDecorator('Owner')(<Staffs />)}
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
                <FormItem key="InquiryStatus" {...formLayout} label="询价状态">
                  {getFieldDecorator('InquiryStatus')(
                    <Select placeholder="请选择">
                      <Option value="C">已询价</Option>
                      <Option value="O">未询价</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem key="IsInquiry" {...formLayout} label="需要采购询价">
                  {getFieldDecorator('IsInquiry')(
                    <Select placeholder="请选择">
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
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
      inquiryFetch: { inquiryList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card title="客户询价单查询" bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: inquiryList }}
              pagination={pagination}
              rowKey="DocEntry"
              columns={this.columns}
              scroll={{ x: 1500, y: 800 }}
              onRow={this.handleOnRow}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default inquiryListPage;
