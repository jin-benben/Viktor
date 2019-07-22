import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import { Row, Col, Card, Form, Input, Button, Select, DatePicker, Tag } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import { emailSendType } from '@/utils/publicData';
import { getName } from '@/utils/utils';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ sendEmail, loading, global }) => ({
  sendEmail,
  global,
  loading: loading.models.sendEmail,
}))
@Form.create()
class PrintHistory extends PureComponent {
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
      render: val => (
        <Ellipsis tooltip lines={1}>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '状态',
      dataIndex: 'SendStatus',
      width: 80,
      render: text => (
        <span>{text === 'C' ? <Tag color="blue">成功</Tag> : <Tag color="red">失败</Tag>}</span>
      ),
    },
    {
      title: '发送人',
      width: 250,
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
      width: 150,
      dataIndex: 'CCList',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '主题',
      width: 250,
      dataIndex: 'Title',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
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
      dataIndex: 'EmailTemplateName',
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      sendEmail: { queryData },
    } = this.props;
    dispatch({
      type: 'sendEmail/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['TI_Z004'],
        },
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      sendEmail: { queryData },
    } = this.props;
    dispatch({
      type: 'sendEmail/fetch',
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
        type: 'sendEmail/fetch',
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
            <FormItem key="BaseType" {...formLayout} label="单据类型">
              {getFieldDecorator('BaseType')(
                <Select placeholder="请选择单据类型！" style={{ width: '100%' }}>
                  {emailSendType.map(option => (
                    <Option key={option.Key} value={option.Key}>
                      {option.Value}
                    </Option>
                  ))}
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
      sendEmail: { sendEmailList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: sendEmailList }}
              pagination={pagination}
              rowKey="DocEntry"
              scroll={{ x: 1800 }}
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

export default PrintHistory;
