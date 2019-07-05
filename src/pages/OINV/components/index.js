import React, { PureComponent } from 'react';

import { connect } from 'dva';
import { Form, Modal, Table, message } from 'antd';

@connect(({ global }) => ({
  global,
}))
@Form.create()
class OrderLine extends PureComponent {
  state = {
    data: [],
    selectedRows: [],
    selectedRowKeys: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      return {
        data: nextProps.data,
        selectedRows: nextProps.data,
        selectedRowKeys: nextProps.data.map(item => item.Key),
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
    this.setState({ selectedRows: [...selectedRows], selectedRowKeys: [...selectedRowKeys] });
  };

  render() {
    const { modalVisible, handleModalVisible, columns } = this.props;
    const { data, selectedRowKeys } = this.state;

    return (
      <Modal
        width={1200}
        destroyOnClose
        maskClosable={false}
        title="确认选择"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <div className="tableList">
          <Table
            bordered
            dataSource={data}
            pagination={false}
            size="middle"
            rowKey="Key"
            scroll={{ x: 1900, y: 500 }}
            rowSelection={{
              onChange: this.onSelectRow,
              selectedRowKeys,
            }}
            columns={columns}
          />
        </div>
      </Modal>
    );
  }
}

export default OrderLine;
