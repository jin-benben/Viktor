import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Tooltip,
  Select,
  DatePicker,
  Icon,
  message,
  Tag,
  Input,
  Modal,
  Table,
  Checkbox,
} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import StandardTable from '@/components/StandardTable';
import DocEntryFrom from '@/components/DocEntryFrom';
import NeedAskPrice from './components';
import MDMCommonality from '@/components/Select';
import OrderPrint from '@/components/Modal/OrderPrint';
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
    modalVisible1: false,
    ischecked: true,
    selectedRows: [],
    selectedRowKeys: [],
    responseData: [],
    selectPrint: [],
  };

  columns = [
    {
      title: '单号',
      width: 80,
      fixed: 'left',
      dataIndex: 'DocEntry',
      render: text => (
        <Link to={`/sellabout/odlnordnDetail?DocEntry==${text}&ObjType=15`}>{text}</Link>
      ),
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
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
      width: 100,
      dataIndex: 'Contacts',
      render: (text, record) => (
        <Tooltip
          title={
            <Fragment>
              {record.CellphoneNO}
              <br />
              {record.Email}
              <br />
              {record.PhoneNO}
            </Fragment>
          }
        >
          {text}
        </Tooltip>
      ),
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
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
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
        <Input
          value={text}
          onChange={e => this.rowChange(e.target.value, record, index, 'ExpressNumber')}
        />
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
      width: 120,
      render: val => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, val)}</span>;
      },
    },
    {
      title: '打印状态',
      dataIndex: 'PrintStatus',
      width: 80,
      render: text => (
        <span>
          {text === 'Y' ? <Tag color="green">已打印</Tag> : <Tag color="blue">未打印</Tag>}
        </span>
      ),
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

  responseColums = [
    {
      title: '基于类型',
      width: 80,
      dataIndex: 'BaseType',
    },
    {
      title: '基于单号',
      width: 80,
      dataIndex: 'BaseEntry',
    },
    {
      title: '快递面单单号',
      width: 120,
      dataIndex: 'DocEntry',
    },
    {
      title: '状态',
      width: 80,
      dataIndex: 'Status',
      render: text => (
        <span>{text === 'O' ? <Tag color="red">未成功</Tag> : <Tag color="blue">已成功</Tag>}</span>
      ),
    },
    {
      title: '快递公司',
      width: 100,
      dataIndex: 'TrnspCode',
      render: text => {
        const {
          global: { Trnsp },
        } = this.props;
        return <span>{getName(Trnsp, text)}</span>;
      },
    },
    {
      title: '快递单号',
      width: 200,
      dataIndex: 'LogisticCode',
    },
    {
      title: '原因',
      dataIndex: 'Reason',
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

  onSelectPrintRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectPrint: [...selectedRows] });
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
      this.setState({
        modalVisible: true,
      });
    } else {
      message.warning('请先选择');
    }
  };

  // 需询价弹窗
  handleModalVisible = flag => {
    this.setState({ modalVisible: !!flag, modalVisible1: !!flag });
  };

  printODLN = () => {
    const { selectedRows } = this.state;
    if (!selectedRows.length) {
      message.warning('请先选择要打印的单据');
    }
  };

  print = () => {
    const { dispatch } = this.props;
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
          const selectPrint = [];
          const selectedRowKeys = [];
          // eslint-disable-next-line array-callback-return
          response.Content.TI_Z04801ResponseItemList.map(item => {
            if (item.Status === 'C') {
              selectPrint.push(item);
              selectedRowKeys.push(item.DocEntry);
            }
          });
          this.setState({
            responseData: [...response.Content.TI_Z04801ResponseItemList],
            selectPrint,
            selectedRowKeys,
            modalVisible1: true,
          });
        }
      },
    });
  };

  okHandle = () => {
    const {
      global: { currentUser },
    } = this.props;
    const { selectPrint, ischecked } = this.state;
    const DocEntryList = selectPrint.map(item => item.BaseEntry);
    if (DocEntryList.length) {
      window.open(
        `http://47.104.65.49:8086/PrintExample.aspx?BaseType=15&DocEntryList=${DocEntryList.join()}&UserCode=${
          currentUser.UserCode
        }&IsPreview=${ischecked ? '1' : '0'}`
      );
    } else {
      message.success('请先选择');
    }
  };

  changePriview = e => {
    this.setState({
      ischecked: e.target.checked,
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
              <Col md={5} sm={24}>
                <FormItem key="PrintStatus" {...formLayout} label="打印状态">
                  {getFieldDecorator('PrintStatus', { initialValue: 'N' })(
                    <Select style={{ width: '100%' }} placeholder="请选择打印状态">
                      <Option value="Y">已打印</Option>
                      <Option value="N">未打印</Option>
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
    const {
      selectedRows,
      modalVisible,
      responseData,
      modalVisible1,
      ischecked,
      selectedRowKeys,
    } = this.state;

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
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: orderLineList }}
              pagination={pagination}
              rowKey="DocEntry"
              scroll={{ x: 1800, y: 500 }}
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

          <Button style={{ marginTop: 20 }} onClick={this.printODLN} type="primary">
            {selectedRows.length ? (
              <OrderPrint BaseEntry={selectedRows[0].DocEntry} BaseType="ODLN" />
            ) : (
              '提交打印'
            )}
          </Button>
          <Button style={{ marginTop: 20 }} onClick={this.print} type="primary">
            快递单打印
          </Button>
        </FooterToolbar>
        <Modal
          width={960}
          destroyOnClose
          title="确认选择"
          onCancel={() => this.handleModalVisible(false)}
          footer={null}
          visible={modalVisible1}
        >
          <div className="tableList">
            <Table
              bordered
              dataSource={responseData}
              pagination={false}
              size="middle"
              rowKey="DocEntry"
              scroll={{ y: 500 }}
              rowSelection={{
                onChange: this.onSelectPrintRow,
                selectedRowKeys,
              }}
              columns={this.responseColums}
            />
            <div style={{ marginTop: 30 }}>
              <Checkbox checked={ischecked} onChange={this.changePriview}>
                预览快递单
              </Checkbox>{' '}
              <Button onClick={this.okHandle} type="primary">
                打印
              </Button>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default salerConfrim;
