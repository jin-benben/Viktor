import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Divider,
  Badge,
  Select,
  DatePicker,
  Checkbox,
  message,
} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import DocEntryFrom from '@/components/DocEntryFrom';
import NeedAskPrice from '../components/needAskPrice';
import MDMCommonality from '@/components/Select';
import { getName } from '@/utils/utils';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ orderLine, loading, global }) => ({
  orderLine,
  global,
  loading: loading.models.orderLine,
}))
@Form.create()
class orderLine extends PureComponent {
  state = {
    expandForm: false,
    modalVisible: false,
    selectedRows: [],
  };

  columns = [
    {
      title: '单号',
      width: 50,
      fixed: 'left',
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
      title: '单据状态',
      dataIndex: 'Status',
      width: 100,
      render: (text, record) => (
        <Fragment>
          {record.Closed === 'Y' ? (
            <Badge color="red" text="已关闭" />
          ) : (
            <Fragment>
              <span>
                {record.SDocStatus === 'O' ? (
                  <Badge color="green" text="未报价" />
                ) : (
                  <Badge color="blue" text="已报价" />
                )}
              </span>
              <span>
                {record.PDocStatus === 'O' ? (
                  <Badge color="green" text="未询价" />
                ) : (
                  <Badge color="blue" text="已询价" />
                )}{' '}
              </span>
            </Fragment>
          )}
        </Fragment>
      ),
    },
    {
      title: '客户',
      dataIndex: 'CardName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}{' '}
        </Ellipsis>
      ),
    },
    {
      title: '联系人',
      width: 100,
      dataIndex: 'Contacts',
    },
    {
      title: '联系方式',
      width: 100,
      dataIndex: 'contact',
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {record.CellphoneNO}
          {record.PhoneNO ? <Divider type="vertical" /> : null}
          {record.PhoneNO}
        </Ellipsis>
      ),
    },
    {
      title: '客户参考号',
      width: 100,
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
      title: '询价交期',
      width: 100,
      dataIndex: 'InquiryDueDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
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
    {
      title: '询价总计',
      width: 100,
      dataIndex: 'InquiryLineTotalLocal',
    },
    {
      title: '所有人',
      width: 80,
      dataIndex: 'Owner',
      render: text => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, text)}</span>;
      },
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      orderLine: { queryData },
    } = this.props;
    dispatch({
      type: 'orderLine/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Purchaser'],
        },
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      orderLine: { queryData },
    } = this.props;
    dispatch({
      type: 'orderLine/fetch',
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
        IsInquiry: fieldsValue.fieldsValue && fieldsValue.fieldsValue ? 'Y' : 'N',
      };
      dispatch({
        type: 'orderLine/fetch',
        payload: {
          Content: {
            SearchText: '',
            SearchKey: 'Name',
            ...queryData,
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

  handleOnRow = record => ({
    // 详情or修改
    onClick: () => router.push(`/TI_Z026/TI_Z02602?DocEntry=${record.DocEntry}`),
  });

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  // 发送需询价
  submitNeedLine = select => {
    const {
      dispatch,
      orderLine: { queryData },
    } = this.props;
    const loItemList = select.map(item => ({
      DocEntry: item.DocEntry,
      LineID: item.LineID,
    }));
    dispatch({
      type: 'orderLine/need',
      payload: {
        Content: {
          loItemList,
        },
      },
      callback: response => {
        if (response.Status === 200) {
          message.success('提交成功');
          dispatch({
            type: 'orderLine/fetch',
            payload: {
              ...queryData,
            },
          });
          this.setState({ modalVisible: false, selectedRows: [] });
        }
      },
    });
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
    const { expandForm } = this.state;
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
            <FormItem key="SLineStatus" {...formLayout} label="报价状态">
              {getFieldDecorator('SLineStatus')(
                <Select placeholder="请选择">
                  <Option value="C">已报价</Option>
                  <Option value="O">未报价</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所有者" {...formLayout}>
              {getFieldDecorator('Owner')(<MDMCommonality data={Saler} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem {...searchFormItemLayout}>
              {getFieldDecorator('IsInquiry', { valuePropName: 'checked', initialValue: true })(
                <Checkbox>显示无需报价</Checkbox>
              )}
            </FormItem>
          </Col>
          {expandForm ? (
            <Fragment>
              <Col md={6} sm={24}>
                <FormItem key="orderNo" {...formLayout} label="单号">
                  {getFieldDecorator('orderNo', {
                    initialValue: { DocEntryFrom: '', DocEntryTo: '' },
                  })(<DocEntryFrom />)}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem key="PLineStatus" {...formLayout} label="询价状态">
                  {getFieldDecorator('PLineStatus')(
                    <Select placeholder="请选择">
                      <Option value="C">已询价</Option>
                      <Option value="O">未询价</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem key="Closed" {...formLayout} label="关闭状态">
                  {getFieldDecorator('Closed')(
                    <Select placeholder="请选择">
                      <Option value="Y">已关闭</Option>
                      <Option value="N">未关闭</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Fragment>
          ) : null}
          <Col md={6} sm={24}>
            <FormItem key="searchBtn" {...searchFormItemLayout}>
              <span className="submitButtons">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                {/* <Button
                  icon="plus"
                  style={{ marginLeft: 8 }}
                  type="primary"
                  onClick={() => router.push('/inquiry/edit')}
                >
                  新建
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
                </a> */}
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      orderLine: { orderLineList, pagination },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;

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
        <Card title="客户询价单物料查询" bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: orderLineList }}
              pagination={pagination}
              rowKey="Key"
              scroll={{ x: 2600, y: 500 }}
              columns={columns}
              rowSelection={{
                onSelectRow: this.onSelectRow,
              }}
              selectedRows={selectedRows}
              onRow={this.handleOnRow}
              onChange={this.handleStandardTableChange}
            />
            <Button style={{ marginTop: 20 }} onClick={this.selectNeed} type="primary">
              确认需采购询价
            </Button>
            <NeedAskPrice data={selectedRows} {...parentMethods} modalVisible={modalVisible} />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default orderLine;
