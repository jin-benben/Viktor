import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Modal, Button, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import request from '@/utils/request';

const FormItem = Form.Item;

@Form.create()
@connect(({ loading, global }) => ({
  global,
  loading: loading.models.global,
}))
class CompanyModal extends PureComponent {
  state = {
    companyList: [],
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
      title: '客户代码',
      width: 200,
      dataIndex: 'Code',
    },
    {
      title: '客户名称',
      dataIndex: 'Name',
    },
  ];

  okHandle = () => {
    const { selectedRows } = this.state;
    const { handleSubmit } = this.props;
    if (selectedRows.length) {
      handleSubmit(selectedRows[0].Code);
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
        rows: 20,
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
    if (response && response.Status === 200) {
      const { pagination } = this.state;
      if (response.Content) {
        const { rows, records, page } = response.Content;
        this.setState({
          companyList: [...rows],
          queryData: { ...params },
          pagination: { ...pagination, total: records, current: page, pageSize: params.rows },
        });
      } else {
        this.setState({
          companyList: [],
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
    const { loading, pagination, companyList } = this.state;
    const { modalVisible, handleModalVisible } = this.props;
    return (
      <Modal
        width={960}
        destroyOnClose
        maskClosable={false}
        title="客户选择"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <div className="tableList">
          <div className="tableListForm">{this.renderSimpleForm()}</div>
          <StandardTable
            loading={loading}
            data={{ list: companyList }}
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

export default CompanyModal;
