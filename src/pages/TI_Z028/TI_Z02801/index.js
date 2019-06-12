/* eslint-disable array-callback-return */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, DatePicker, List, Icon, message, Radio } from 'antd';
import StandardTable from '@/components/StandardTable';
import MDMCommonality from '@/components/Select';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import OrderPreview from './components';
import { getName } from '@/utils/utils';
import styles from './style.less';

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
        <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${record.BaseEntry}`}>
          {`${val}-${record.BaseLineID}`}
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
    orderLineList: [],
    modalVisible: false,
  };

  childColumns = [
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.TI_Z02801.orderList !== prevState.orderLineList) {
      return {
        orderLineList: nextProps.TI_Z02801.orderList,
      };
    }
    return null;
  }

  expandedRowRender = (record, index) => (
    <Radio.Group onChange={item => this.childChange(item, record, index)}>
      <List
        itemLayout="horizontal"
        style={{ marginLeft: 60 }}
        className={styles.askInfo}
        dataSource={record.TI_Z02803}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={`${item.CardName}(${item.CardCode})`}
              avatar={<Radio value={item} />}
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
                    <Link
                      target="_blank"
                      style={{ marginLeft: 10 }}
                      to={`/purchase/TI_Z027/update?DocEntry=${item.PInquiryEntry}`}
                    >
                      修改
                    </Link>
                  </li>
                  <li>
                    交期：<span>{moment(item.InquiryDueDate).format('YYYY-MM-DD')}</span>
                  </li>
                  <li>
                    询价日期：<span>{moment(item.CreateDate).format('YYYY-MM-DD')}</span>
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
                </ul>
              }
            />
          </List.Item>
        )}
      />
    </Radio.Group>
  );

  childChange = (item, record, index) => {
    const { orderLineList } = this.state;

    const newrecord = orderLineList[index];
    Object.assign(newrecord, item.target.value);
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
      global: { Purchaser },
    } = this.props;

    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
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
            <FormItem key="Owner" {...formLayout} label="采购员">
              {getFieldDecorator('Owner')(<MDMCommonality data={Purchaser} />)}
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
      TI_Z02801: { pagination },
      global: { Purchaser, Company, Saler },
      loading,
    } = this.props;

    const { modalVisible, selectedRows, orderLineList } = this.state;

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
            <StandardTable
              loading={loading}
              data={{ list: orderLineList }}
              pagination={pagination}
              rowKey="LineID"
              scroll={{ x: 2250, y: 800 }}
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
