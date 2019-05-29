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
import DocEntryFrom from '@/components/DocEntryFrom';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { getName } from '@/utils/utils';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ SalesQuotation, loading, global }) => ({
  SalesQuotation,
  global,
  loading: loading.models.SalesQuotation,
}))
@Form.create()
class SalesQuotation extends PureComponent {
  state = {
    expandForm: false,
  };

  columns = [
    {
      title: '单号',
      width: 80,
      fixed: 'left',
      dataIndex: 'DocEntry',
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '创建日期',
      width: 100,
      dataIndex: 'CreateDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '单据状态',
      width: 100,
      dataIndex: 'DocStatus',
      render: text => (
        <Fragment>
          <span>
            {text === 'O' ? (
              <Badge color="green" text="未报价" />
            ) : (
              <Badge color="blue" text="已报价" />
            )}
          </span>
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
      render: (text, record) => (
        <span>
          {`${record.Province}/${record.City}/${record.Area}/${record.Street}/${record.Adress}`}
        </span>
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
      title: '单据总计',
      width: 80,
      dataIndex: 'DocTotal',
    },
    {
      title: '成本总计',
      width: 80,
      dataIndex: 'OtherTotal',
    },
    {
      title: '利润',
      width: 100,
      dataIndex: 'ProfitTotal',
    },
    {
      title: '备注',
      width: 100,
      dataIndex: 'Comment',
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      SalesQuotation: { queryData },
    } = this.props;
    dispatch({
      type: 'SalesQuotation/fetch',
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
      SalesQuotation: { queryData },
    } = this.props;
    dispatch({
      type: 'SalesQuotation/fetch',
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
        type: 'SalesQuotation/fetch',
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
    onClick: () => router.push(`/sellabout/TI_Z029/detail?DocEntry=${record.DocEntry}`),
  });

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
            <FormItem label="所有者" {...formLayout}>
              {getFieldDecorator('Owner')(<MDMCommonality data={Saler} />)}
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
                <FormItem key="InquiryStatus" {...formLayout} label="采购询价状态">
                  {getFieldDecorator('InquiryStatus')(
                    <Select placeholder="请选择">
                      <Option value="C">已报价</Option>
                      <Option value="O">未报价</Option>
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
          <Col md={4} sm={24}>
            <FormItem key="searchBtn" {...searchFormItemLayout}>
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
      SalesQuotation: { SalesQuotationList, pagination },
      loading,
    } = this.props;
    const tableWidth = document.body.offsetWidth < 1800 ? 1500 : 0;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: SalesQuotationList }}
              pagination={pagination}
              rowKey="DocEntry"
              scroll={{ x: tableWidth }}
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

export default SalesQuotation;
