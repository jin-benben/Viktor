import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import { Row, DatePicker, Col, Card, Form, Input, Button, Tag } from 'antd';
import StandardTable from '@/components/StandardTable';
import Text from '@/components/Text';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

@connect(({ ddMessage, loading }) => ({
  ddMessage,
  loading: loading.models.rule,
}))
@Form.create()
class DDMessage extends PureComponent {
  columns = [
    {
      title: '消息ID',
      dataIndex: 'Code',
      width: 350,
      render: text => (
        <Link target="_blank" to={`/message/dd/detail?Code=${text}`}>
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
      title: 'PC地址',
      width: 200,
      dataIndex: 'PCUrl',
      render: text => <Text text={text} />,
    },
    {
      title: 'Mobile地址',
      width: 200,
      dataIndex: 'MobileUrl',
      render: text => <Text text={text} />,
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
      type: 'ddMessage/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'ddMessage/fetch',
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
        type: 'ddMessage/fetch',
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
      ddMessage: { ddMessageList, pagination },
      loading,
    } = this.props;

    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: ddMessageList }}
              pagination={pagination}
              rowKey="Code"
              scroll={{ x: 1500 }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default DDMessage;
