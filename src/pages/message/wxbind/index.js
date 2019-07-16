import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, DatePicker, Col, Card, Form, Input, Button, Tag } from 'antd';
import StandardTable from '@/components/StandardTable';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

@connect(({ wxbind, loading }) => ({
  wxbind,
  loading: loading.models.rule,
}))
@Form.create()
class WxBind extends PureComponent {
  columns = [
    {
      title: '客户代码',
      width: 80,
      dataIndex: 'CardCode',
    },
    {
      title: '客户名称',
      width: 300,
      dataIndex: 'CardName',
    },
    {
      title: '姓名',
      width: 80,
      dataIndex: 'Name',
    },
    {
      title: '手机号码',
      width: 100,
      dataIndex: 'PhoneNo',
    },

    {
      title: '职位',
      width: 100,
      dataIndex: 'Position',
    },
    {
      title: '绑定微信号',
      width: 100,
      dataIndex: 'OpenId',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      width: 80,
      render: val => (
        <span>{val === '2' ? <Tag color="blue">成功</Tag> : <Tag color="red">失败</Tag>}</span>
      ),
    },
    {
      title: '绑定时间',
      dataIndex: 'CreateDate',
      width: 100,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
  ];

  state = {
    queryData: {
      Content: {
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
      sidx: 'DocEntry',
      sord: 'Desc',
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'wxbind/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'wxbind/fetch',
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
      dispatch({
        type: 'wxbind/fetch',
        payload: {
          Content: {
            SearchText: fieldsValue.SearchText,
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
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
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
      wxbind: { wxbindList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: wxbindList }}
              pagination={pagination}
              rowKey="DocEntry"
              scroll={{ x: 1000 }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default WxBind;
