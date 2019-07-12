import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Tooltip, Select, DatePicker, Icon, Tag } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import Organization from '@/components/Organization/multiple';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';
import MyPageHeader from '../components/pageHeader';
import { getName } from '@/utils/utils';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ agreementOrder, loading, global }) => ({
  agreementOrder,
  global,
  loading: loading.models.agreementOrder,
}))
@Form.create()
class agreementOrder extends PureComponent {
  state = {
    expandForm: false,
  };

  columns = [
    {
      title: '单号',
      width: 80,
      fixed: 'left',
      sorter: true,
      align: 'center',
      dataIndex: 'DocEntry',
      render: text => (
        <Link target="_blank" to={`/sellabout/TI_Z030/detail?DocEntry=${text}`}>
          {text}
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
      title: '创建日期',
      width: 150,
      sorter: true,
      align: 'center',
      dataIndex: 'CreateDate',
      render: val => (
        <Ellipsis tooltip lines={1}>
          <span>{val ? moment(val).format('YYYY-MM-DD HH:DD:MM') : ''}</span>
        </Ellipsis>
      ),
    },
    {
      title: '状态',
      width: 140,
      dataIndex: 'DocStatus',
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
      title: '客户',
      width: 300,
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
      title: '送货地址',
      width: 300,
      dataIndex: 'address',
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          <span>{`${record.Province}/${record.City}/${record.Area}/${record.Address}`}</span>
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
      title: '单据总计',
      width: 100,
      dataIndex: 'DocTotal',
      sorter: true,
      align: 'center',
    },
    {
      title: '成本总计',
      width: 100,
      dataIndex: 'OtherTotal',
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
      title: '备注',
      width: 100,
      dataIndex: 'Comment',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      agreementOrder: { queryData },
    } = this.props;
    dispatch({
      type: 'agreementOrder/fetch',
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
    dispatch({
      type: 'global/getAuthority',
    });
  }

  handleStandardTableChange = (pagination, filters, sorter) => {
    const {
      dispatch,
      agreementOrder: { queryData },
    } = this.props;
    const { field, order } = sorter;
    let sord = 'desc';
    if (order === 'ascend') {
      sord = 'asc';
    }
    dispatch({
      type: 'agreementOrder/fetch',
      payload: {
        ...queryData,
        page: pagination.current,
        rows: pagination.pageSize,
        sidx: field || 'DocEntry',
        sord,
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

      delete fieldsValue.dateArr;
      const queryData = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
      };
      dispatch({
        type: 'agreementOrder/fetch',
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
          <Col md={5} sm={24}>
            <FormItem key="SearchText" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
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
          <Col md={5} sm={24}>
            <FormItem key="Owner" {...formLayout} label="销售员">
              {getFieldDecorator('Owner')(<SalerPurchaser />)}
            </FormItem>
          </Col>

          {expandForm ? (
            <Fragment>
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
                <FormItem label="日期" {...formLayout}>
                  {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                    <RangePicker style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
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
      agreementOrder: { agreementOrderList, pagination },
      loading,
      location,
    } = this.props;

    return (
      <Fragment>
        <MyPageHeader {...location} />
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: agreementOrderList }}
              pagination={pagination}
              rowKey="DocEntry"
              scroll={{ x: 1700 }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default agreementOrder;
