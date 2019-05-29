/* eslint-disable array-callback-return */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, DatePicker, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import MDMCommonality from '@/components/Select';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import OrderPreview from './components';
import { getName } from '@/utils/utils';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ TI_Z02801, loading, global }) => ({
  TI_Z02801,
  global,
  loading: loading.models.TI_Z02801,
}))
@Form.create()
class TI_Z02801 extends PureComponent {
  columns = [
    {
      title: '客询价单',
      width: 80,
      dataIndex: 'BaseEntry',
      render: (val, record) => (
        <a href={`/sellabout/TI_Z026/TI_Z02602?DocEntry=${record.DocEntry}`} alt="单号">
          {val}
        </a>
      ),
    },
    {
      title: '客询价行',
      width: 80,
      dataIndex: 'BaseLineID',
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
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '采购备注',
      width: 100,
      dataIndex: 'LineComment',
    },
    {
      title: '供应商',

      dataIndex: 'CardName',
    },
  ];

  state = {
    selectedRows: [],
    selectedChildRows: [],
    modalVisible: false,
  };

  childColumns = [
    {
      title: '询价单号',
      width: 150,
      dataIndex: 'PInquiryEntry',
    },
    {
      title: '询价单行',
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
      dataIndex: 'Price',
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
          CodeList: ['Saler', 'Company', 'Purchaser'],
        },
      },
    });
  }

  expandedRowRender = (record, index) => (
    <StandardTable
      data={{ list: record.TI_Z02803 }}
      rowSelection={{
        onSelectRow: selectRows => this.childOnSelectRow(selectRows, index),
      }}
      columns={this.childColumns}
    />
  );

  childOnSelectRow = (selectRows, index) => {
    const { selectedRows } = this.state;
    console.log(selectedRows);
    selectedRows[index].TI_Z02803 = [...selectRows];
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
        type: 'TI_Z02801/fetch',
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

  // handleOnRow = record => ({
  //   // 详情or修改
  //   onClick: () => router.push(`/TI_Z028/edit?DocEntry=${record.DocEntry}`),
  // });

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  confrimModel = () => {
    const { selectedRows } = this.state;
    if (!selectedRows.length) {
      message.warning('请先选择');
    }
    this.setState({ modalVisible: true });
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
        if (response.Status === 200) {
          message.success('添加成功');
          router.push(`/TI_Z028/TI_Z02802?DocEntry=${response.Content.DocEntry}`);
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
    const searchFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
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
          <Col md={6} sm={24}>
            <FormItem key="Owner" {...formLayout} label="所有者">
              {getFieldDecorator('Owner', { rules: [{ required: true, message: '请选择所有者' }] })(
                <MDMCommonality data={Saler} />
              )}
            </FormItem>
          </Col>
          <Col md={1} sm={24}>
            <FormItem key="searchBtn" {...searchFormItemLayout}>
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
      TI_Z02801: { orderList, pagination },
      global: { Purchaser, Company, Saler },
      loading,
    } = this.props;

    const { modalVisible, selectedRows } = this.state;

    const columns = this.columns.map(item => {
      item.align = 'center';
      return item;
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
            <StandardTable
              loading={loading}
              data={{ list: orderList }}
              pagination={pagination}
              rowKey="LineID"
              scroll={{ x: 2250, y: 500 }}
              rowSelection={{
                onSelectRow: this.onSelectRow,
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
              childColumns={this.childColumns}
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
