import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Modal, Button, message, Table } from 'antd';

import request from '@/utils/request';

const FormItem = Form.Item;

@Form.create()
class StaffsModal extends PureComponent {
  state = {
    staffsList: [],
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
      title: '员工ID',
      width: 100,
      dataIndex: 'Code',
    },
    {
      title: '姓名',
      width: 100,
      dataIndex: 'Name',
    },
  ];

  componentDidMount() {
    const { queryData } = this.state;
    this.getStaffs(queryData);
  }

  okHandle = () => {
    const { selectedRows } = this.state;
    const { handleSubmit } = this.props;
    if (selectedRows.length) {
      handleSubmit(selectedRows);
    } else {
      message.warning('请先选择');
    }
  };

  onSelectRow = (selectedRowKeys, selectedRows) => {
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
    this.getStaffs(queryData);
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
      this.getStaffs(queryData);
    });
  };

  getStaffs = async params => {
    const response = await request('/MDM/TI_Z004/TI_Z00402', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    if (response && response.Status === 200) {
      const { pagination } = this.state;
      if (response.Content) {
        const { rows, records, page } = response.Content;
        this.setState({
          staffsList: [...rows],
          queryData: { ...params },
          pagination: { ...pagination, total: records, current: page },
        });
      } else {
        this.setState({
          staffsList: [],
          queryData: { ...params },
          pagination: { ...pagination, total: 0 },
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
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem>
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
    const { loading, pagination, staffsList } = this.state;
    const { modalVisible, handleModalVisible } = this.props;
    return (
      <Modal
        width={640}
        destroyOnClose
        maskClosable={false}
        title="员工选择"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <div className="tableList">
          <div className="tableListForm">{this.renderSimpleForm()}</div>
          <Table
            loading={loading}
            dataSource={staffsList}
            rowKey="Code"
            scroll={{ y: 400 }}
            pagination={pagination}
            columns={this.columns}
            rowSelection={{
              onChange: this.onSelectRow,
            }}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Modal>
    );
  }
}

export default StaffsModal;
