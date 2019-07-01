import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, DatePicker } from 'antd';
import MDMCommonality from '@/components/Select';
import StandardTable from '@/components/StandardTable';
import { getName } from '@/utils/utils';
import { printOrderType, printType } from '@/utils/publicData';
import request from '@/utils/request';

const BaseType = [
  {
    Key: '1',
    Value: '客户询价',
  },
  {
    Key: '2',
    Value: '采购询价',
  },
  {
    Key: '3',
    Value: '销售报价',
  },
  {
    Key: '4',
    Value: '销售订单',
  },
];
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
    showBaseType: false,
  };

  columns = [
    {
      title: '单号',
      width: 80,
      fixed: 'left',
      dataIndex: 'DocEntry',
      render: text => (
        <Link target="_blank" to={`/base/print/detail?DocEntry=${text}`}>
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
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '内容模板',
      width: 100,
      dataIndex: 'HtmlTemplateCode',
    },
    {
      title: '来源类型',
      width: 150,
      dataIndex: 'BaseType',
      render: text => <span>{getName(printOrderType, text)}</span>,
    },
    {
      title: '输出类别',
      width: 100,
      dataIndex: 'OutType',
      render: text => <span>{getName(printType, text)}</span>,
    },
    {
      title: '来源单号',
      width: 100,
      dataIndex: 'BaseEntry',
    },
    {
      title: '模板代码',
      width: 100,
      dataIndex: 'PrintTemplateCode',
    },
    {
      title: '模板名称',
      dataIndex: 'PrintTemplateName',
    },
  ];

  componentDidMount() {
    const { QueryType, QueryKey } = this.props;
    const includeType = ['1', '5', '6'];
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
        showBaseType: includeType.includes(QueryType),
      },
      () => {
        this.getPrintHistory(queryData);
      }
    );
  }

  getPrintHistory = async params => {
    const response = await request('/Report/TI_Z045/TI_Z04504', {
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
      } else {
        this.setState({
          orderList: [],
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
        this.getPrintHistory(queryData);
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
          this.getPrintHistory(queryData);
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
    const { showBaseType } = this.state;
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
          {showBaseType ? (
            <Col md={5} sm={24}>
              <FormItem key="BaseType" {...formLayout} label="来源类型">
                {getFieldDecorator('BaseType')(<MDMCommonality data={BaseType} />)}
              </FormItem>
            </Col>
          ) : (
            ''
          )}
          <Col md={5} sm={24}>
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
              scroll={{ x: 1500, y: 800 }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default ClientAsk;
