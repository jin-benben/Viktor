/* eslint-disable no-param-reassign */
import React, { Fragment } from 'react';

import moment from 'moment';
import { Row, Col, Form, Input, Table, Button, DatePicker, Checkbox } from 'antd';
import { connect } from 'dva';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import SupplierSelect from '@/components/Select/Supplier';
import MDMCommonality from '@/components/Select';
import { getName } from '@/utils/utils';
import styles from '../style.less';
import request from '@/utils/request';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
@connect(({ global, loading }) => ({
  global,
  loading: loading.global,
}))
@Form.create()
class NeedTabl extends React.Component {
  state = {
    selectedRowKeys: [],
    orderLineList: [],
    queryData: {
      Content: {
        SearchText: '',
        QueryType: '4',
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
  };

  columns = [
    {
      title: '供应商',
      width: 200,
      fixed: 'left',
      dataIndex: 'supplier',
      render: (text, record, index) => (
        <SupplierSelect
          //  initialValue={{ key: record.SupplierCode, label: record.SupplierName }}
          onChange={value => this.changeSupplier(value, record, index)}
          keyType="Name"
        />
      ),
    },
    {
      title: '单号',
      width: 100,
      dataIndex: 'DocEntry',
      render: (val, record) => (
        <a href={`/sellabout/TI_Z026/TI_Z02602?DocEntry=${record.DocEntry}`} alt="单号">
          {val}
        </a>
      ),
    },
    {
      title: '行号',
      width: 80,
      dataIndex: 'LineID',
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 120,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '创建日期',
      width: 120,
      dataIndex: 'CreateDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '客户',
      dataIndex: 'CardName',
      width: 200,
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '销售员',
      width: 100,
      dataIndex: 'Owner',
      render: text => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, text)}</span>;
      },
    },
    {
      title: '客户参考号',
      width: 150,
      dataIndex: 'NumAtCard',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: 'SKU',
      width: 80,
      dataIndex: 'SKU',
    },
    {
      title: '产品描述',
      dataIndex: 'SKUName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '品牌',
      width: 80,
      dataIndex: 'BrandName',
    },
    {
      title: '名称',
      width: 100,
      dataIndex: 'ProductName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '型号',
      width: 100,
      dataIndex: 'ManufactureNO',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '参数',
      width: 100,
      dataIndex: 'Parameters',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '包装',
      width: 100,
      dataIndex: 'Package',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '采购员',
      width: 80,
      dataIndex: 'Purchaser',
      render: text => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, text)}</span>;
      },
    },
    {
      title: '数量',
      width: 80,
      dataIndex: 'Quantity',
    },
    {
      title: '单位',
      width: 80,
      dataIndex: 'Unit',
    },
    {
      title: '仓库',
      width: 120,
      dataIndex: 'WhsCode',
      render: text => {
        const {
          global: { WhsCode },
        } = this.props;
        return <span>{getName(WhsCode, text)}</span>;
      },
    },
    {
      title: '要求交期',
      dataIndex: 'DueDate',
      width: 120,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '价格',
      width: 100,
      dataIndex: 'Price',
    },
    {
      title: '行备注',
      width: 80,
      dataIndex: 'LineComment',
    },
    {
      title: '销售总计',
      width: 100,
      dataIndex: 'LineTotal',
    },
  ];

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.orderLineList !== prevState.orderLineList) {
  //     return {
  //       orderLineList: nextProps.orderLineList,
  //     };
  //   }
  //   return null;
  // }

  componentDidMount() {
    const { queryData } = this.state;
    this.fetchOrder(queryData);
  }

  fetchOrder = async params => {
    const response = await request('/OMS/TI_Z026/TI_Z02607', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    if (response.Status !== 200) {
      return;
    }
    this.setState({ orderLineList: response.Content ? response.Content.rows : [] });
  };

  handleStandardTableChange = pagination => {
    const { queryData } = this.state;
    this.fetchOrder({ ...queryData, page: pagination.current, rows: pagination.pageSize });
  };

  handleSearch = e => {
    // 搜索
    e.preventDefault();
    const { form } = this.props;
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
        ...fieldsValue.orderNo,
      };
      this.fetchOrder({
        Content: {
          SearchText: '',
          QueryType: '4',
          SearchKey: '',
          ...queryData,
        },
        page: 1,
        rows: 30,
        sidx: 'DocEntry',
        sord: 'Desc',
      });
    });
  };

  changeSupplier = (value, record, index) => {
    record.SupplierCode = value.Code || value.key;
    record.SupplierName = value.Name || value.label;
    const { orderLineList } = this.state;
    orderLineList[index] = record;
    this.setState({ orderLineList: [...orderLineList] });
  };

  handleStandardTableChange = pagination => {
    const { tabChange } = this.props;
    if (tabChange) {
      tabChange(pagination);
    }
  };

  submitNeedLine = select => {
    const { nextStep } = this.props;
    if (nextStep) {
      nextStep(select, 1);
    }
  };

  handleSearch = e => {
    // 搜索
    e.preventDefault();
    const { form } = this.props;

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
        ...fieldsValue.orderNo,
        PLineStatus: fieldsValue.SLineStatus && fieldsValue.PLineStatus ? 'C' : 'O',
      };
      this.fetchOrder({
        Content: {
          SearchText: '',
          QueryType: '4',
          SearchKey: '',
          ...queryData,
        },
        page: 1,
        rows: 30,
        sidx: 'DocEntry',
        sord: 'Desc',
      });
    });
  };

  onSelectRow = (selectedRowKeys, selectedRows) => {
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }
    this.setState({ selectedRowKeys: [...selectedRowKeys] });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      global: { Saler },
    } = this.props;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem key="SearchText">
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="日期" {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>

          <Col md={5} sm={24}>
            <FormItem label="销售员" {...formLayout}>
              {getFieldDecorator('Owner')(<MDMCommonality data={Saler} />)}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem>
              {getFieldDecorator('PLineStatus', { valuePropName: 'checked', initialValue: false })(
                <Checkbox>已询价</Checkbox>
              )}
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
    const { pagination, orderLineList, selectedRowKeys } = this.state;
    const { loading } = this.props;
    const columns = this.columns.map(item => {
      // eslint-disable-next-line no-param-reassign
      item.align = 'Center';
      return item;
    });
    return (
      <Fragment>
        <div className={styles.tableList}>
          <div className="tableListForm">{this.renderSimpleForm()}</div>
          <Table
            bordered
            loading={loading}
            dataSource={orderLineList}
            rowKey="Key"
            pagination={pagination}
            scroll={{ x: 2600, y: 600 }}
            rowSelection={{
              onChange: this.onSelectRow,
              selectedRowKeys,
            }}
            onChange={this.handleStandardTableChange}
            columns={columns}
          />
        </div>
      </Fragment>
    );
  }
}

export default NeedTabl;
