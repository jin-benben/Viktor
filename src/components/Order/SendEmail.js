import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, DatePicker } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import { getName } from '@/utils/utils';
import request from '@/utils/request';
import { emailSendType } from '@/utils/publicData';

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
        DeptList: [],
        QueryType: '',
        QueryKey: '',
        LineStatus: '',
        Closed: 'N',
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
      fixed: 'left',
      dataIndex: 'DocEntry',
      render: text => (
        <Link target="_blank" to={`/base/sendEmail/detail?DocEntry=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'CreateUser',
      width: 100,
      render: val => {
        const {
          global: { TI_Z004 },
        } = this.props;
        return <span>{getName(TI_Z004, val)}</span>;
      },
    },
    {
      title: '创建日期',
      width: 100,
      dataIndex: 'CreateDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '发送人',
      width: 300,
      dataIndex: 'From',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '收件人',
      width: 300,
      dataIndex: 'ToList',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '抄送人',
      width: 300,
      dataIndex: 'CCList',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '主题',
      width: 200,
      dataIndex: 'Title',
    },
    {
      title: '来源类型',
      width: 100,
      dataIndex: 'BaseType',
      render: text => <span>{getName(emailSendType, text)}</span>,
    },

    {
      title: '来源单号',
      width: 80,
      dataIndex: 'BaseEntry',
    },
    {
      title: '模板代码',
      width: 80,
      dataIndex: 'EmailTemplateCode',
    },
    {
      title: '模板名称',
      width: 150,
      dataIndex: 'EmailTemplateName',
    },
  ];

  componentDidMount() {
    const { QueryType, QueryKey } = this.props;

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
    this.setState(
      {
        queryData,
      },
      () => {
        this.getOrder(queryData);
      }
    );
  }

  getOrder = async params => {
    const response = await request('/Report/TI_Z047/TI_Z04706', {
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
        this.getOrder(queryData);
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
          this.getOrder(queryData);
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
          <Col md={6} sm={24}>
            <FormItem label="日期" {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
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
              rowKey="DocEntry"
              columns={this.columns}
              scroll={{ x: 1800, y: 800 }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default ClientAsk;
