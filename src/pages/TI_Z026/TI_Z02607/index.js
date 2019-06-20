import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Divider,
  Select,
  DatePicker,
  Checkbox,
  Icon,
  message,
} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import DocEntryFrom from '@/components/DocEntryFrom';
import MyTag from '@/components/Tag';
import NeedAskPrice from '../components/needAskPrice';
import MDMCommonality from '@/components/Select';
import Transfer from '@/components/Transfer';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Link from 'umi/link';
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
    transferModalVisible: false,
    selectedRows: [],
    needAsk: [],
    transferLine: {
      DocEntry: '',
    },
  };

  columns = [
    {
      title: '单号',
      width: 100,
      fixed: 'left',
      dataIndex: 'DocEntry',
      render: (text, recond) => (
        <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${text}`}>
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
      title: '单据状态',
      dataIndex: 'Status',
      width: 130,
      render: (text, record) => (
        <Fragment>
          {record.Closed === 'Y' ? (
            <MyTag type="关闭" value="Y" />
          ) : (
            <Fragment>
              <MyTag type="报价" value={record.SDocStatus} />
              <MyTag type="询价" value={record.PDocStatus} />
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
      dataIndex: 'KHContacts',
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
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '品牌',
      width: 80,
      dataIndex: 'BrandName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
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
      title: '外文名称',
      width: 100,
      dataIndex: 'ForeignName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '规格(外)',
      width: 100,
      dataIndex: 'ForeignParameters',
      align: 'center',
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
          {' '}
          {text}{' '}
        </Ellipsis>
      ),
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
        IsInquiry: fieldsValue.IsInquiry ? 'N' : 'Y',
      };
      dispatch({
        type: 'orderLine/fetch',
        payload: {
          Content: {
            QueryType: '1',
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

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  // 发送需询价success回调
  submitNeedLine = () => {
    message.success('提交成功');
    this.setState({ modalVisible: false });
    this.getDetail();
  };

  // 确认需要采购询价
  selectNeed = () => {
    const { selectedRows } = this.state;
    let { needAsk } = this.state;
    needAsk = selectedRows.filter(item => item.IsInquiry === 'N');
    if (selectedRows.length) {
      this.setState({ needAsk: [...needAsk], modalVisible: true });
    } else {
      message.warning('暂无需询价的行');
    }
  };

  // 需询价弹窗
  handleModalVisible = flag => {
    this.setState({ modalVisible: !!flag, transferModalVisible: !!flag });
  };

  toTransfer = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length) {
      this.setState({
        transferLine: selectedRows[0],
        transferModalVisible: true,
      });
    } else {
      message.warning('请先选择转移的行');
    }
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

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem key="SearchText" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="日期" {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="所有者" {...formLayout}>
              {getFieldDecorator('Owner')(<MDMCommonality data={Saler} />)}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem>
              {getFieldDecorator('IsInquiry', { valuePropName: 'checked', initialValue: true })(
                <Checkbox>无需报价</Checkbox>
              )}
            </FormItem>
          </Col>
          {expandForm ? (
            <Fragment>
              <Col md={4} sm={24}>
                <FormItem key="Closed" {...formLayout}>
                  {getFieldDecorator('Closed')(
                    <Select placeholder="请选择关闭状态">
                      <Option value="Y">已关闭</Option>
                      <Option value="N">未关闭</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem key="orderNo" {...formLayout} label="单号">
                  {getFieldDecorator('orderNo', {
                    initialValue: { DocEntryFrom: '', DocEntryTo: '' },
                  })(<DocEntryFrom />)}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem key="PLineStatus" {...formLayout} label="询价状态">
                  {getFieldDecorator('PLineStatus')(
                    <Select placeholder="请选择">
                      <Option value="C">已询价</Option>
                      <Option value="O">未询价</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>

              <Col md={5} sm={24}>
                <FormItem key="QueryType" {...formLayout} label="查询类型">
                  {getFieldDecorator('QueryType')(
                    <Select placeholder="请选择">
                      <Option value="1">常规查询</Option>
                      <Option value="2">采购物料确认查询</Option>
                      <Option value="3">采购询价单生成查询</Option>
                      <Option value="4">复制到销售报价单</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Fragment>
          ) : null}
          <Col md={2} sm={24}>
            <FormItem key="searchBtn">
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
    const {
      orderLine: { orderLineList, pagination },
      loading,
    } = this.props;
    const { needAsk, modalVisible, transferModalVisible, transferLine } = this.state;

    const columns = this.columns.map(item => {
      // eslint-disable-next-line no-param-reassign
      item.align = 'Center';
      return item;
    });

    const parentMethods = {
      handleSubmit: this.submitNeedLine,
      handleModalVisible: this.handleModalVisible,
    };

    const transferParentMethods = {
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: orderLineList }}
              pagination={pagination}
              rowKey="Key"
              scroll={{ x: 2700, y: 500 }}
              columns={columns}
              rowSelection={{
                onSelectRow: this.onSelectRow,
              }}
              onChange={this.handleStandardTableChange}
            />
            <NeedAskPrice data={needAsk} {...parentMethods} modalVisible={modalVisible} />
          </div>
        </Card>
        <FooterToolbar>
          <Button onClick={this.selectNeed} type="primary">
            确认需采购询价
          </Button>
          <Button type="primary" onClick={this.toTransfer}>
            转移
          </Button>
        </FooterToolbar>
        <Transfer
          SourceEntry={transferLine.DocEntry}
          SourceType="TI_Z026"
          modalVisible={transferModalVisible}
          {...transferParentMethods}
        />
      </Fragment>
    );
  }
}

export default orderLine;
