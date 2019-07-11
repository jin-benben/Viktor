/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import React, { Fragment } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Table, Button, DatePicker, message, Icon, Tag, Select } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import SupplierSelect from '@/components/Select/Supplier';
import MDMCommonality from '@/components/Select';
import Organization from '@/components/Organization/multiple';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';
import { getName } from '@/utils/utils';
import styles from '../style.less';
import request from '@/utils/request';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;
@connect(({ global }) => ({
  global,
}))
@Form.create()
class NeedTabl extends React.Component {
  state = {
    selectedRowKeys: [],
    orderLineList: [],
    expandForm: false,
    queryData: {
      Content: {
        SearchText: '',
        InquiryStatus: 'O',
        QueryType: '3',
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
        <div style={{ width: '180px' }}>
          <SupplierSelect
            initialValue={{ key: record.SupplierCode || '', label: record.SupplierName || '' }}
            onChange={value => this.changeSupplier(value, record, index)}
            keyType="Name"
          />
        </div>
      ),
    },
    {
      title: () => {
        const {
          queryData: { sord },
        } = this.state;
        const active = sord === 'Desc';
        return (
          <Fragment>
            单号
            <span className="sordBox">
              <Icon className={`sordBoxUp ${active ? 'active' : ''}`} type="caret-up" />
              <Icon className={`sordBoxDowm ${active ? 'active' : ''}`} type="caret-down" />
            </span>
          </Fragment>
        );
      },
      width: 100,
      dataIndex: 'DocEntry',
      render: (val, record) => (
        <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${val}`}>
          {`${val}-${record.LineID}`}
        </Link>
      ),
      onHeaderCell: column => ({
        onClick: () => {
          this.headerRowClick(column);
        }, // 点击表头行
      }),
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '行状态',
      width: 80,
      dataIndex: 'InquiryStatus',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? null : (
          <Fragment>
            {record.Closed === 'Y' ? (
              <Tag color="red">已关闭</Tag>
            ) : (
              <Fragment>
                {text === 'C' ? <Tag color="green">已询价</Tag> : <Tag color="gold">未询价</Tag>}
              </Fragment>
            )}
          </Fragment>
        ),
    },
    {
      title: () => {
        const {
          queryData: { sord },
        } = this.state;
        const active = sord === 'Desc';
        return (
          <Fragment>
            物料
            <span className="sordBox">
              <Icon className={`sordBoxUp ${active ? 'active' : ''}`} type="caret-up" />
              <Icon className={`sordBoxDowm ${active ? 'active' : ''}`} type="caret-down" />
            </span>
          </Fragment>
        );
      },
      dataIndex: 'SKUName',
      align: 'center',
      width: 300,
      onHeaderCell: column => ({
        onClick: () => {
          this.headerRowClick(column);
        }, // 点击表头行
      }),
      render: (text, record) =>
        record.lastIndex ? (
          ''
        ) : (
          <Ellipsis tooltip lines={1}>
            {text ? (
              <Link target="_blank" to={`/main/product/TI_Z009/TI_Z00903?Code${record.SKU}`}>
                {record.SKU}-
              </Link>
            ) : (
              ''
            )}
            {text}
          </Ellipsis>
        ),
    },
    {
      title: '数量',
      width: 100,
      dataIndex: 'Quantity',
      align: 'center',
      render: (text, record) => <span>{`${text}(${record.Unit})`}</span>,
    },
    {
      title: '行备注',
      width: 100,
      dataIndex: 'LineComment',
      render: text => (
        <Ellipsis tooltip lines={1}>
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
      title: '采购员',
      width: 100,
      dataIndex: 'Purchaser',
      render: text => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, text)}</span>;
      },
    },
    {
      title: '处理人',
      width: 100,
      dataIndex: 'Processor',
      render: val => {
        const {
          global: { TI_Z004 },
        } = this.props;
        return <span>{getName(TI_Z004, val)}</span>;
      },
    },
    {
      title: '转移备注',
      width: 100,
      dataIndex: 'TransferComment',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
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
      title: '交易公司',
      width: 150,
      dataIndex: 'CompanyCode',
      render: text => {
        const {
          global: { Company },
        } = this.props;
        return (
          <Ellipsis tooltip lines={1}>
            {getName(Company, text)}
          </Ellipsis>
        );
      },
    },
    {
      title: '要求交期',
      width: 100,
      dataIndex: 'DueDate',
      align: 'center',
    },
    {
      title: '客户参考号',
      width: 100,
      dataIndex: 'NumAtCard',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
  ];

  componentDidMount() {
    const { queryData } = this.state;
    const { dispatch } = this.props;
    this.fetchOrder(queryData);
    dispatch({
      type: 'global/getAuthority',
    });
  }

  fetchOrder = async params => {
    this.setState({
      loading: true,
    });
    const response = await request('/OMS/TI_Z026/TI_Z02607', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    this.setState({
      loading: false,
    });
    if (response && response.Status === 200) {
      if (response.Content) {
        const { pagination } = this.state;
        const { page, rows } = params;
        this.setState({
          orderLineList: response.Content.rows,
          pagination: {
            ...pagination,
            pageSize: rows,
            current: page,
            total: response.Content.records,
          },
        });
      } else {
        this.setState({
          orderLineList: [],
          pagination: {
            total: 0,
          },
        });
      }
    }
  };

  handleStandardTableChange = params => {
    const { current, pageSize } = params;
    const { queryData, pagination } = this.state;
    const newdata = { ...queryData, page: current, rows: pageSize };
    Object.assign(pagination, { pageSize });
    this.setState({ queryData: { ...newdata }, pagination });
    this.fetchOrder(newdata);
  };

  toggleForm = () => {
    // 是否展开
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  // 点击表头
  headerRowClick = column => {
    const { dataIndex } = column;
    const {
      queryData,
      queryData: { sord },
    } = this.state;
    Object.assign(queryData, { sidx: dataIndex, page: 1, sord: sord === 'Desc' ? 'Asc' : 'Desc' });
    this.setState({
      queryData: { ...queryData },
    });
    this.fetchOrder(queryData);
  };

  // change 客户
  changeSupplier = (supplier, record, index) => {
    const { Code, Currency, CompanyCode } = supplier;
    const { orderLineList } = this.state;
    if (!supplier.TI_Z00702List.length) {
      message.warning('此供应商暂未维护联系，请先维护联系人');
      return false;
    }
    const { CellphoneNO, Email, PhoneNO, Name, LineID } = supplier.TI_Z00702List[0];
    record.SupplierCode = Code;
    record.SupplierName = supplier.Name;
    Object.assign(record, {
      CellphoneNO,
      CompanyCode,
      Email,
      PhoneNO,
      ContactsID: LineID,
      Contacts: Name,
      Currency,
      linkmanList: [...supplier.TI_Z00702List],
    });
    orderLineList[index] = record;
    this.setState({ orderLineList: [...orderLineList] });
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
    const { queryData } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let DocDateFrom;
      let DocDateTo;
      if (fieldsValue.dateArr) {
        DocDateFrom = moment(fieldsValue.dateArr[0]).format('YYYY-MM-DD');
        DocDateTo = moment(fieldsValue.dateArr[1]).format('YYYY-MM-DD');
      }
      delete fieldsValue.dateArr;
      const Content = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
      };
      Object.assign(queryData.Content, { ...Content });
      this.setState({
        queryData: { ...queryData, page: 1, rows: 30 },
      });
      this.fetchOrder({ ...queryData, page: 1, rows: 30 });
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
    const { expandForm } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem key="SearchText" label="关键字">
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
            <FormItem key="Owner" {...formLayout} label="采购员">
              {getFieldDecorator('Owner')(<SalerPurchaser />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="InquiryStatus" {...formLayout} label="询价状态">
              {getFieldDecorator('InquiryStatus', { initialValue: 'O' })(
                <Select style={{ width: '100%' }} placeholder="请选择">
                  <Option value="C">已询价</Option>
                  <Option value="O">未询价</Option>
                  <Option value="">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          {expandForm ? (
            <Fragment>
              <Col md={5} sm={24}>
                <FormItem key="DeptList" {...this.formLayout} label="部门">
                  {getFieldDecorator('DeptList')(<Organization />)}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
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
              <Col md={5} sm={24}>
                <FormItem {...formLayout} label="销售员">
                  {getFieldDecorator('Purchaser')(
                    <MDMCommonality placeholder="销售员" data={Saler} />
                  )}
                </FormItem>
              </Col>
            </Fragment>
          ) : null}
          <Col md={4} sm={24}>
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
    const { pagination, orderLineList, selectedRowKeys, loading } = this.state;
    const height = document.body.offsetHeight - 56 - 64 - 56 - 24 - 32 - 30;
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
            scroll={{ x: 1920, y: height }}
            rowSelection={{
              onChange: this.onSelectRow,
              selectedRowKeys,
            }}
            onChange={this.handleStandardTableChange}
            columns={this.columns}
          />
        </div>
      </Fragment>
    );
  }
}

export default NeedTabl;
