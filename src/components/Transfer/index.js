import React, { PureComponent, Fragment } from 'react';
// import { Row, Form, Input, Modal,Col } from 'antd';
import { Modal, Button } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
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
      width: 80,
      dataIndex: 'NewProcessor',
    },
    {
      title: '处理角色',
      width: 80,
      dataIndex: 'NewRole',
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
      render: (val, record) => {
        const {
          global: { Purchaser },
        } = this.props;
        return record.lastIndex ? '' : <span>{getName(Purchaser, val)}</span>;
      },
    },
    {
      title: '销售员',
      width: 80,
      dataIndex: 'Salesperson',
      align: 'center',
      render: (val, record) => {
        const {
          global: { Saler },
        } = this.props;
        return record.lastIndex ? '' : <span>{getName(Saler, val)}</span>;
      },
    },
  ];

  state = {
    orderLineList: [],
    loading: false,
    confimVisiable: false,
    queryData: {
      Content: {
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
    pagination: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['30', '60', '90'],
      total: 0,
      pageSize: 30,
      current: 1,
    },
  };

  componentWillReceiveProps(nextProps) {
    const { orderLineList, queryData } = this.state;
    if (nextProps.SourceType && nextProps.SourceEntry && !orderLineList.length) {
      const {
        SourceEntry,
        SourceType,
        global: { currentUser },
      } = nextProps;
      Object.assign(queryData.Content, {
        SourceEntry,
        SourceType,
        Processor: currentUser.UserCode,
      });
      this.setState({ queryData }, () => {
        this.queryOrder(queryData);
      });
      return {
        queryData,
      };
    }
    return null;
  }

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

  handleSubmit = fieldsValue => {
    const { selectedRows } = this.state;
  };

  render() {
    const {
      //   form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
    } = this.props;
    const { orderLineList, loading, pagination, confimVisiable } = this.state;
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
        visible={modalVisible}
        footer={null}
        onCancel={() => handleModalVisible()}
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
            pagination={pagination}
            scroll={{ x: 1200, y: 400 }}
            columns={this.columns}
            rowSelection={{
              onSelectRow: this.onSelectRow,
            }}
            onChange={this.handleStandardTableChange}
          />
          <Button type="primary" onClick={() => this.setState({ confimVisiable: true })}>
            确认转移
          </Button>

          <TransferConfirm
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
