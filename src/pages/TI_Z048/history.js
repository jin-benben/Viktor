import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import { Row, Col, Card, Form, Input, Button, DatePicker } from 'antd';
import StandardTable from '@/components/StandardTable';
import { getName } from '@/utils/utils';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;

@connect(({ express, loading, global }) => ({
  express,
  global,
  loading: loading.models.express,
}))
@Form.create()
class ExpressHistory extends PureComponent {
  columns = [
    {
      title: '单号',
      width: 80,
      fixed: 'left',
      dataIndex: 'DocEntry',
      render: text => (
        <Link target="_blank" to={`/base/express/detail?DocEntry=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'CreateUser',
      width: 120,
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
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '客户名称',
      width: 100,
      dataIndex: 'CustomerName',
    },
    {
      title: '收件人',
      width: 120,
      dataIndex: 'RName',
    },
    {
      title: '收件地址',
      width: 400,
      dataIndex: 'RAddress',
      render: (text, record) => (
        <span>
          {`${record.RProvinceName}${record.RCityName || ''}/${record.RExpAreaName || ''}/${
            record.RAddress
          }/`}
        </span>
      ),
    },
    {
      title: '发件人',
      width: 120,
      dataIndex: 'SName',
    },
    {
      title: '发件地址',
      dataIndex: 'SAddress',
      render: (text, record) => (
        <span>
          {`${record.SProvinceName}/${record.SCityName}/${record.SExpAreaName}/${record.SAddress}/`}
        </span>
      ),
    },
    {
      title: '快递公司',
      width: 100,
      dataIndex: 'ShipperCode',
      align: 'center',
      render: text => {
        const {
          global: { Trnsp },
        } = this.props;
        return <span>{getName(Trnsp, text)}</span>;
      },
    },
    {
      title: '快递单号',
      width: 300,
      dataIndex: 'LogisticCode',
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      express: { queryData },
    } = this.props;

    dispatch({
      type: 'express/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['TI_Z004', 'Trnsp'],
        },
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      express: { queryData },
    } = this.props;
    dispatch({
      type: 'express/fetch',
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
      };
      dispatch({
        type: 'express/fetch',
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
            <FormItem label="日期" {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
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
          <Col md={2} sm={24}>
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
    const {
      express: { expressList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: expressList }}
              pagination={pagination}
              rowKey="DocEntry"
              scroll={{ x: 1800, y: 600 }}
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

export default ExpressHistory;
