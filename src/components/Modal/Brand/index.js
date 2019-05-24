import React, { PureComponent } from 'react';

import { Row, Col, Form, Input, Modal, Button, message } from 'antd';
import StandardTable from '@/components/StandardTable';

import request from '@/utils/request';

const FormItem = Form.Item;

@Form.create()
class BrandModal extends PureComponent {
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
      title: '品牌代码',
      dataIndex: 'Code',
    },
    {
      title: '品牌名称',
      dataIndex: 'Name',
    },
  ];

  componentDidMount() {
    const { queryData } = this.state;
    this.getCompany(queryData);
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
    const response = await request('/MDM/TI_Z006/TI_Z00602', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    if (response.Status === 200) {
      if (response.Content) {
        const { rows, records, page } = response.Content;
        const { pagination } = this.state;
        this.setState({
          staffsList: [...rows],
          pagination: { ...pagination, total: records, current: page },
        });
      }
    }
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { queryData } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8 }}>
          <Col className="submitButtons">
            {queryData.SearchKey === 'Name' ? (
              <FormItem label="客户名称">
                {getFieldDecorator('SearchText')(<Input placeholder="请输入" />)}
              </FormItem>
            ) : (
              <FormItem label="客户ID">
                {getFieldDecorator('SearchText')(<Input placeholder="请输入" />)}
              </FormItem>
            )}
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
        width={960}
        destroyOnClose
        title="客户选择"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <div className="tableList">
          <div className="tableListForm">{this.renderSimpleForm()}</div>
          <StandardTable
            loading={loading}
            data={{ list: staffsList }}
            rowKey="Code"
            pagination={pagination}
            columns={this.columns}
            rowSelection={{
              onSelectRow: this.onSelectRow,
            }}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Modal>
    );
  }
}

export default BrandModal;
