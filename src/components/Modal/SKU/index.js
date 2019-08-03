import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Modal, Button, message } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import request from '@/utils/request';

const FormItem = Form.Item;

@Form.create()
class SKUModal extends PureComponent {
  state = {
    skuList: [],
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
      title: '物料代码',
      dataIndex: 'Code',
      width: 100,
    },
    {
      title: '物料名称',
      dataIndex: 'Name',
      width: 100,
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '品牌',
      width: 100,
      dataIndex: 'BrandName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
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
          {' '}
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '参数',
      dataIndex: 'Parameters',
      width: 100,
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}
        </Ellipsis>
      ),
    },

    {
      title: '单位',
      width: 80,
      dataIndex: 'Unit',
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 150,
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {`${record.Cate1Name}/${record.Cate2Name}/${record.Cate3Name}`}
        </Ellipsis>
      ),
    },
  ];

  okHandle = () => {
    const { selectedRows } = this.state;
    const { handleSubmit } = this.props;
    if (selectedRows.length) {
      handleSubmit(selectedRows);
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
    this.getSKU(queryData);
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
      this.getSKU(queryData);
    });
  };

  getSKU = async params => {
    const { pagination } = this.state;
    const response = await request('/MDM/TI_Z009/TI_Z00902', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    if (response && response.Status === 200) {
      if (response.Content) {
        const { rows, records, page } = response.Content;
        this.setState({
          skuList: [...rows],
          queryData: { ...params },
          pagination: { ...pagination, total: records, current: page },
        });
      } else {
        this.setState({
          skuList: [],
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
    const { loading, pagination, skuList } = this.state;
    const { modalVisible, handleModalVisible, Type } = this.props;
    return (
      <Modal
        width={1100}
        title="物料选择"
        maskClosable={false}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false)}
      >
        <div className="tableList">
          <div className="tableListForm">{this.renderSimpleForm()}</div>
          <StandardTable
            loading={loading}
            data={{ list: skuList }}
            rowKey="Code"
            pagination={pagination}
            scroll={{ x: 1000 }}
            columns={this.columns}
            rowSelection={{
              type: Type || 'radio',
              onSelectRow: this.onSelectRow,
            }}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Modal>
    );
  }
}

export default SKUModal;
