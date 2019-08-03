import React, { PureComponent } from 'react';
import { Modal, message, Table } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import request from '@/utils/request';
import { baseType } from '@/utils/publicData';
import { getName } from '@/utils/utils';

class BrandModal extends PureComponent {
  columns = [
    {
      title: '基于单号',
      dataIndex: 'BaseEntry',
      width: 100,
    },
    {
      title: '基于类型',
      width: 100,
      dataIndex: 'BaseType',
      render: text => <span>{getName(baseType, text)}</span>,
    },
    {
      title: '供应商名称',
      width: 100,
      dataIndex: 'SupplierName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '客户名称',
      width: 100,
      dataIndex: 'CardName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '询价价格',
      width: 100,
      dataIndex: 'InquiryPrice',
    },
    {
      title: '询价运费',
      width: 100,
      dataIndex: 'ForeignFreight',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      selectedRows: [],
      queryData: {
        Content: {
          SearchText: props.SearchText,
          SearchKey: 'Name',
        },
        page: 1,
        rows: 20,
        sidx: 'DocEntry',
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
  }

  componentWillReceiveProps(nextProps) {
    const { queryData } = this.state;
    const { SearchText } = queryData.Content;
    if (SearchText !== nextProps.ProductName && nextProps.ProductName) {
      this.setState({
        queryData: {
          Content: {
            SearchText: nextProps.ProductName,
            SearchKey: 'Name',
          },
          page: 1,
          rows: 20,
          sidx: 'DocEntry',
          sord: 'Desc',
        },
      });
      this.getHistory({
        Content: {
          SearchText: nextProps.ProductName,
          SearchKey: 'Name',
        },
        page: 1,
        rows: 20,
        sidx: 'DocEntry',
        sord: 'Desc',
      });
    }
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
    this.getHistory(queryData);
  };

  getHistory = async params => {
    const response = await request('/MDM/TI_Z009/TI_Z00910', {
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
          dataSource: [...rows],
          queryData: { ...params },
          pagination: { ...pagination, total: records, current: page },
        });
      } else {
        this.setState({
          dataSource: [],
          queryData: { ...params },
          pagination: { ...pagination, total: 0 },
        });
      }
    }
  };

  render() {
    const { loading, pagination, dataSource } = this.state;
    const { modalVisible, handleModalVisible } = this.props;
    return (
      <Modal
        width={960}
        maskClosable={false}
        destroyOnClose
        title="询价记录"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <div className="tableList">
          <Table
            loading={loading}
            dataSource={dataSource}
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
