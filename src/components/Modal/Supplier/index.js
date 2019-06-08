import React, { PureComponent } from 'react';

import { Row, Col, Form, Input, Modal, Button, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import request from '@/utils/request';

const FormItem = Form.Item;

@Form.create()
@connect(({ loading, global }) => ({
  global,
  loading: loading.models.global,
}))
class SupplierModal extends PureComponent {
  state = {
    supplierList: [],
    selectedRows: [],
    queryData: {
      Content: {
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
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

  columns = [
    {
      title: '供应商代码',
      width: 100,
      dataIndex: 'Code',
    },
    {
      title: '供应商名称',
      dataIndex: 'Name',
    },
  ];

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      !prevState.supplierList.length &&
      prevState.supplierList !== nextProps.global.SupplierList
    ) {
      return {
        supplierList: nextProps.global.SupplierList,
      };
    }
    return null;
  }

  okHandle = () => {
    const { selectedRows } = this.state;
    const { handleSubmit } = this.props;
    if (selectedRows.length) {
      handleSubmit(selectedRows[0]);
    } else {
      message.warning('请先选择');
    }
  };

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  handleStandardTableChange = pagination => {
    let { queryData } = this.state;
    queryData = {
      ...queryData,
      page: pagination.current,
      rows: pagination.pageSize,
    };
    this.setState({ queryData });
    this.getCompany(queryData);
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const queryData = {
        Content: {
          SearchText: '',
          SearchKey: 'Name',
          ...fieldsValue,
        },
        page: 1,
        rows: 30,
        sidx: 'Code',
        sord: 'Desc',
      };
      this.getCompany(queryData);
    });
  };

  getCompany = async params => {
    const response = await request('/MDM/TI_Z007/TI_Z00702', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    if (response && response.Status === 200) {
      if (response.Content) {
        const { rows, records, page } = response.Content;
        const { pagination } = this.state;
        this.setState({
          supplierList: [...rows],
          pagination: { ...pagination, total: records, current: page },
        });
      }
    }
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8 }}>
          <Col>
            <FormItem>
              {getFieldDecorator('SearchText')(<Input autoFocus placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading, pagination, supplierList } = this.state;
    const { modalVisible, handleModalVisible } = this.props;
    return (
      <Modal
        width={960}
        destroyOnClose
        title="供应商选择"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <div className="tableList">
          <div className="tableListForm">{this.renderSimpleForm()}</div>
          <StandardTable
            loading={loading}
            data={{ list: supplierList }}
            rowKey="Code"
            scroll={{ y: 400 }}
            pagination={pagination}
            columns={this.columns}
            rowSelection={{
              type: 'radio',
              onSelectRow: this.onSelectRow,
            }}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Modal>
    );
  }
}

export default SupplierModal;
