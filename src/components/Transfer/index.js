import React, { PureComponent, Fragment } from 'react';
// import { Row, Form, Input, Modal,Col } from 'antd';
import { Modal, Button, message } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import SalerPurchaser from '@/components/Select/SalerPurchaser';
import TransferConfirm from './modal';
import request from '@/utils/request';
import { getName } from '@/utils/utils';

// const FormItem = Form.Item;
// @Form.create()
@connect(({ loading, global }) => ({
  global,
  loading: loading.models.global,
}))
class Transfer extends PureComponent {
  columns = [
    {
      title: '处理人',
      fixed: 'left',
      width: 120,
      dataIndex: 'NewProcessor',
      render: (val, record, index) => {
        const {
          global: { ProcessorList },
        } = this.props;
        return (
          <SalerPurchaser
            initialValue={val}
            data={ProcessorList}
            onChange={select => this.processorChange(select, record, index)}
          />
        );
      },
    },
    {
      title: '处理角色',
      width: 80,
      dataIndex: 'NewRole',
      render: text => <span>{text === 'P' ? '采购' : '销售'}</span>,
    },
    {
      title: '客询价单',
      width: 80,
      dataIndex: 'BaseEntry',
    },

    {
      title: 'SKU',
      width: 80,
      dataIndex: 'SKU',
    },
    {
      title: '物料描述',
      dataIndex: 'SKUName',
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
      title: '原处理人',
      width: 80,
      dataIndex: 'OldProcessor',
      render: val => {
        const {
          global: { TI_Z004 },
        } = this.props;
        return <span>{getName(TI_Z004, val)}</span>;
      },
    },
    {
      title: '单据类型',
      width: 80,
      dataIndex: 'SourceType',
    },
    {
      title: '单号',
      width: 80,
      dataIndex: 'SourceEntry',
    },
    {
      title: '行号',
      width: 80,
      dataIndex: 'SourceLineID',
    },
    {
      title: '采购员',
      width: 80,
      dataIndex: 'Purchaser',
      align: 'center',
      render: val => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, val)}</span>;
      },
    },
    {
      title: '销售员',
      width: 80,
      dataIndex: 'Salesperson',
      align: 'center',
      render: val => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, val)}</span>;
      },
    },
  ];

  state = {
    orderLineList: [],
    loading: false,
    confimVisiable: false,
    selectedRows: [],
    queryData: {
      Content: {
        SourceEntry: '',
        Processor: '',
        SearchText: '',
        SearchKey: '',
        QueryType: '2',
      },
      page: 1,
      rows: 100,
      sidx: 'Code',
      sord: 'Desc',
    },
    // pagination: {
    //   showSizeChanger: true,
    //   showTotal: total => `共 ${total} 条`,
    //   pageSizeOptions: ['30', '60', '90'],
    //   total: 0,
    //   pageSize: 30,
    //   current: 1,
    // },
  };

  componentDidMount() {
    const {
      dispatch,
      global: { ProcessorList },
    } = this.props;
    if (!ProcessorList.length) {
      dispatch({
        type: 'global/getProcessor',
        payload: {
          Content: {
            SlpName: '',
          },
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { queryData } = this.state;
    const {
      SourceEntry,
      SourceType,
      modalVisible,
      global: { currentUser },
    } = nextProps;
    if (SourceType && modalVisible && SourceEntry) {
      if (SourceEntry !== queryData.Content.SourceEntry) {
        Object.assign(queryData.Content, {
          SourceEntry,
          SourceType,
          Processor: currentUser.UserCode,
        });
        this.queryOrder(queryData);
      }
      Object.assign(queryData.Content, {
        SourceEntry,
        SourceType,
        Processor: currentUser.UserCode,
      });
      return {
        queryData,
      };
    }
    return null;
  }

  processorChange = (select, record, index) => {
    // eslint-disable-next-line camelcase
    const { SlpCode, U_Type } = select;
    const { orderLineList } = this.state;
    Object.assign(record, { NewProcessor: SlpCode, NewRole: U_Type });
    orderLineList[index] = record;
    this.setState({ orderLineList: [...orderLineList] });
  };

  queryOrder = async params => {
    const response = await request('/OMS/TI_Z043/TI_Z04303', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    if (response && response.Status === 200) {
      this.setState({
        orderLineList: response.Content.rows,
      });
    }
  };

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const { queryData } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const newQueryData = {
        Content: {
          ...queryData,
          ...fieldsValue,
        },
        page: 1,
        rows: 30,
        sidx: 'Code',
        sord: 'Desc',
      };
      this.setState({ queryData: { ...newQueryData } });
      this.getSKU(newQueryData);
    });
  };

  handleModalVisibleConfirm = () => {
    this.setState({
      confimVisiable: false,
    });
  };

  confirmBtn = () => {
    const { selectedRows } = this.state;
    console.log(selectedRows);
    if (selectedRows.length) {
      this.setState({ confimVisiable: true });
    } else {
      message.warning('请先选择');
    }
  };

  handleSubmit = fieldsValue => {
    const { selectedRows } = this.state;
    const { SourceType } = this.props;
    // eslint-disable-next-line camelcase
    const { IsConfirm, IsEnquiry, Comment, TI_Z04302List } = fieldsValue;
    // eslint-disable-next-line camelcase
    const TI_Z04301RequestItemList = selectedRows.map(item => {
      const {
        NewProcessor,
        NewRole,
        BaseEntry,
        BaseLineID,
        SourceEntry,
        SourceLineID,
        DocEntry,
      } = item;
      return {
        IsConfirm,
        IsEnquiry,
        Comment,
        NewProcessor,
        NewRole,
        BaseEntry,
        BaseLineID,
        SourceType,
        SourceEntry,
        SourceLineID,
        OldDocEntry: DocEntry,
      };
    });
    this.addTransfer({
      Content: {
        TI_Z04301RequestItemList,
        TI_Z04302List,
        SourceType,
      },
    });
  };

  addTransfer = async params => {
    const response = await request('/OMS/TI_Z043/TI_Z04301', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    if (response && response.Status === 200) {
      message.success('转移成功');
      this.setState({
        confimVisiable: false,
      });
      const { handleModalVisible } = this.props;
      if (handleModalVisible) {
        handleModalVisible(false);
      }
    }
  };

  render() {
    const {
      //   form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      SourceEntry,
    } = this.props;
    const { orderLineList, loading, confimVisiable } = this.state;
    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 7 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 16 },
    //     md: { span: 10 },
    //   },
    // };

    return (
      <Modal
        width={960}
        destroyOnClose
        title="转移"
        maskClosable={false}
        visible={modalVisible}
        footer={null}
        onCancel={() => handleModalVisible(false)}
      >
        <Fragment>
          {/* <Form {...formItemLayout} onSubmit={this.handleSearch}>
            <Row>
              <Col md={5} sm={24}>
                <FormItem>
                  {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
                </FormItem>
              </Col>
            </Row>
          </Form> */}
          <StandardTable
            loading={loading}
            data={{ list: orderLineList }}
            rowKey="DocEntry"
            pagination={false}
            scroll={{ x: 1300, y: 400 }}
            columns={this.columns}
            rowSelection={{
              onSelectRow: this.onSelectRow,
            }}
            onChange={this.handleStandardTableChange}
          />
          <Button type="primary" style={{ marginTop: 20 }} onClick={this.confirmBtn}>
            确认转移
          </Button>

          <TransferConfirm
            DocEntry={SourceEntry}
            modalVisible={confimVisiable}
            handleModalVisible={this.handleModalVisibleConfirm}
            handleSubmit={this.handleSubmit}
          />
        </Fragment>
      </Modal>
    );
  }
}
export default Transfer;
