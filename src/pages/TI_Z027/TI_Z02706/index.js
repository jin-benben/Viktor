import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Tooltip, Select, DatePicker, Icon, Tag } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
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
@connect(({ supplierQuotation, loading, global }) => ({
  supplierQuotation,
  global,
  loading: loading.models.supplierQuotation,
}))
@Form.create()
class supplierQuotation extends PureComponent {
  state = {
    expandForm: false,
  };

  columns = [
    {
      title: '单号',
      width: 80,
      dataIndex: 'DocEntry',
      sorter: true,
      align: 'center',
      fixed: 'left',
      render: text => (
        <Link target="_blank" to={`/purchase/TI_Z027/detail?DocEntry=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '单据日期',
      width: 100,
      dataIndex: 'DocDate',
      sorter: true,
      align: 'center',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '单据状态',
      dataIndex: 'DocStatus',
      width: 140,
      render: (text, record) =>
        record.lastIndex ? null : (
          <Fragment>
            {record.Closed === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                {text === 'C' ? <Tag color="green">已报价</Tag> : <Tag color="gold">未报价</Tag>}
                {record.SendEmailStatus === 'C' ? (
                  <Tag color="green">已发送</Tag>
                ) : (
                  <Tag color="gold">未发送</Tag>
                )}
              </Fragment>
            )}
          </Fragment>
        ),
    },
    {
      title: '供应商',
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
      width: 150,
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
      title: '备注',
      width: 100,
      dataIndex: 'Comment',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '采购员',
      width: 120,
      dataIndex: 'Owner',
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
      title: '币种',
      width: 80,
      dataIndex: 'Currency',
      render: text => {
        const {
          global: { Curr },
        } = this.props;
        return <span>{getName(Curr, text)}</span>;
      },
    },
    {
      title: '询价总计',
      width: 100,
      sorter: true,
      align: 'center',
      dataIndex: 'InquiryDocTotal',
    },
    {
      title: '本币总计',
      width: 100,
      sorter: true,
      align: 'center',
      dataIndex: 'InquiryDocTotalLocal',
    },
    {
      title: '有效日期',
      width: 100,
      dataIndex: 'ToDate',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '创建日期',
      sorter: true,
      align: 'center',
      width: 100,
      dataIndex: 'CreateDate',
      render: val => (
        <Ellipsis tooltip lines={1}>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '邮件发送',
      width: 100,
      sorter: true,
      align: 'center',
      dataIndex: 'SendEmailDateTime',
      render: val => (
        <Ellipsis tooltip lines={1}>
          {val}
        </Ellipsis>
      ),
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
  ];

  componentDidMount() {
    const {
      dispatch,
      global: { currentUser },
      supplierQuotation: { queryData },
    } = this.props;
    Object.assign(queryData.Content, { Owner: [currentUser.Owner] });
    dispatch({
      type: 'supplierQuotation/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Purchaser', 'Curr'],
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
      supplierQuotation: { queryData },
    } = this.props;
    const { field, order } = sorter;
    let sord = 'desc';
    if (order === 'ascend') {
      sord = 'asc';
    }
    dispatch({
      type: 'supplierQuotation/fetch',
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
      let DocDateFrom = '';
      let DocDateTo = '';
      if (fieldsValue.dateArr && fieldsValue.dateArr.length) {
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
        type: 'supplierQuotation/fetch',
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
      supplierQuotation: { queryData },
    } = this.props;
    const { expandForm } = this.state;
    const { Closed, Owner } = queryData.Content;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 12, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem key="SearchText" {...formLayout} label="关键字">
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="DocStatus" {...formLayout} label="报价状态">
              {getFieldDecorator('DocStatus')(
                <Select placeholder="请选择">
                  <Option value="C">已报价</Option>
                  <Option value="O">未报价</Option>
                  <Option value="">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="SendEmailStatus" {...formLayout} label="邮件状态">
              {getFieldDecorator('SendEmailStatus')(
                <Select placeholder="请选择">
                  <Option value="C">已发送</Option>
                  <Option value="O">未发送</Option>
                  <Option value="">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="Owner" {...formLayout} label="采购员">
              {getFieldDecorator('Owner', { initialValue: Owner })(
                <SalerPurchaser initialValue={Owner} />
              )}
            </FormItem>
          </Col>
          {expandForm ? (
            <Fragment>
              <Col md={5} sm={24}>
                <FormItem key="Closed" {...formLayout} label="关闭状态">
                  {getFieldDecorator('Closed', { initialValue: Closed })(
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
                <FormItem label="日期" {...formLayout}>
                  {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                    <RangePicker style={{ width: '100%' }} />
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
      supplierQuotation: { supplierQuotationList, pagination },
      loading,
      location,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <MyPageHeader {...location} />
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: supplierQuotationList }}
              pagination={pagination}
              scroll={{ x: 1650 }}
              rowKey="DocEntry"
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <FooterToolbar>
          <Button
            icon="plus"
            style={{ marginLeft: 8 }}
            type="primary"
            onClick={() => router.push('/purchase/TI_Z027/edit')}
          >
            新建
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default supplierQuotation;
