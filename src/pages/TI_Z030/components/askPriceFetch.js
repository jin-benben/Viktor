import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { getName } from '@/utils/utils';
import moment from 'moment';
import { Row, Col, Form, Input, Button, DatePicker, Modal, message } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import request from '@/utils/request';
import StandardTable from '@/components/StandardTable';
import DocEntryFrom from '@/components/DocEntryFrom';
import MDMCommonality from '@/components/Select';
import Link from 'umi/link';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ global, loading }) => ({
  global,
  loading: loading.models.global,
}))
@Form.create()
class orderLine extends PureComponent {
  state = {
    expandForm: false,
    orderLineList: [],
    selectedRows: [],
    queryData: {
      Content: {
        QueryType: '2',
        CardCode: '',
        SearchText: '',
        SearchKey: 'Name',
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
      title: '单号',
      width: 50,
      fixed: 'left',
      dataIndex: 'DocEntry',
      render: (text, recond) => (
        <Link target="_blank" to={`/sellabout/TI_Z029/detail?DocEntry=${text}`}>
          {`${text}-${recond.LineID}`}
        </Link>
      ),
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
      title: '客户参考号',
      width: 100,
      dataIndex: 'NumAtCard',
    },
    {
      title: '询价交期',
      width: 100,
      dataIndex: 'InquiryDueDate',
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
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}{' '}
        </Ellipsis>
      ),
    },
    {
      title: '销售总计',
      width: 100,
      dataIndex: 'LineTotal',
    },
    {
      title: '询价总计',
      width: 100,
      dataIndex: 'InquiryLineTotalLocal',
    },

    {
      title: '销售员',
      width: 80,
      dataIndex: 'Owner',
      render: text => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, text)}</span>;
      },
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
  ];

  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) onRef(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { queryData } = prevState;
    if (nextProps.SearchText !== queryData.SearchText || nextProps.QueryType) {
      queryData.Content.CardCode = nextProps.SearchText;
      queryData.Content.QueryType = nextProps.QueryType
        ? nextProps.QueryType
        : queryData.Content.QueryType;
      return {
        queryData: { ...queryData },
      };
    }
    return null;
  }

  fetchOrder = async params => {
    const response = await request('/OMS/TI_Z029/TI_Z02907', {
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
      // eslint-disable-next-line no-param-reassign
      delete fieldsValue.orderNo;
      const queryData = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
        ...fieldsValue.orderNo,
      };

      this.fetchOrder({
        Content: {
          // eslint-disable-next-line react/destructuring-assignment
          ...this.state.queryData.Content,
          ...queryData,
        },
        page: 1,
        rows: 30,
        sidx: 'DocEntry',
        sord: 'Desc',
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

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  okHandle = () => {
    const { selectedRows } = this.state;
    const { handleSubmit } = this.props;
    if (selectedRows.length) {
      handleSubmit(selectedRows);
    } else {
      message.warning('请先选择');
    }
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
            <FormItem key="SearchText" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="日期" {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="所有者" {...formLayout}>
              {getFieldDecorator('Owner')(<MDMCommonality data={Saler} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="orderNo" {...formLayout} label="单号">
              {getFieldDecorator('orderNo', {
                initialValue: { DocEntryFrom: '', DocEntryTo: '' },
              })(<DocEntryFrom />)}
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
    const { loading, handleModalVisible, modalVisible } = this.props;
    const { orderLineList, pagination } = this.state;

    const columns = this.columns.map(item => {
      // eslint-disable-next-line no-param-reassign
      item.align = 'Center';
      return item;
    });

    return (
      <Modal
        width={1200}
        destroyOnClose
        title="销售报价单物料查询"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <div className="tableList">
          <div className="tableListForm">{this.renderSimpleForm()}</div>
          <StandardTable
            loading={loading}
            data={{ list: orderLineList }}
            pagination={pagination}
            rowKey="Key"
            scroll={{ x: 2100, y: 500 }}
            columns={columns}
            rowSelection={{
              onSelectRow: this.onSelectRow,
            }}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Modal>
    );
  }
}

export default orderLine;
