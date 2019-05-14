import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Divider, Select, DatePicker, Icon } from 'antd';
import StandardTable from '@/components/StandardTable';
import Staffs from '@/components/Staffs';
import DocEntryFrom from '@/components/DocEntryFrom';
import styles from './style.less';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ inquiryList, loading }) => ({
  inquiryList,
  loading: loading.models.rule,
}))
@Form.create()
class inquiryList extends PureComponent {
  state = {
    expandForm: false,
    queryData: {
      Content: {
        DocEntryFrom: '',
        DocEntryTo: '',
        DocDateFrom: '',
        DocDateTo: '',
        SDocStatus: '',
        PDocStatus: '',
        InquiryStatus: '',
        Closed: '',
        IsInquiry: '',
        Owner: '',
        SearchText: '',
        SearchKey: '',
      },
      page: 1,
      rows: 20,
      sidx: 'DocEntry',
      sord: 'Desc',
    },
  };

  columns = [
    {
      title: '单号',
      dataIndex: 'DocEntry',
    },
    {
      title: '单据日期',
      dataIndex: 'CreateDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '创建日期',
      dataIndex: 'OpeningBank',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '单据状态',
      dataIndex: 'Status',
      render: (text, record) => (
        <Fragment>
          <span>销售报价状态{record.SDocStatus}</span>
          <span>采购询价确认状态{record.PDocStatus}</span>
        </Fragment>
      ),
    },
    {
      title: '客户',
      dataIndex: 'CardName',
    },
    {
      title: '客户参考号',
      dataIndex: 'NumAtCard',
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
      title: '送货地址',
      dataIndex: 'CreditCode',
    },
    {
      title: '所有人',
      dataIndex: 'Owner',
    },
    {
      title: '询价总计',
      dataIndex: 'InquiryDocTotal',
    },
    {
      title: '销售总计',
      dataIndex: 'DocTotal',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'inquiryList/fetch',
      payload: queryData,
    });
  }

  handleStandardTableChange = pagination => {
    // table change
    const { dispatch } = this.props;
    const { queryData } = this.state;
    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
    };

    dispatch({
      type: 'inquiryList/fetch',
      payload: {
        ...queryData,
        ...params,
      },
    });
  };

  handleSearch = e => {
    // 搜索
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { queryData } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let DocDateFrom;
      let DocDateTo;
      if (fieldsValue.dateArr) {
        DocDateFrom = moment(fieldsValue.dateArr[0]).format('YYYY-MM-DD');
        DocDateTo = moment(fieldsValue.dateArr[1]).format('YYYY-MM-DD');
      }
      queryData.Content = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
      };
      this.setState({
        queryData,
      });

      dispatch({
        type: 'inquiryList/fetch',
        payload: queryData,
      });
    });
  };

  handleSubmit = () => {
    // 搜索btn
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      this.handleAdd(fieldsValue);
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
    onClick: () => router.push(`/inquiry/edit?DocEntry=${record.DocEntry}`),
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
            <FormItem key="SDocStatus" {...formLayout} label="销售报价状态">
              {getFieldDecorator('SDocStatus')(
                <Select placeholder="请选择">
                  <Option value="1">已报价</Option>
                  <Option value="2">未报价</Option>
                  <Option value="3">不详</Option>
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
                      <Option value="1">已关闭</Option>
                      <Option value="2">未关闭</Option>
                      <Option value="3">全部</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem key="InquiryStatus" {...formLayout} label="采购询价状态">
                  {getFieldDecorator('InquiryStatus')(
                    <Select placeholder="请选择">
                      <Option value="1">已报价</Option>
                      <Option value="2">未报价</Option>
                      <Option value="3">不详</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem key="IsInquiry" {...formLayout} label="需要采购询价">
                  {getFieldDecorator('IsInquiry')(
                    <Select placeholder="请选择">
                      <Option value="1">是</Option>
                      <Option value="2">否</Option>
                      <Option value="3">全部</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Fragment>
          ) : null}
          <Col md={6} sm={24}>
            <FormItem key="searchBtn" {...searchFormItemLayout}>
              <span className={styles.submitButtons}>
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
      inquiryList: { data },
      loading,
    } = this.props;

    return (
      <Fragment>
        <Card title="客户询价单查询" bordered={false}>
          <div className={styles.inquiryList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={data}
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

export default inquiryList;
