/* eslint-disable react/destructuring-assignment */
/* eslint-disable array-callback-return */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  List,
  Icon,
  message,
  Radio,
  Table,
  Select,
} from 'antd';

import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import MDMCommonality from '@/components/Select';
import Organization from '@/components/Organization/multiple';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';
import OrderPreview from './components';
import { getName } from '@/utils/utils';
import styles from '../style.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ TI_Z02801, loading, global }) => ({
  TI_Z02801,
  global,
  loading: loading.models.TI_Z02801,
}))
@Form.create()
class TI_Z02801 extends React.Component {
  columns = [
    {
      title: '客询价单',
      width: 80,
      dataIndex: 'BaseEntry',
      render: (val, record) => (
        <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${record.BaseEntry}`}>
          {`${val}-${record.BaseLineID}`}
        </Link>
      ),
    },
    {
      title: '单据日期',
      dataIndex: 'PriceRDateTime',
      width: 100,
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
      title: '单位',
      width: 80,
      dataIndex: 'Unit',
    },
    {
      title: '总/确认',
      width: 80,
      dataIndex: 'SubRowCount',
      render: (val, record) => (
        <span
          style={{ color: `${record.SubRowCount !== record.PriceRStatusCount ? 'red' : '#666'}` }}
        >
          {`${record.SubRowCount}/${record.PriceRStatusCount}`}
        </span>
      ),
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
      width: 100,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '采购价格',
      width: 80,
      dataIndex: 'Price',
    },
    {
      title: '采购交期',
      width: 100,
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
      dataIndex: 'CardName',
    },
    {
      title: '创建日期',
      width: 100,
      dataIndex: 'CreateDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '销售员',
      width: 80,
      dataIndex: 'Saler',
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
    {
      title: '客户参考号',
      width: 100,
      dataIndex: 'NumAtCard',
    },
  ];

  state = {
    selectedRows: [],
    orderLineList: [],
    modalVisible: false,
    expandForm: false,
    selectedRowKeys: [],
  };

  componentDidMount() {
    const {
      dispatch,
      TI_Z02801: { queryData },
    } = this.props;
    dispatch({
      type: 'TI_Z02801/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Company', 'Purchaser', 'Curr'],
        },
      },
    });
    dispatch({
      type: 'global/getAuthority',
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.TI_Z02801.orderList !== prevState.orderLineList) {
      return {
        orderLineList: nextProps.TI_Z02801.orderList,
      };
    }
    return null;
  }

  expandedRowRender = (record, index) => (
    <Radio.Group onChange={item => this.childChange(item, record, index)} value={record.CardCode}>
      <List
        itemLayout="horizontal"
        style={{ marginLeft: 60 }}
        className={styles.askInfo}
        dataSource={record.TI_Z02803}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={
                <Link target="_blank" to={`/main/TI_Z007/detail?Code=${item.CardCode}`}>
                  <span style={{ color: '#1890FF' }}> {`${item.CardName}(${item.CardCode})`}</span>
                </Link>
              }
              avatar={<Radio value={item.CardCode} />}
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
                    运费：<span>{item.ForeignFreight}</span>
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
    </Radio.Group>
  );

  //  选择最优供应商radio
  childChange = (item, record, index) => {
    const CardCode = item.target.value;
    const targetLine = record.TI_Z02803.find(line => line.CardCode === CardCode);
    const { orderLineList } = this.state;
    const newrecord = orderLineList[index];
    Object.assign(newrecord, targetLine, { LineID: record.LineID });
    orderLineList[index] = newrecord;
    this.setState({ orderLineList: [...orderLineList] });
  };

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      TI_Z02801: { queryData },
    } = this.props;
    dispatch({
      type: 'TI_Z02801/fetch',
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
    const {
      dispatch,
      TI_Z02801: { queryData },
      form,
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let DocDateFrom;
      let DocDateTo;
      if (fieldsValue.dateArr) {
        DocDateFrom = moment(fieldsValue.dateArr[0]).format('YYYY-MM-DD');
        DocDateTo = moment(fieldsValue.dateArr[1]).format('YYYY-MM-DD');
      }
      const newQueryData = {
        ...queryData.Content,
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
      };
      dispatch({
        type: 'TI_Z02801/fetch',
        payload: {
          Content: {
            SearchText: '',
            SearchKey: 'Name',
            ...newQueryData,
          },
          page: 1,
          rows: 30,
          sidx: 'DocEntry',
          sord: 'Desc',
        },
      });
      this.setState({ selectedRowKeys: [], selectedRows: [] });
    });
  };

  onSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows: [...selectedRows], selectedRowKeys: [...selectedRowKeys] });
  };

  confrimModel = () => {
    const { selectedRows } = this.state;
    if (!selectedRows.length) {
      message.warning('请先选择');
      return;
    }
    this.setState({ modalVisible: true });
  };

  toggleForm = () => {
    // 是否展开
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  okHandle = (selectedRows, fieldsValue) => {
    const { dispatch } = this.props;
    let InquiryDocTotal = 0;
    let InquiryDocTotalLocal = 0;
    selectedRows.map(item => {
      InquiryDocTotal += item.LineTotal;
      InquiryDocTotalLocal += item.InquiryLineTotalLocal;
    });
    dispatch({
      type: 'TI_Z02801/add',
      payload: {
        Content: {
          InquiryDocTotal,
          InquiryDocTotalLocal,
          ...fieldsValue,
          TI_Z02802: [...selectedRows],
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('添加成功');
          router.push(`/purchase/TI_Z028/TI_Z02802?DocEntry=${response.Content.DocEntry}`);
        }
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({ modalVisible: !!flag });
  };

  // form表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      global: { Saler },
    } = this.props;
    const { expandForm } = this.state;
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
            <FormItem key="Owner" {...formLayout} label="采购员">
              {getFieldDecorator('Owner')(<SalerPurchaser />)}
            </FormItem>
          </Col>
          {expandForm ? (
            <Fragment>
              <Col md={5} sm={24}>
                <FormItem key="DeptList" {...this.formLayout} label="部门">
                  {getFieldDecorator('DeptList')(<Organization />)}
                </FormItem>
              </Col>
              <Col md={4} lg={4} sm={24}>
                <FormItem key="Sales" {...formLayout} label="销售员">
                  {getFieldDecorator('Sales')(<MDMCommonality data={Saler} />)}
                </FormItem>
              </Col>
              <Col md={4} sm={24}>
                <FormItem key="PLineStatus" {...formLayout}>
                  {getFieldDecorator('PLineStatus', { initialValue: 'O' })(
                    <Select placeholder="请选择确认状态">
                      <Option value="C">已确认</Option>
                      <Option value="O">未确认</Option>
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
      TI_Z02801: { pagination },
      global: { Purchaser, Company, Saler },
      loading,
    } = this.props;

    const { modalVisible, selectedRows, orderLineList, selectedRowKeys } = this.state;

    const columns = this.columns.map(item => {
      const newitem = item;
      newitem.align = 'center';
      return newitem;
    });
    const parentMethods = {
      handleSubmit: this.okHandle,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <Table
              bordered
              loading={loading}
              dataSource={orderLineList}
              pagination={pagination}
              rowKey="LineID"
              scroll={{ x: 2500, y: 800 }}
              rowSelection={{
                onChange: this.onSelectRow,
                selectedRowKeys,
              }}
              expandedRowRender={this.expandedRowRender}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />

            <OrderPreview
              orderLineList={selectedRows}
              Purchaser={Purchaser}
              Company={Company}
              Saler={Saler}
              {...parentMethods}
              modalVisible={modalVisible}
            />
          </div>
        </Card>
        <FooterToolbar>
          <Button type="primary" onClick={this.confrimModel}>
            确认
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default TI_Z02801;
