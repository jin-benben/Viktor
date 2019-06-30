import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, DatePicker } from 'antd';
import StandardTable from '@/components/StandardTable';
import Organization from '@/components/Organization/multiple';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';

import request from '@/utils/request';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ loading, global }) => ({
  global,
  loading: loading.models.global,
}))
@Form.create()
class ClientAsk extends PureComponent {
  state = {
    queryData: {
      Content: {
        DocDateFrom: '',
        DocDateTo: '',
        QueryType: '',
        QueryKey: '',
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
    },
    {
      title: '单据类型',
      dataIndex: 'ObjType',
      width: 80,
      render: val => <span>{val === '24' ? '收款' : '付款'}</span>,
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '转帐金额',
      width: 100,
      dataIndex: 'TrsfrSum',
    },
    {
      title: '记账名称',
      width: 200,
      dataIndex: 'AcctName',
    },

    {
      title: '备注',
      width: 200,
      dataIndex: 'Comments',
    },
    {
      title: '单据总计',
      width: 100,
      dataIndex: 'DocTotal',
    },
  ];

  componentDidMount() {
    const { QueryType, QueryKey, dispatch } = this.props;
    const queryData = {
      Content: {
        DocDateFrom: '',
        DocDateTo: '',
        QueryType,
        QueryKey,
        SearchText: '',
        SearchKey: '',
      },
      page: 1,
      rows: 30,
      sidx: 'DocEntry',
      sord: 'Desc',
    };
    dispatch({
      type: 'global/getAuthority',
    });
    this.setState(
      {
        queryData,
      },
      () => {
        this.getOinvorin(queryData);
      }
    );
  }

  getOinvorin = async params => {
    const response = await request('/Report/OINVORIN/OINVORIN02', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    if (response && response.Status === 200) {
      const { pagination } = this.state;
      if (response.Content) {
        const { rows, records, page } = response.Content;
        this.setState({
          orderList: [...rows],
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
        this.getOinvorin(queryData);
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
          this.getOinvorin(queryData);
        }
      );
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
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
            <FormItem {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="Owner" {...formLayout} label="销售员">
              {getFieldDecorator('Owner')(<SalerPurchaser />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="DeptList" {...this.formLayout} label="部门">
              {getFieldDecorator('DeptList')(<Organization />)}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem key="searchBtn">
              <span className="submitButtons">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading } = this.props;
    const { pagination, orderList } = this.state;
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
              scroll={{ x: 2100, y: 800 }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default ClientAsk;
