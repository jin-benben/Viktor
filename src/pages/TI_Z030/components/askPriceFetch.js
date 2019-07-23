import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Form, Input, Button, DatePicker, Modal, message, Icon } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import request from '@/utils/request';
import StandardTable from '@/components/StandardTable';
import Organization from '@/components/Organization/multiple';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';
import { getName } from '@/utils/utils';

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
      width: 80,
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
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
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
      title: '数量',
      width: 80,
      dataIndex: 'Quantity',
    },
    {
      title: '单位',
      width: 80,
      dataIndex: 'Unit',
    },
    // {
    //   title: '要求交期',
    //   dataIndex: 'DueDate',
    //   width: 100,
    // },
    // {
    //   title: '客户参考号',
    //   width: 100,
    //   dataIndex: 'NumAtCard',
    // },
    // {
    //   title: '询价交期',
    //   width: 100,
    //   dataIndex: 'InquiryDueDate',
    // },
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
      width: 120,
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
      width: 120,
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
    const { onRef, dispatch } = this.props;
    dispatch({
      type: 'global/getAuthority',
    });
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
    const { pagination } = this.state;
    const response = await request('/OMS/TI_Z029/TI_Z02907', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    if (response && response.Status === 200) {
      if (response.Content) {
        const { rows, records, page } = response.Content;
        this.setState({
          orderLineList: rows,
          queryData: { ...params },
          pagination: {
            ...pagination,
            total: records,
            pageSize: params.rows,
            current: page,
          },
        });
      } else {
        this.setState({
          orderLineList: [],
          queryData: { ...params },
          pagination: {
            total: 0,
          },
        });
      }
    }
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
      let DocDateFrom = '';
      let DocDateTo = '';
      if (fieldsValue.dateArr && fieldsValue.dateArr.length) {
        DocDateFrom = moment(fieldsValue.dateArr[0]).format('YYYY-MM-DD');
        DocDateTo = moment(fieldsValue.dateArr[1]).format('YYYY-MM-DD');
      }

      // eslint-disable-next-line no-param-reassign
      delete fieldsValue.orderNo;
      const queryData = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
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
    } = this.props;
    const { queryData, expandForm } = this.state;
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
        <Row gutter={{ md: 16 }}>
          <Col md={5} sm={24}>
            <FormItem key="SearchText" wrapperCol={{ span: 24 }}>
              {getFieldDecorator('SearchText', { initialValue: queryData.Content.SearchText })(
                <Input placeholder="请输入关键字" />
              )}
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
          <Col md={4} sm={24}>
            <FormItem key="Owner" {...formLayout} label="销售员">
              {getFieldDecorator('Owner')(<SalerPurchaser />)}
            </FormItem>
          </Col>
          {expandForm ? (
            <Fragment>
              <Col md={5} sm={24}>
                <FormItem key="DeptList" wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('DeptList')(<Organization />)}
                </FormItem>
              </Col>
            </Fragment>
          ) : null}
          <Col md={2} sm={24}>
            <FormItem key="searchBtn" {...searchFormItemLayout}>
              <span className="submitButtons">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  {expandForm ? (
                    <span>
                      收起 <Icon type="up" />
                    </span>
                  ) : (
                    <span>
                      展开 <Icon type="down" />
                    </span>
                  )}
                </a>
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
        maskClosable={false}
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
            scroll={{ x: 1500, y: 500 }}
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
