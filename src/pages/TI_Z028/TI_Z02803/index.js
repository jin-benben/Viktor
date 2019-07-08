import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, DatePicker, Icon } from 'antd';
import StandardTable from '@/components/StandardTable';
import MDMCommonality from '@/components/Select';
import DocEntryFrom from '@/components/DocEntryFrom';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';
import MyPageHeader from '../components/pageHeader';
import { getName } from '@/utils/utils';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ TI_Z02803, loading, global }) => ({
  TI_Z02803,
  global,
  loading: loading.models.TI_Z02803,
}))
@Form.create()
class TI_Z02803 extends PureComponent {
  columns = [
    {
      title: '单号',
      width: 100,
      dataIndex: 'DocEntry',
      align: 'center',
      render: text => (
        <Link target="_blank" to={`/purchase/TI_Z028/TI_Z02802?DocEntry=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      align: 'center',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '有效期日期',
      dataIndex: 'ToDate',
      width: 100,
      align: 'center',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '创建日期',
      dataIndex: 'CreateDate',
      width: 100,
      align: 'center',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '采购员',
      align: 'center',
      dataIndex: 'Owner',
      width: 100,
      render: text => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, text)}</span>;
      },
    },
    {
      title: '询价总计',
      width: 100,
      align: 'center',
      dataIndex: 'InquiryDocTotal',
    },
    {
      title: '备注',
      align: 'center',
      width: 100,
      dataIndex: 'Comment',
    },
  ];

  state = {
    expandForm: false,
    orderList: [],
    queryData: {
      Content: {
        Owner: [],
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
  };

  componentDidMount() {
    const {
      dispatch,
      global: { currentUser },
    } = this.props;
    const { queryData } = this.state;
    Object.assign(queryData.Content, { Owner: [currentUser.Owner] });
    this.getOrder(queryData);
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Purchaser'],
        },
      },
    });
    dispatch({
      type: 'global/getAuthority',
    });
  }

  getOrder = queryData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TI_Z02803/fetch',
      payload: {
        ...queryData,
      },
      callback: response => {
        if (response && response.Status === 200) {
          if (!response.Content) {
            this.setState({
              orderList: [],
              pagination: {
                total: 0,
              },
              queryData,
            });
          } else {
            const { rows, records, page } = response.Content;
            this.setState({
              orderList: rows,
              queryData,
              pagination: {
                total: records,
                pageSize: queryData.rows,
                current: page,
              },
            });
          }
        }
      },
    });
  };

  handleStandardTableChange = pagination => {
    const { queryData } = this.state;
    this.getOrder({
      ...queryData,
      page: pagination.current,
      rows: pagination.pageSize,
    });
  };

  handleSearch = e => {
    // 搜索
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let DocDateFrom;
      let DocDateTo;
      if (fieldsValue.dateArr) {
        DocDateFrom = moment(fieldsValue.dateArr[0]).format('YYYY-MM-DD');
        DocDateTo = moment(fieldsValue.dateArr[1]).format('YYYY-MM-DD');
      }
      let DocEntryFroms = '';
      let DocEntryTo = '';
      if (fieldsValue.orderNo) {
        DocEntryFroms = fieldsValue.orderNo.DocEntryFrom;
        DocEntryTo = fieldsValue.orderNo.DocEntryTo;
      }
      delete fieldsValue.orderNo;
      delete fieldsValue.dateArr;
      const queryData = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
        DocEntryFroms,
        DocEntryTo,
      };
      this.getOrder({
        Content: {
          SearchText: '',
          SearchKey: 'Name',
          ...queryData,
        },
        page: 1,
        rows: 30,
        sidx: 'DocEntry',
        sord: 'Desc',
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
    const {
      expandForm,
      queryData: { Content },
    } = this.state;
    const { Owner } = Content;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem key="SearchText">
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
            <FormItem key="Owner" {...formLayout} label="采购员">
              {getFieldDecorator('Owner', { initialValue: Owner })(
                <SalerPurchaser initialValue={Owner} />
              )}
            </FormItem>
          </Col>

          {expandForm ? (
            <Fragment>
              <Col md={5} sm={24}>
                <FormItem {...formLayout} label="销售员">
                  {getFieldDecorator('Saler')(<MDMCommonality placeholder="销售员" data={Saler} />)}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem key="orderNo" {...formLayout} label="单号">
                  {getFieldDecorator('orderNo', {
                    initialValue: { DocEntryFrom: '', DocEntryTo: '' },
                  })(<DocEntryFrom />)}
                </FormItem>
              </Col>
            </Fragment>
          ) : (
            ''
          )}

          <Col md={2} sm={24}>
            <FormItem key="searchBtn">
              <span className="submitButtons">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                  icon="plus"
                  style={{ marginLeft: 8 }}
                  type="primary"
                  onClick={() => router.push('/purchase/TI_Z028/TI_Z02801')}
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
    const { loading, location } = this.props;
    const { orderList, pagination } = this.state;
    return (
      <Card bordered={false}>
        <MyPageHeader {...location} />
        <div className="tableList">
          <div className="tableListForm">{this.renderSimpleForm()}</div>
          <StandardTable
            loading={loading}
            data={{ list: orderList }}
            pagination={pagination}
            rowKey="DocEntry"
            columns={this.columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card>
    );
  }
}

export default TI_Z02803;
