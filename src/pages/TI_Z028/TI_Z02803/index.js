import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, DatePicker } from 'antd';
import StandardTable from '@/components/StandardTable';
import MDMCommonality from '@/components/Select';
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

  componentDidMount() {
    const {
      dispatch,
      TI_Z02803: { queryData },
      global: { currentUser },
    } = this.props;
    Object.assign(queryData.Content, { Owner: currentUser.Owner });
    dispatch({
      type: 'TI_Z02803/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Purchaser'],
        },
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      TI_Z02803: { queryData },
    } = this.props;
    dispatch({
      type: 'TI_Z02803/fetch',
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
        type: 'TI_Z02803/fetch',
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
      global: { Purchaser, currentUser },
    } = this.props;

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
            <FormItem key="SearchText">
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
          <Col md={6} sm={24}>
            <FormItem key="Owner" {...formLayout} label="采购员">
              {getFieldDecorator('Owner', { initialValue: currentUser.Owner })(
                <MDMCommonality initialValue={currentUser.Owner} data={Purchaser} />
              )}
            </FormItem>
          </Col>
          <Col md={2} sm={24}>
            <FormItem key="searchBtn" {...searchFormItemLayout}>
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
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      TI_Z02803: { orderList, pagination },
      loading,
    } = this.props;
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
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default TI_Z02803;
