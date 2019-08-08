import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import { Row, DatePicker, Col, Card, Form, Input, Button, Tag } from 'antd';
import StandardTable from '@/components/StandardTable';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

function whichTag(status) {
  switch (status) {
    case '2':
      return <Tag color="blue">成功</Tag>;
    case '1':
      return <Tag color="red">失败</Tag>;
    default:
      return <Tag color="#faad14">特殊状态</Tag>;
  }
}

@connect(({ pushMessage, loading }) => ({
  pushMessage,
  loading: loading.models.rule,
}))
@Form.create()
class PushMessage extends PureComponent {
  columns = [
    {
      title: '消息ID',
      dataIndex: 'Code',
      width: 350,
      render: text => (
        <Link target="_blank" to={`/message/pushlog/detail?Code=${text}`}>
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
      title: '推送渠道',
      width: 100,
      dataIndex: 'NotificationChannel',
    },

    {
      title: '推送状态',
      dataIndex: 'Status',
      width: 100,
      render: val => whichTag(val),
    },
    {
      title: '创建时间',
      dataIndex: 'CreateDate',
      width: 150,
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
      type: 'pushMessage/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'pushMessage/fetch',
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
        type: 'pushMessage/fetch',
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
      pushMessage: { pushMessageList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: pushMessageList }}
              pagination={pagination}
              rowKey="Code"
              scroll={{ x: 900 }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default PushMessage;
