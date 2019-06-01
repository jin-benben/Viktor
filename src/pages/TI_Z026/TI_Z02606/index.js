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
import MDMCommonality from '@/components/Select';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import DocEntryFrom from '@/components/DocEntryFrom';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import Link from 'umi/link';
import { getName } from '@/utils/utils';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ inquiryFetch, loading, global }) => ({
  inquiryFetch,
  global,
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
      width: 80,
      dataIndex: 'DocEntry',
      render: text => <Link to={`/sellabout/TI_Z026/detail?DocEntry=${text}`}>{text}</Link>,
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
      width: 120,
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
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
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
        <Ellipsis tooltip lines={1}>
          {record.CellphoneNO}
          {record.CellphoneNO ? <Divider type="vertical" /> : null}
          {record.PhoneNO}
        </Ellipsis>
      ),
    },
    {
      title: '送货地址',
      dataIndex: 'address',
      width: 300,
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {`${record.Province}/${record.City}/${record.Area}/${record.Address}`}
        </Ellipsis>
      ),
    },
    {
      title: '所有人',
      width: 80,
      dataIndex: 'Owner',
      render: text => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, text)}</span>;
      },
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
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler'],
        },
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

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      global: { Saler },
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
          <Col md={5} sm={24}>
            <FormItem label="日期" {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="SDocStatus" {...formLayout} label="报价状态">
              {getFieldDecorator('SDocStatus')(
                <Select placeholder="请选择">
                  <Option value="C">已报价</Option>
                  <Option value="O">未报价</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="Owner" {...this.formLayout} label="所有者">
              {getFieldDecorator('Owner', {})(<MDMCommonality data={Saler} />)}
            </FormItem>
          </Col>

          {expandForm ? (
            <Fragment>
              <Col md={5} sm={24}>
                <FormItem key="orderNo" {...formLayout} label="单号">
                  {getFieldDecorator('orderNo', {
                    initialValue: { DocEntryFrom: '', DocEntryTo: '' },
                  })(<DocEntryFrom />)}
                </FormItem>
              </Col>
              <Col md={4} sm={24}>
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
                <FormItem key="InquiryStatus" {...formLayout} label="询价状态">
                  {getFieldDecorator('InquiryStatus')(
                    <Select placeholder="请选择">
                      <Option value="C">已询价</Option>
                      <Option value="O">未询价</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
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
    const {
      inquiryFetch: { inquiryList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: inquiryList }}
              pagination={pagination}
              rowKey="DocEntry"
              columns={this.columns}
              scroll={{ x: 1500, y: 800 }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <FooterToolbar>
          <Button
            icon="plus"
            style={{ marginLeft: 8 }}
            type="primary"
            onClick={() => router.push('/sellabout/TI_Z026/TI_Z02601')}
          >
            新建
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default inquiryListPage;
