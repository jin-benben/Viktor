import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Tabs, Tag } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import { getName } from '@/utils/utils';

const FormItem = Form.Item;
const { TabPane } = Tabs;

/* eslint react/no-multi-comp:0 */
@connect(({ transaction, loading, global }) => ({
  transaction,
  global,
  loading: loading.models.transaction,
}))
@Form.create()
class TransactionSearch extends PureComponent {
  columns = [
    {
      title: '单号',
      width: 80,
      fixed: 'left',
      dataIndex: 'DocEntry',
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '客户',
      dataIndex: 'CardName',
      width: 200,
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
      title: '联系人',
      dataIndex: 'Linkman',
      width: 80,
    },
    {
      title: '地址',
      dataIndex: 'Address',
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          <span>{`${record.ShipToCode + record.Address2}`}</span>
        </Ellipsis>
      ),
    },
    {
      title: '电话',
      dataIndex: 'Cellolar',
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'Comments',
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
      title: '单据总计',
      dataIndex: 'DocTotal',
      width: 100,
    },
    {
      title: '交易公司',
      dataIndex: 'U_CompanyCode',
      width: 100,
      render: text => {
        const {
          global: { Company },
        } = this.props;
        return <span>{getName(Company, text)}</span>;
      },
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
  ];

  columns1 = [
    {
      title: '单号',
      dataIndex: 'DocEntry',
    },
    {
      title: '单据类型',
      dataIndex: 'ObjType',
      //  render: val => <span>{}</span>,
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '客户',
      dataIndex: 'CardName',
    },
    {
      title: '转帐金额',
      dataIndex: 'TrsfrSum',
    },
    {
      title: '记账名称',
      dataIndex: 'AcctName',
    },

    {
      title: '备注',
      dataIndex: 'Comments',
    },
    {
      title: '单据总计',
      dataIndex: 'DocTotal',
    },
  ];

  columns2 = [
    ...this.columns,
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
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
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

  state = {
    expandForm: false,
    activeKey: '3',
  };

  componentDidMount() {
    const {
      dispatch,
      transaction: { queryData },
    } = this.props;
    const { activeKey } = this.state;
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Company', 'Trnsp', 'Purchaser'],
        },
      },
    });

    this.whichSerch(activeKey, queryData);
  }

  activeKeyChange = activeKey => {
    this.setState({ activeKey });
  };

  whichSerch = (activeKey, payload) => {
    const { dispatch } = this.props;
    if (activeKey === '1') {
      dispatch({
        type: 'transaction/getOrdr',
        payload,
      });
    }
    if (activeKey === '2') {
      dispatch({
        type: 'transaction/getOrctovpm',
        payload,
      });
    }
    console.log(activeKey);
    if (activeKey === '3') {
      dispatch({
        type: 'transaction/getOdlnordn',
        payload,
      });
    }
    if (activeKey === '4') {
      dispatch({
        type: 'transaction/getOinvorin',
        payload,
      });
    }
  };

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      transaction: { queryData },
    } = this.props;
    dispatch({
      type: 'transaction/getOrdr',
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
        type: 'transaction/getOrdr',
        payload: {
          Content: {
            SearchText: '',
            SearchKey: 'Name',
            ...fieldsValue,
          },
          page: 1,
          rows: 30,
          sidx: 'Code',
          sord: 'Desc',
        },
      });
    });
  };

  toggleForm = () => {
    // 是否展开
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
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
      transaction: {
        ordrList,
        orctovpmList,
        odlnordnList,
        oinvorinList,
        pagination1,
        pagination2,
        pagination3,
        pagination4,
      },
      loading,
    } = this.props;
    const { activeKey } = this.state;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <Tabs defaultActiveKey={activeKey} onChange={this.activeKeyChange}>
              <TabPane tab="销售订单查询" key="1">
                <StandardTable
                  loading={loading}
                  data={{ list: ordrList }}
                  pagination={pagination1}
                  rowKey="DocEntry"
                  scroll={{ x: 1500, y: 600 }}
                  columns={this.columns}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
              <TabPane tab="收付款查询" key="2">
                <StandardTable
                  loading={loading}
                  data={{ list: orctovpmList }}
                  pagination={pagination2}
                  rowKey="DocEntry"
                  scroll={{ y: 600 }}
                  columns={this.columns1}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
              <TabPane tab="交货退货查询" key="3">
                <StandardTable
                  loading={loading}
                  data={{ list: odlnordnList }}
                  pagination={pagination3}
                  rowKey="DocEntry"
                  scroll={{ x: 2300, y: 600 }}
                  columns={this.columns2}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
              <TabPane tab="发票贷项查询" key="4">
                <StandardTable
                  loading={loading}
                  data={{ list: oinvorinList }}
                  pagination={pagination4}
                  rowKey="DocEntry"
                  scroll={{ x: 2300, y: 600 }}
                  columns={this.columns2}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
            </Tabs>
            ,
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default TransactionSearch;
