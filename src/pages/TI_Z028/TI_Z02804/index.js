/* eslint-disable array-callback-return */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, DatePicker } from 'antd';
import StandardTable from '@/components/StandardTable';
import MDMCommonality from '@/components/Select';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import Link from 'umi/link';
import { getName } from '@/utils/utils';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ TI_Z02804, loading, global }) => ({
  TI_Z02804,
  global,
  loading: loading.models.TI_Z02804,
}))
@Form.create()
class TI_Z02804 extends PureComponent {
  columns = [
    {
      title: '采询价单',
      width: 100,
      dataIndex: 'DocEntry',
      render: (text, recond) => (
        <Link target="_blank" to={`/purchase/TI_Z028/TI_Z02802?DocEntry=${text}`}>{`${text}-${
          recond.LineID
        }`}</Link>
      ),
    },
    {
      title: '客询价单',
      width: 100,
      dataIndex: 'BaseEntry',
      render: (text, recond) => (
        <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${text}`}>{`${text}-${
          recond.BaseLineID
        }`}</Link>
      ),
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
      title: '行备注',
      width: 100,
      dataIndex: 'SLineComment',
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
      dataIndex: 'InquiryDueDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '采购备注',
      width: 100,
      dataIndex: 'LineComment',
    },
  ];

  childColumns = [
    {
      title: '采询价单号',
      width: 150,
      dataIndex: 'PInquiryEntry',
    },
    {
      title: '采询价单行',
      width: 80,
      dataIndex: 'PInquiryLineID',
    },

    {
      title: '询价日期',
      width: 100,
      dataIndex: 'CreateDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '供应商',
      width: 80,
      dataIndex: 'CardName',
    },
    {
      title: '价格',
      width: 100,
      dataIndex: 'ProductName',
    },
    {
      title: '型号',
      width: 100,
      dataIndex: 'ManufactureNO',
    },
    {
      title: '交期',
      width: 100,
      dataIndex: 'InquiryDueDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '备注',
      width: 100,
      dataIndex: 'LineComment',
    },
    {
      title: '最优',
      width: 80,
      dataIndex: 'IsSelect',
      render: val => <span>{val === 'Y' ? '是' : '否'}</span>,
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      TI_Z02804: { queryData },
    } = this.props;
    dispatch({
      type: 'TI_Z02804/fetch',
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

  expandedRowRender = record => (
    <StandardTable data={{ list: record.TI_Z02803 }} columns={this.childColumns} />
  );

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      TI_Z02804: { queryData },
    } = this.props;
    dispatch({
      type: 'TI_Z02804/fetch',
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
      };
      dispatch({
        type: 'TI_Z02804/fetch',
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

  // form表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      global: { Purchaser },
    } = this.props;

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
          <Col md={6} sm={24}>
            <FormItem label="日期" {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem key="Owner" {...formLayout} label="所有者">
              {getFieldDecorator('Owner', { rules: [{ required: true, message: '请选择所有者' }] })(
                <MDMCommonality data={Purchaser} />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
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
    const {
      TI_Z02804: { orderList, pagination },

      loading,
    } = this.props;
    const columns = this.columns.map(item => {
      item.align = 'center';
      return item;
    });

    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: orderList }}
              pagination={pagination}
              rowKey="Key"
              scroll={{ x: 2250, y: 500 }}
              expandedRowRender={this.expandedRowRender}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default TI_Z02804;
