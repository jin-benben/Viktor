/* eslint-disable react/destructuring-assignment */
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import Link from 'umi/link';
import { connect } from 'dva';
import { Row, Col, Form, Input, DatePicker, Modal, Table, List, Icon, message } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import MDMCommonality from '@/components/Select';

import { getName } from '@/utils/utils';

import styles from '../../style.less';

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
      render: (text, recond) => (
        <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${text}`}>
          {`${text}-${recond.BaseLineID}`}
        </Link>
      ),
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
      title: '数量',
      width: 80,
      dataIndex: 'Quantity',
    },
    {
      title: '价格',
      width: 80,
      dataIndex: 'Price',
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
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '运费',
      width: 80,
      dataIndex: 'ForeignFreight',
    },
    {
      title: '要求交期',
      dataIndex: 'DueDate',
      width: 120,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '采购交期',
      width: 120,
      dataIndex: 'InquiryDueDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '采购备注',
      width: 100,
      dataIndex: 'LineComment',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
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
        selectedRows: nextProps.orderLineList,
      };
    }
    return null;
  }

  onSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows: [...selectedRows], selectedRowKeys: [...selectedRowKeys] });
  };

  expandedRowRender = record => (
    <List
      itemLayout="horizontal"
      style={{ marginLeft: 60 }}
      className={styles.askInfo}
      dataSource={record.TI_Z02803}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            title={`${item.CardName}(${item.CardCode})`}
            description={
              <ul className={styles.itemInfo}>
                <li>
                  联系人：<span>{item.Contacts}</span>
                </li>
                <li>
                  手机：<span>{item.CellphoneNO}</span>
                </li>
                <li>
                  邮箱：<span>{item.Email}</span>
                </li>
                <li>
                  备注：<span>{item.LineComment}</span>
                </li>
                <li>
                  价格：<span>{item.Price}</span>
                </li>
                <li>
                  交期：<span>{moment(item.InquiryDueDate).format('YYYY-MM-DD')}</span>
                </li>
                <li>
                  询价返回时间：<span>{moment(item.PriceRDateTime).format('YYYY-MM-DD')}</span>
                </li>
                <li>
                  询价单号：
                  <Link
                    target="_blank"
                    style={{ marginLeft: 10 }}
                    to={`/purchase/TI_Z027/update?DocEntry=${item.PInquiryEntry}`}
                  >
                    {item.PInquiryEntry}
                  </Link>
                </li>
                <li>
                  最优：
                  <span>
                    {item.IsSelect === 'Y' ? (
                      <Icon type="smile" theme="twoTone" />
                    ) : (
                      <Icon type="frown" theme="twoTone" />
                    )}
                  </span>
                </li>
                <li>
                  币种：
                  <span>{getName(this.props.global.Curr, item.Currency)}</span>
                </li>
                <li>
                  汇率：
                  <span>{item.DocRate}</span>
                </li>
              </ul>
            }
          />
        </List.Item>
      )}
    />
  );

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
      global: { Purchaser, currentUser },
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
      <Form {...formItemLayout}>
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
              {getFieldDecorator('Owner', {
                rules: [{ required: true, message: '请选择所有者' }],
                initialValue: currentUser.Owner,
              })(<MDMCommonality initialValue={currentUser.Owner} data={Purchaser} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="Comment" {...formLayout} label="备注">
              {getFieldDecorator('Comment')(<Input placeholder="请输入客户名称" />)}
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
              size="middle"
              dataSource={orderLineList}
              rowKey="LineID"
              scroll={{ x: 1600 }}
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
