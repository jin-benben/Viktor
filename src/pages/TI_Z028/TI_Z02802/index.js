import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, DatePicker, Card, Table } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import MDMCommonality from '@/components/Select';
import moment from 'moment';
import { connect } from 'dva';
import { getName } from '@/utils/utils';

const FormItem = Form.Item;

@connect(({ TI_Z02802, global }) => ({
  global,
  TI_Z02802,
}))
@Form.create()
class TI_Z02802 extends PureComponent {
  state = {
    purchaseDetail: {},
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
        const {
          global: { Saler },
        } = this.props;
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

  state = {
    purchaseDetail: {},
  };

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.DocEntry) {
      dispatch({
        type: 'TI_Z02802/fetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
          },
        },
      });
    }
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Company', 'Purchaser'],
        },
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.TI_Z02802.purchaseDetail !== prevState.purchaseDetail) {
      return {
        purchaseDetail: nextProps.TI_Z02802.purchaseDetail,
      };
    }
    return null;
  }

  expandedRowRender = record => {
    const { childColumns } = this.props;
    return <Table dataSource={record.TI_Z02803} bordered rowKey="Key" columns={childColumns} />;
  };

  render() {
    const { purchaseDetail } = this.state;
    const {
      form: { getFieldDecorator },
      global: { Saler, Company },
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

    return (
      <Card title="采购确认单详情">
        <Form {...formItemLayout}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem key="DocDate" {...formLayout} label="单据日期">
                {getFieldDecorator('DocDate', {
                  initialValue: purchaseDetail.DocDate
                    ? moment(purchaseDetail.DocDate, 'YYYY-MM-DD')
                    : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem key="ToDate" {...formLayout} label="有效日期">
                {getFieldDecorator('ToDate', {
                  initialValue: purchaseDetail.ToDate
                    ? moment(purchaseDetail.ToDate, 'YYYY-MM-DD')
                    : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem key="Owner" {...formLayout} label="所有者">
                {getFieldDecorator('Owner', {
                  rules: [{ required: true, message: '请选择所有者' }],
                  initialValue: purchaseDetail.Owner,
                })(<MDMCommonality initialValue={purchaseDetail.Owner} data={Saler} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem key="CompanyCode" {...formLayout} label="交易公司">
                {getFieldDecorator('CompanyCode', {
                  rules: [{ required: true, message: '请选择交易公司' }],
                  initialValue: purchaseDetail.CompanyCode,
                })(<MDMCommonality initialValue={purchaseDetail.CompanyCode} data={Company} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem key="Comment" {...formLayout} label="备注">
                {getFieldDecorator('Comment', {
                  rules: [{ required: true, message: '请输入备注' }],
                  initialValue: purchaseDetail.Comment,
                })(<Input placeholder="请输入备注" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          bordered
          style={{ marginBottom: 20, marginTop: 20 }}
          dataSource={purchaseDetail.TI_Z02802}
          rowKey="LineID"
          pagination={false}
          scroll={{ x: 2500, y: 500 }}
          expandedRowRender={this.expandedRowRender}
          columns={this.columns}
          onChange={this.handleStandardTableChange}
        />
        <Row style={{ marginTop: 20 }} gutter={8}>
          <Col lg={8} md={12} sm={24}>
            <FormItem key="Owner" {...formLayout} label="创建人">
              {getFieldDecorator('Owner', {
                initialValue: purchaseDetail.Owner,
                rules: [{ required: true, message: '请选择创建人！' }],
              })(<MDMCommonality initialValue={purchaseDetail.Owner} data={Saler} />)}
            </FormItem>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default TI_Z02802;
