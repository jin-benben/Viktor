import React, { PureComponent, Fragment } from 'react';
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
  Divider,
  Badge,
  Select,
  DatePicker,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import MDMCommonality from '@/components/Select';
import { getName } from '@/utils/utils';
import DocEntryFrom from '@/components/DocEntryFrom';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ supplierQuotationSku, loading, global }) => ({
  supplierQuotationSku,
  global,
  loading: loading.models.supplierQuotationSku,
}))
@Form.create()
class supplierQuotationSku extends PureComponent {
  state = {
    expandForm: false,
  };

  columns = [
    {
      title: '单号',
      width: 100,
      fixed: 'left',
      dataIndex: 'DocEntry',
      render: (text, recond) => (
        <Link to={`/purchase/TI_Z027/detail?DocEntry=${text}`}>{`${text}-${recond.LineID}`}</Link>
      ),
    },
    {
      title: '客询价单',
      width: 100,
      dataIndex: 'BaseEntry',
      render: (text, recond) => (
        <Link to={`/sellabout/TI_Z026/detail?DocEntry=${text}`}>{`${text}-${
          recond.BaseLineID
        }`}</Link>
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
      dataIndex: 'CreateDate',
      width: 100,
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
                {record.LineStatus === 'O' ? (
                  <Badge color="green" text="未询价" />
                ) : (
                  <Badge color="blue" text="已询价" />
                )}
              </span>
            </Fragment>
          )}
        </Fragment>
      ),
    },
    {
      title: '供应商',
      width: 100,
      dataIndex: 'CardName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
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
      width: 120,
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
      title: 'SKU',
      dataIndex: 'SKU',
      width: 100,
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
      width: 100,
      dataIndex: 'BrandName',
    },
    {
      title: '名称',
      width: 150,
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
      title: '单位',
      width: 80,
      dataIndex: 'Unit',
    },
    {
      title: '要求交期',
      width: 100,
      dataIndex: 'DueDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '价格',
      width: 80,
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
      width: 100,
      dataIndex: 'LineComment',
    },
    {
      title: '采购员',
      width: 80,
      dataIndex: 'Owner',
      render: text => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, text)}</span>;
      },
    },
    {
      title: '销售员',
      dataIndex: 'Saler',
      width: 80,
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
      supplierQuotationSku: { queryData },
    } = this.props;

    dispatch({
      type: 'supplierQuotationSku/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Company', 'Purchaser'],
        },
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      supplierQuotationSku: { queryData },
    } = this.props;
    dispatch({
      type: 'supplierQuotationSku/fetch',
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
      };
      dispatch({
        type: 'supplierQuotationSku/fetch',
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

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      global: { Purchaser, Saler },
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
          <Col md={5} sm={24}>
            <FormItem label="日期" {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="所有者" {...formLayout}>
              {getFieldDecorator('Owner')(<MDMCommonality data={Purchaser} />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="LineStatus" {...formLayout} label="确认状态">
              {getFieldDecorator('LineStatus')(
                <Select placeholder="请选择">
                  <Option value="1">已报价</Option>
                  <Option value="2">未报价</Option>
                  <Option value="3">不详</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          {expandForm ? (
            <Fragment>
              <Col md={5} sm={24}>
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
                <FormItem label="销售" {...formLayout}>
                  {getFieldDecorator('Saler')(<MDMCommonality data={Saler} />)}
                </FormItem>
              </Col>
            </Fragment>
          ) : null}
          <Col md={5} sm={24}>
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
      supplierQuotationSku: { supplierQuotationSkuList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: supplierQuotationSkuList }}
              pagination={pagination}
              rowKey="Key"
              scroll={{ x: 2400, y: 500 }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <FooterToolbar>
          <Button
            icon="plus"
            style={{ marginLeft: 8 }}
            type="primary"
            onClick={() => router.push('/purchase/TI_Z027/edit')}
          >
            新建
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default supplierQuotationSku;
