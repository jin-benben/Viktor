import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, DatePicker, Tag } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import Organization from '@/components/Organization/multiple';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';
import { getName } from '@/utils/utils';
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
      fixed: 'left',
      dataIndex: 'DocEntry',
      render: (text, records) => (
        <Link
          target="_blank"
          to={`/sellabout/oinvorinDetail?DocEntry=${text}&ObjType=${records.ObjType}`}
        >
          {text}
        </Link>
      ),
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '单据类型',
      dataIndex: 'ObjType',
      width: 80,
      render: val => <span>{val === '13' ? '发票' : '贷项'}</span>,
    },
    {
      title: '单据状态',
      dataIndex: 'DocStatus',
      width: 80,
      render: text => (text === 'O' ? <Tag color="gold">未清</Tag> : <Tag color="green">已清</Tag>),
    },
    {
      title: '客户',
      dataIndex: 'CardName',
      width: 150,
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '客户参考号',
      dataIndex: 'NumAtCard',
      width: 100,
    },
    {
      title: '物料代码',
      dataIndex: 'ItemCode',
      width: 80,
    },

    {
      title: '物料名称',

      dataIndex: 'ItemName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '单位',
      dataIndex: 'InvntryUom',
      width: 80,
    },
    {
      title: '数量',
      dataIndex: 'Quantity',
      width: 80,
    },

    {
      title: '含税价格',
      dataIndex: 'PriceAfVAT',
      width: 80,
    },
    {
      title: '行总计',
      dataIndex: 'LineTotal',
      width: 100,
    },
    {
      title: '行备注',
      dataIndex: 'FreeTxt',
      width: 200,
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '合同号',
      dataIndex: 'U_ContractEntry',
      width: 100,
    },

    {
      title: '销售员',
      dataIndex: 'SlpCode',
      width: 80,
      render: text => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, text)}</span>;
      },
    },
    {
      title: '发货状态',
      dataIndex: 'U_DeliverSts',
      width: 80,
      render: text =>
        text === 'Y' ? <Tag color="green">已发货</Tag> : <Tag color="gold">未发货</Tag>,
    },
    {
      title: '发货人',
      dataIndex: 'U_DeliverUser',
      width: 80,
    },
    {
      title: '发货时间',
      dataIndex: 'U_DeliverDate',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '快递单号',
      dataIndex: 'U_ExpressNumber',
      width: 100,
    },
    {
      title: '运输类型',
      dataIndex: 'TrnspCode',
      width: 100,
      render: text => {
        const {
          global: { Trnsp },
        } = this.props;
        return <span>{getName(Trnsp, text)}</span>;
      },
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
    const { loading, QueryType } = this.props;
    const { pagination, orderList } = this.state;
    if (QueryType === '4') {
      this.columns = this.columns.filter(item => item.dataIndex !== 'CardName');
    }
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
