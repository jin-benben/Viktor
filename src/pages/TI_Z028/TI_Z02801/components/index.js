import React, { Component, Fragment } from 'react';
import { Row, Col, Form, Input, DatePicker, Modal, Table, message } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import MDMCommonality from '@/components/Select';
import moment from 'moment';
import { connect } from 'dva';
import { getName } from '@/utils/utils';

const FormItem = Form.Item;

@connect(({ global }) => ({
  global,
}))
@Form.create()
class OrderPreview extends Component {
  state = {
    orderLineList: [],
    selectedRows: [],
  };

  columns = [
    {
      title: '客询价单',
      width: 100,
      dataIndex: 'BaseEntry',
    },
    {
      title: '客询价行',
      width: 100,
      dataIndex: 'BaseLineID',
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
      title: '销售员',
      width: 100,
      dataIndex: 'Saler',
      render: text => {
        const { Saler } = this.props;
        return <span>{getName(Saler, text)}</span>;
      },
    },
    {
      title: '客户参考号',
      width: 120,
      dataIndex: 'NumAtCard',
    },
    {
      title: 'SKU',
      width: 80,
      dataIndex: 'SKU',
    },
    {
      title: '产品描述',
      width: 150,
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
        const { Purchaser } = this.props;
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
      title: '行备注',
      width: 100,
      dataIndex: 'SLineComment',
    },
    {
      title: '要求交期',
      dataIndex: 'DueDate',
      width: 120,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '采购价格',
      width: 100,
      dataIndex: 'Price',
    },
    {
      title: '采购交期',
      width: 120,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '采购备注',
      width: 100,
      dataIndex: 'LineComment',
    },
    {
      title: '供应商',
      width: 150,
      dataIndex: 'CardName',
    },
  ];

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.orderLineList !== prevState.orderLineList) {
      return {
        orderLineList: nextProps.orderLineList,
        selectedRowKeys: nextProps.orderLineList.map(item => item.LineID),
      };
    }
    return null;
  }

  onSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows: [...selectedRows], selectedRowKeys: [...selectedRowKeys] });
  };

  expandedRowRender = record => {
    const { childColumns } = this.props;
    return (
      <Table
        dataSource={record.TI_Z02803}
        pagination={false}
        bordered
        rowKey="Key"
        columns={childColumns}
      />
    );
  };

  okHandle = () => {
    const { selectedRows } = this.state;
    const { handleSubmit, form } = this.props;
    if (selectedRows.length) {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const queryData = {
          ...fieldsValue,
          DocDate: moment(fieldsValue.DocDate).format('YYYY-MM-DD'),
          ToDate: moment(fieldsValue.ToDate).format('YYYY-MM-DD'),
        };
        handleSubmit(selectedRows, queryData);
      });
    } else {
      message.warning('请先选择');
    }
  };

  // form表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      Saler,
      Company,
    } = this.props;

    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
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
    const ToDate = moment().add('30', 'day'); // 询价日期当前时间后30天
    return (
      <Form onSubmit={this.handleSearch} {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem key="DocDate" label="单据日期" {...formLayout}>
              {getFieldDecorator('DocDate', {
                rules: [{ required: true, message: '请选择单据日期' }],
                initialValue: moment(),
              })(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="ToDate" label="有效日期" {...formLayout}>
              {getFieldDecorator('ToDate', {
                rules: [{ required: true, message: '请选择有效日期' }],
                initialValue: ToDate,
              })(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="Owner" {...formLayout} label="所有者">
              {getFieldDecorator('Owner', { rules: [{ required: true, message: '请选择所有者' }] })(
                <MDMCommonality data={Saler} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="CompanyCode" {...formLayout} label="交易公司">
              {getFieldDecorator('CompanyCode', {
                rules: [{ required: true, message: '请选择交易公司' }],
              })(<MDMCommonality data={Company} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="Comment" {...formLayout} label="备注">
              {getFieldDecorator('Comment', {
                rules: [{ required: true, message: '请输入备注' }],
              })(<Input placeholder="请输入客户名称" />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { modalVisible, handleModalVisible } = this.props;
    const { orderLineList, selectedRowKeys } = this.state;
    return (
      <div>
        <Modal
          width={1200}
          destroyOnClose
          title="确认选择"
          visible={modalVisible}
          onOk={this.okHandle}
          onCancel={() => handleModalVisible()}
        >
          <Fragment>
            {this.renderSimpleForm()}
            <Table
              bordered
              pagination={false}
              dataSource={orderLineList}
              rowKey="LineID"
              scroll={{ x: 2500 }}
              rowSelection={{
                onChange: this.onSelectRow,
                selectedRowKeys,
              }}
              expandedRowRender={this.expandedRowRender}
              columns={this.columns}
            />
          </Fragment>
        </Modal>
      </div>
    );
  }
}

export default OrderPreview;
