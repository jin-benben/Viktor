/* eslint-disable no-param-reassign */
import React, { Fragment } from 'react';

import moment from 'moment';
import { Row, Col, Form, Input, Button, DatePicker, Checkbox, message } from 'antd';
import { connect } from 'dva';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import SupplierSelect from '@/components/Select/Supplier';
import MDMCommonality from '@/components/Select';
import { getName } from '@/utils/utils';
import OrderModal from './orderModal';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
@connect(({ global }) => ({
  global,
}))
@Form.create()
class NeedTabl extends React.Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    orderLineList: [],
  };

  columns = [
    {
      title: '供应商',
      width: 200,
      fixed: 'left',
      dataIndex: 'supplier',
      render: (text, record, index) => (
        <SupplierSelect
          initialValue={{ key: record.SupplierCode, label: record.SupplierName }}
          onChange={value => this.changeSupplier(value, record, index)}
          keyType="Name"
        />
      ),
    },
    {
      title: '单号',
      width: 100,
      dataIndex: 'DocEntry',
    },
    {
      title: '行号',
      width: 50,
      dataIndex: 'LineID',
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '创建日期',
      width: 100,
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
          {text}{' '}
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
          {' '}
          {text}{' '}
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
    },
    {
      title: '型号',
      width: 100,
      dataIndex: 'ManufactureNO',
    },
    {
      title: '参数',
      width: 100,
      dataIndex: 'Parameters',
    },
    {
      title: '包装',
      width: 100,
      dataIndex: 'Package',
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
      title: '要求交期',
      dataIndex: 'DueDate',
      width: 100,
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.orderLineList !== prevState.orderLineList) {
      return {
        orderLineList: nextProps.orderLineList,
      };
    }
    return null;
  }

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
    const { form, seachHandle } = this.props;

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
        SLineStatus: fieldsValue.SLineStatus && fieldsValue.SLineStatus ? 'C' : 'O',
      };
      seachHandle(queryData);
    });
  };

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  // 确认需要采购询价
  selectNeed = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length) {
      this.handleModalVisible(true);
    } else {
      message.warning('请先选择');
    }
  };

  // 需询价弹窗
  handleModalVisible = flag => {
    this.setState({ modalVisible: !!flag });
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
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 10 },
      },
    };
    const searchFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 6,
        },
      },
    };
    return (
      <Form onSubmit={this.handleSearch} {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem key="SearchText" label="客户名称" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入客户名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="日期" {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <FormItem label="销售员" {...formLayout}>
              {getFieldDecorator('Owner')(<MDMCommonality data={Saler} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem {...searchFormItemLayout}>
              {getFieldDecorator('SLineStatus', { valuePropName: 'checked', initialValue: false })(
                <Checkbox>已询价</Checkbox>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="searchBtn" {...searchFormItemLayout}>
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
    const { pagination, loading } = this.props;
    const { selectedRows, modalVisible, orderLineList } = this.state;

    const columns = this.columns.map(item => {
      // eslint-disable-next-line no-param-reassign
      item.align = 'Center';
      return item;
    });

    const parentMethods = {
      handleSubmit: this.submitNeedLine,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <div className="tableList">
          <div className="tableListForm">{this.renderSimpleForm()}</div>
          <StandardTable
            loading={loading}
            data={{ list: orderLineList }}
            pagination={pagination}
            rowKey="Key"
            scroll={{ x: 2400, y: 500 }}
            columns={columns}
            rowSelection={{
              onSelectRow: this.onSelectRow,
            }}
            onChange={this.handleStandardTableChange}
          />
          <Button onClick={this.selectNeed} type="primary">
            下一步
          </Button>
          <OrderModal data={selectedRows} {...parentMethods} modalVisible={modalVisible} />
        </div>
      </Fragment>
    );
  }
}

export default NeedTabl;
