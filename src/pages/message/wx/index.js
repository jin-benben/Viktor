import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import { Row, DatePicker, Col, Card, Form, Input, Button, Tag } from 'antd';
import StandardTable from '@/components/StandardTable';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ wxMessage, loading }) => ({
  wxMessage,
  loading: loading.models.rule,
}))
@Form.create()
class WXMessage extends PureComponent {
  columns = [
    {
      title: '消息ID',
      dataIndex: 'Code',
      width: 350,
      render: text => (
        <Link target="_blank" to={`/message/wx/detail?Code=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '推送代码',
      width: 100,
      dataIndex: 'NotificationCode',
    },
    {
      title: '推送描述',
      width: 200,
      dataIndex: 'NotificationName',
    },
    {
      title: '标题',
      dataIndex: 'Title',
    },
    {
      title: '地址',
      width: 150,
      dataIndex: 'Url',
    },
    {
      title: '消息模板',
      width: 80,
      dataIndex: 'Template_id',
    },
    {
      title: '微信AppId',
      width: 100,
      dataIndex: 'WeChatAppId',
    },
    {
      title: '用户ID',
      width: 100,
      dataIndex: 'UserID',
    },
    {
      title: '微信OpenId',
      width: 100,
      dataIndex: 'OpenId',
    },
    {
      title: '消息ID',
      width: 100,
      dataIndex: 'Msgid',
    },
    {
      title: '推送状态',
      dataIndex: 'Status',
      width: 80,
      render: val => (
        <span>{val === '2' ? <Tag color="blue">成功</Tag> : <Tag color="red">失败</Tag>}</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'CreateDate',
      width: 150,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:MM:SS')}</span>,
    },
    {
      title: '创建用户',
      width: 80,
      dataIndex: 'CreateUser',
    },
  ];

  state = {
    queryData: {
      Content: {
        BrandName: '',
        Category: '',
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
      sidx: 'Code',
      sord: 'Desc',
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'wxMessage/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'wxMessage/fetch',
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
    const { queryData } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let DocDateFrom;
      let DocDateTo;
      if (fieldsValue.dateArr) {
        DocDateFrom = moment(fieldsValue.dateArr[0]).format('YYYY-MM-DD');
        DocDateTo = moment(fieldsValue.dateArr[1]).format('YYYY-MM-DD');
      }

      dispatch({
        type: 'wxMessage/fetch',
        payload: {
          Content: {
            ...queryData.Content,
            SearchText: fieldsValue.SearchText,
            DocDateFrom,
            DocDateTo,
          },
          page: 1,
          rows: 30,
          sidx: 'Code',
          sord: 'Desc',
        },
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="日期">
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={2} sm={24}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      wxMessage: { wxMessageList, pagination },
      loading,
    } = this.props;
    const tablewidth = document.body.offsetWidth < 1550 ? 1500 : 0;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: wxMessageList }}
              pagination={pagination}
              rowKey="Code"
              scroll={{ y: 600, x: tablewidth }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default WXMessage;
