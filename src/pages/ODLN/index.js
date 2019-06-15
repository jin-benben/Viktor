import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Divider,
  Select,
  DatePicker,
  Icon,
  message,
  Tag,
  Input,
} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import DocEntryFrom from '@/components/DocEntryFrom';
import NeedAskPrice from './components';
import MDMCommonality from '@/components/Select';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import { getName } from '@/utils/utils';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ salerConfrim, loading, global }) => ({
  salerConfrim,
  global,
  loading: loading.models.salerConfrim,
}))
@Form.create()
class salerConfrim extends PureComponent {
  state = {
    expandForm: false,
    modalVisible: false,
    selectedRows: [],
  };

  columns = [
    {
      title: '单号',
      width: 80,
      fixed: 'left',
      dataIndex: 'DocEntry',
      // render: (text, recond) => (
      //   <Link to={`/sellabout/TI_Z026/detail?DocEntry=${text}`}>{`${text}-${recond.LineID}`}</Link>
      // ),
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },

    {
      title: '客户',
      dataIndex: 'CardName',
      width: 200,
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}{' '}
        </Ellipsis>
      ),
    },
    {
      title: '联系人',
      width: 80,
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
      title: '邮箱',
      width: 200,
      dataIndex: 'Email',
    },
    {
      title: '交易公司',
      width: 150,
      dataIndex: 'CompanyCode',
      render: val => {
        const {
          global: { Company },
        } = this.props;
        return <span>{getName(Company, val)}</span>;
      },
    },
    {
      title: '发货状态',
      dataIndex: 'DeliverSts',
      width: 80,
      render: text => (
        <span>
          {text === 'Y' ? <Tag color="green">已发货</Tag> : <Tag color="blue">未发货</Tag>}
        </span>
      ),
    },
    {
      title: '发货时间',
      width: 100,
      dataIndex: 'DeliverDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '发货人',
      width: 80,
      dataIndex: 'DeliverUser',
    },
    {
      title: '快递单号',
      width: 150,
      dataIndex: 'ExpressNumber',
      render: (text, record, index) => (
        <Input onChange={e => this.rowChange(e.target.value, record, index, 'ExpressNumber')} />
      ),
    },
    {
      title: '运输方式',
      dataIndex: 'TrnspCode',
      width: 100,
      render: (text, record, index) => {
        const {
          global: { Trnsp },
        } = this.props;
        return (
          <MDMCommonality
            onChange={value => this.rowChange(value, record, index, 'TrnspCode')}
            initialValue={text}
            data={Trnsp}
          />
        );
      },
    },
    {
      title: '销售员',
      dataIndex: 'SlpCode',
      width: 80,
      render: val => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, val)}</span>;
      },
    },
    {
      title: '收货地址',
      dataIndex: 'Address',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      salerConfrim: { queryData },
    } = this.props;
    dispatch({
      type: 'salerConfrim/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Purchaser', 'Company', 'Trnsp'],
        },
      },
    });
  }

  rowChange = (value, record, index, key) => {
    const {
      salerConfrim: { orderLineList },
      dispatch,
    } = this.props;
    const newOrderLineList = orderLineList.map(item => {
      if (item.DocEntry === record.DocEntry) {
        // eslint-disable-next-line no-param-reassign
        record[key] = value;
        return record;
      }
      return item;
    });
    dispatch({
      type: 'salerConfrim/save',
      payload: {
        orderLineList: [...newOrderLineList],
      },
    });
  };

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      salerConfrim: { queryData },
    } = this.props;
    dispatch({
      type: 'salerConfrim/fetch',
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

      let DeliverDateFrom;
      let DeliverDateTo;
      if (fieldsValue.deliverArr) {
        DeliverDateFrom = moment(fieldsValue.deliverArr[0]).format('YYYY-MM-DD');
        DeliverDateTo = moment(fieldsValue.deliverArr[1]).format('YYYY-MM-DD');
      }

      let orderNo = {};
      if (fieldsValue.orderNo) {
        orderNo = { ...fieldsValue.orderNo };
      }
      const { DeliverSts, Owner } = fieldsValue;
      const queryData = {
        DocDateFrom,
        DocDateTo,
        DeliverDateFrom,
        DeliverDateTo,
        DeliverSts: DeliverSts || 'N',
        Owner,
        ...orderNo,
      };
      dispatch({
        type: 'salerConfrim/fetch',
        payload: {
          Content: {
            QueryType: '1',
            DeliverSts: 'N',
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

  // 发送需询价
  submitNeedLine = select => {
    const {
      dispatch,
      salerConfrim: { queryData },
    } = this.props;
    const loODLN01RequestItem = select.map(item => ({
      DocEntry: item.DocEntry,
      ExpressNumber: item.ExpressNumber,
      TrnspCode: item.TrnspCode,
    }));
    dispatch({
      type: 'salerConfrim/confirm',
      payload: {
        Content: {
          loODLN01RequestItem,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('提交成功');
          dispatch({
            type: 'salerConfrim/fetch',
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

  print = () => {
    const {
      dispatch,
      global: { currentUser },
    } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows.length) {
      message.warning('请先选择要打印的单据');
      return;
    }
    // eslint-disable-next-line camelcase
    const TI_Z04801RequestItemList = selectedRows.map(item => {
      const { TrnspCode, DocEntry, ShipToCode } = item;
      return {
        BaseType: '15',
        BaseEntry: DocEntry,
        TrnspCode,
        ShipToCode,
      };
    });
    dispatch({
      type: 'salerConfrim/print',
      payload: {
        Content: {
          TI_Z04801RequestItemList,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('提交成功');
          const DocEntryList = response.Content.TI_Z04801ResponseItemList.map(
            item => item.DocEntry
          );
          window.open(
            `http://47.104.65.49:8086/PrintExample.aspx?BaseType=15&DocEntryList=${DocEntryList.join()}&UserCode=${
              currentUser.UserCode
            }`
          );
        }
      },
    });
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
          <Col md={5} sm={24}>
            <FormItem key="orderNo" {...formLayout} label="单号">
              {getFieldDecorator('orderNo', {
                initialValue: { DocEntryFrom: '', DocEntryTo: '' },
              })(<DocEntryFrom />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="单据日期" {...formLayout}>
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
          <Col md={5} sm={24}>
            <FormItem label="发货日期" {...formLayout}>
              {getFieldDecorator('deliverArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>

          {expandForm ? (
            <Fragment>
              <Col md={4} sm={24}>
                <FormItem key="DeliverSts" {...formLayout}>
                  {getFieldDecorator('DeliverSts', { initialValue: 'N' })(
                    <Select placeholder="请选择发货状态">
                      <Option value="Y">已发货</Option>
                      <Option value="N">未发货</Option>
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
      salerConfrim: { orderLineList, pagination },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    let tabwitdh = 0;
    const columns = this.columns.map(item => {
      // eslint-disable-next-line no-param-reassign
      item.align = 'Center';
      if (item.width) {
        tabwitdh += item.width;
      }
      return item;
    });
    console.log(tabwitdh);

    const parentMethods = {
      handleSubmit: this.submitNeedLine,
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
              scroll={{ x: 1700, y: 500 }}
              columns={columns}
              rowSelection={{
                onSelectRow: this.onSelectRow,
              }}
              onChange={this.handleStandardTableChange}
            />
            <NeedAskPrice
              columns={this.columns}
              data={selectedRows}
              {...parentMethods}
              modalVisible={modalVisible}
            />
          </div>
        </Card>
        <FooterToolbar>
          <Button style={{ marginTop: 20 }} onClick={this.selectNeed} type="primary">
            确认发货
          </Button>
          <Button style={{ marginTop: 20 }} onClick={this.print} type="primary">
            打印
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default salerConfrim;
