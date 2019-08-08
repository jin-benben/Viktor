/* eslint-disable no-script-url */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, DatePicker, Tabs, Tag,Select } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';
import { getName } from '@/utils/utils';

const FormItem = Form.Item;
const {Option}=Select
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
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
      render: (text, record) => (
        <a href="javascript:void(0)" onClick={() => this.whichGo(text, record.ObjType)}>
          {text}
        </a>
      ),
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
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
      title: '销售员',
      dataIndex: 'SlpCode',
      width: 120,
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
      width: 80,
      fixed: 'left',
      dataIndex: 'DocEntry',
      render: (text, record) => (
        <a href="javascript:void(0)" onClick={() => this.whichGo(text, record.ObjType)}>
          {text}
        </a>
      ),
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
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
      title: '未清数量',
      dataIndex: 'OpenQty',
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
      width: 120,
      render: text => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, text)}</span>;
      },
    },
  ];

  columns2 = [
    {
      title: '单号',
      width: 80,
      dataIndex: 'DocEntry',
    },
    {
      title: '单据类型',
      dataIndex: 'ObjType',
      width: 80,
      render: val => <span>{val === '24' ? '收款' : '付款'}</span>,
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '客户',
      width: 200,
      dataIndex: 'CardName',
    },
    {
      title: '转帐金额',
      width: 100,
      dataIndex: 'TrsfrSum',
    },
    {
      title: '记账名称',
      width: 200,
      dataIndex: 'AcctName',
    },

    {
      title: '备注',
      width: 200,
      dataIndex: 'Comments',
    },
    {
      title: '单据总计',
      width: 100,
      dataIndex: 'DocTotal',
    },
  ];

  comColumns = [
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
      width: 120,
    },
    {
      title: '发货时间',
      dataIndex: 'U_DeliverDate',
      width: 100,
      render: val => (
        <Ellipsis tooltip lines={1}>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '快递单号',
      dataIndex: 'U_ExpressNumber',
      width: 100,
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
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

  columns4 = [
    {
      title: '单据类型',
      dataIndex: 'ObjType',
      width: 80,
      fixed: 'left',
      render: val => <span>{val === '15' ? '交货单' : '退货单'}</span>,
    },
    ...this.columns1,
    ...this.comColumns,
  ];

  columns3 = [
    {
      title: '单据类型',
      dataIndex: 'ObjType',
      fixed: 'left',
      width: 80,
      render: val => <span>{val === '15' ? '交货单' : '退货单'}</span>,
    },
    ...this.columns,
    ...this.comColumns,
  ];

  columns6 = [
    {
      title: '单据类型',
      dataIndex: 'ObjType',
      width: 80,
      fixed: 'left',
      render: val => <span>{val === '13' ? '发票' : '贷项'}</span>,
    },
    ...this.columns1,
    ...this.comColumns,
  ];

  columns5 = [
    {
      title: '单据类型',
      dataIndex: 'ObjType',
      width: 80,
      fixed: 'left',
      render: val => <span>{val === '13' ? '发票' : '贷项'}</span>,
    },
    ...this.columns,
    ...this.comColumns,
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

    dispatch({
      type: 'global/getAuthority',
    });

    this.whichSerch(activeKey, queryData);
  }

  whichGo = (DocEntry, ObjType) => {
    const { activeKey } = this.state;
    if (activeKey === '1' || activeKey === '2') {
      window.open(`/sellabout/orderdetail?DocEntry=${DocEntry}`);
    }
    if (activeKey === '5' || activeKey === '4') {
      window.open(`/sellabout/odlnordnDetail?DocEntry=${DocEntry}&ObjType=${ObjType}`);
    }
    if (activeKey === '7' || activeKey === '6') {
      window.open(`/sellabout/oinvorinDetail?DocEntry=${DocEntry}&ObjType=${ObjType}`);
    }
  };

  activeKeyChange = activeKey => {
    const {
      transaction: { queryData },
    } = this.props;
    this.setState({ activeKey });
    this.whichSerch(activeKey, queryData);
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
        type: 'transaction/getOrdrLine',
        payload,
      });
    }
    if (activeKey === '3') {
      dispatch({
        type: 'transaction/getOrctovpm',
        payload,
      });
    }
    if (activeKey === '4') {
      dispatch({
        type: 'transaction/getOdlnordn',
        payload,
      });
    }
    if (activeKey === '5') {
      dispatch({
        type: 'transaction/getOdlnordnLine',
        payload,
      });
    }
    if (activeKey === '6') {
      dispatch({
        type: 'transaction/getOinvorin',
        payload,
      });
    }
    if (activeKey === '7') {
      dispatch({
        type: 'transaction/getOinvorinLine',
        payload,
      });
    }
  };

  handleStandardTableChange = pagination => {
    const {
      transaction: { queryData },
    } = this.props;
    const { activeKey } = this.state;
    this.whichSerch(activeKey, {
      ...queryData,
      page: pagination.current,
      rows: pagination.pageSize,
    });
  };

  handleSearch = e => {
    // 搜索
    e.preventDefault();
    const {
      transaction: { queryData },
      form,dispatch
    } = this.props;
    const { activeKey } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let DocDateFrom;
      let DocDateTo;
      if (fieldsValue.dateArr) {
        DocDateFrom = moment(fieldsValue.dateArr[0]).format('YYYY-MM-DD');
        DocDateTo = moment(fieldsValue.dateArr[1]).format('YYYY-MM-DD');
        // eslint-disable-next-line no-param-reassign
        delete fieldsValue.dateArr;
      }
     
      if( ["1", "4", "6"].includes(activeKey)){
        Object.assign(queryData.Content,{DocStatus:fieldsValue.Status})
      }
      if( ["2", "5", "7"].includes(activeKey)){
        Object.assign(queryData.Content,{LineStatus:fieldsValue.Status})
      }
      delete fieldsValue.Status
      Object.assign(queryData.Content,{ ...fieldsValue,
        DocDateFrom,
        DocDateTo,})
      Object.assign(queryData,{   page: 1,
        rows: 20,})  
      dispatch({
        type:"transaction/save",
        payload:{
          queryData
        }
      })  
      this.whichSerch(activeKey,queryData);
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
    const {activeKey}=this.state
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
          <Col md={8} lg={6} sm={24}>
            <FormItem label="日期" {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="SlpCode" {...formLayout} label="销售员">
              {getFieldDecorator('SlpCode')(<SalerPurchaser />)}
            </FormItem>
          </Col>
          {
            activeKey!=="3"?(
              <Col md={4} sm={24}>
                <FormItem key="Status" {...formLayout} label="状态">
                  {getFieldDecorator('Status')(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      <Option value="C">已清</Option>
                      <Option value="O">未清</Option>
                      <Option value="">全部</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            ):''
          }
         
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
        ordrLineList,
        odlnordnLineList,
        oinvorinLineList,
        pagination,
      },
      loading,
    } = this.props;
    const { activeKey } = this.state;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <Tabs defaultActiveKey={activeKey} onChange={this.activeKeyChange} animated={false}>
              <TabPane tab="销售订单查询" key="1" forceRender>
                <StandardTable
                  loading={loading}
                  data={{ list: ordrList }}
                  pagination={pagination}
                  rowKey="key"
                  scroll={{ x: 1500}}
                  columns={this.columns}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
              <TabPane tab="销售订单物料查询" key="2" forceRender>
                <StandardTable
                  loading={loading}
                  data={{ list: ordrLineList }}
                  pagination={pagination}
                  rowKey="key"
                  scroll={{ x: 1700}}
                  columns={this.columns1}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
              <TabPane tab="收付款查询" key="3" forceRender>
                <StandardTable
                  loading={loading}
                  data={{ list: orctovpmList }}
                  pagination={pagination}
                  rowKey="key"
                  scroll={{ x: 1200}}
                  columns={this.columns2}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
              <TabPane tab="交货退货查询" key="4" forceRender>
                <StandardTable
                  loading={loading}
                  data={{ list: odlnordnList }}
                  pagination={pagination}
                  rowKey="key"
                  scroll={{ x: 2200}}
                  columns={this.columns3}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
              <TabPane tab="交货退货物料查询" key="5" forceRender>
                <StandardTable
                  loading={loading}
                  data={{ list: odlnordnLineList }}
                  pagination={pagination}
                  rowKey="key"
                  scroll={{ x: 2100}}
                  columns={this.columns4}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
              <TabPane tab="发票贷项查询" key="6" forceRender>
                <StandardTable
                  loading={loading}
                  data={{ list: oinvorinList }}
                  pagination={pagination}
                  rowKey="key"
                  scroll={{ x: 2100}}
                  columns={this.columns5}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
              <TabPane tab="发票贷项物料查询" key="7" forceRender>
                <StandardTable
                  loading={loading}
                  data={{ list: oinvorinLineList }}
                  pagination={pagination}
                  rowKey="key"
                  scroll={{ x: 2200}}
                  columns={this.columns6}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default TransactionSearch;
