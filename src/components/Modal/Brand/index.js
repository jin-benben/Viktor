import React, { PureComponent } from 'react';

import { Row, Col, Form, Input, Modal, Button, message, Table } from 'antd';
import { connect } from 'dva';
import request from '@/utils/request';

const FormItem = Form.Item;

@Form.create()
@connect(({ global }) => ({
  global,
}))
class BrandModal extends PureComponent {
  state = {
    brandList: [],
    selectedRows: [],
    queryData: {
      Content: {
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 20,
      sidx: 'Code',
      sord: 'Desc',
    },
    pagination: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['20', '40', '60'],
      total: 0,
      pageSize: 20,
      current: 1,
    },
  };

  columns = [
    {
      title: '品牌代码',
      dataIndex: 'Code',
      width: 100,
    },
    {
      title: '品牌名称',
      width: 100,
      dataIndex: 'Name',
    },
  ];

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.brandList.length) {
      return {
        brandList: nextProps.global.BrandList,
      };
    }
    return null;
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
    this.getBrand(queryData);
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
        rows: 20,
        sidx: 'Code',
        sord: 'Desc',
      };
      this.getBrand(queryData);
    });
  };

  getBrand = async params => {
    const response = await request('/MDM/TI_Z005/TI_Z00502', {
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
          brandList: [...rows],
          queryData: { ...params },
          pagination: { ...pagination, total: records, current: page },
        });
      } else {
        this.setState({
          brandList: [],
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
    const { loading, pagination, brandList } = this.state;
    const { modalVisible, handleModalVisible } = this.props;
    return (
      <Modal
        width={960}
        destroyOnClose
        title="品牌选择"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <div className="tableList">
          <div className="tableListForm">{this.renderSimpleForm()}</div>
          <Table
            loading={loading}
            dataSource={brandList}
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

export default BrandModal;
