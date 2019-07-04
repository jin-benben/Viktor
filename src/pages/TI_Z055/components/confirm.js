/* eslint-disable array-callback-return */
import React from 'react';
import { connect } from 'dva';
import { Form, Modal, message, Table } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import MDMCommonality from '@/components/Select';
import { getName } from '@/utils/utils';

@connect(({ global }) => ({
  global,
}))
@Form.create()
class OrderLine extends React.Component {
  state = {
    data: [],
    selectedRows: [],
  };

  skuColumns = [
    {
      title: '基于单号',
      dataIndex: 'BaseEntry',
      width: 80,
      align: 'center',
      render: (text, record) => <span>{`${text}-${record.BaseLineID}`}</span>,
    },
    {
      title: '新采购员',
      width: 150,
      dataIndex: 'NewPurchaser',
      align: 'center',
      render: (text, record, index) => {
        const {
          global: { Purchaser },
        } = this.props;
        if (!record.lastIndex) {
          return (
            <div style={{ width: 120 }}>
              <MDMCommonality
                onChange={value => {
                  this.rowSelectChange(value, record, index);
                }}
                initialValue={text}
                data={Purchaser}
              />
            </div>
          );
        }
        return '';
      },
    },
    {
      title: '采购员',
      width: 120,
      dataIndex: 'Purchaser',
      align: 'center',
      render: text => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, text)}</span>;
      },
    },
    {
      title: '物料',
      dataIndex: 'SKU',
      align: 'center',
      width: 300,
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {`${text}-${record.SKUName}`}
        </Ellipsis>
      ),
    },
    {
      title: '品牌',
      width: 150,
      dataIndex: 'BrandName',
    },
    {
      title: '数量',
      width: 100,
      dataIndex: 'Quantity',
      align: 'center',
      render: (text, record) => <span>{`${text}(${record.Unit})`}</span>,
    },
  ];

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      const selectedRowKeys = nextProps.data.map(item => item.key);
      return {
        data: nextProps.data,
        selectedRows: nextProps.data,
        selectedRowKeys,
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data.length && nextState.data.length) {
      return true;
    }
    return false;
  }

  rowSelectChange = (value, record, index) => {
    const { selectedRows } = this.state;
    Object.assign(record, { NewPurchaser: value, OldPurchaser: record.Purchaser });
    selectedRows[index] = record;
    this.setState({ selectedRows: [...selectedRows] });
  };

  okHandle = async () => {
    const { selectedRows } = this.state;
    const { handleSubmit } = this.props;
    if (selectedRows.length) {
      const TI_Z05502 = selectedRows.map(item => ({
        BaseEntry: item.BaseEntry,
        BaseLineID: item.BaseLineID,
        OldPurchaser: item.OldPurchaser,
        NewPurchaser: item.NewPurchaser,
      }));
      handleSubmit(TI_Z05502);
    } else {
      message.warning('请先选择');
    }
  };

  onSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows: [...selectedRows], selectedRowKeys: [...selectedRowKeys] });
  };

  render() {
    const { modalVisible, handleModalVisible } = this.props;
    const { data, selectedRowKeys } = this.state;
    return (
      <Modal
        width={1200}
        destroyOnClose
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
            rowKey="key"
            scroll={{ x: 1100, y: 600 }}
            rowSelection={{
              onChange: this.onSelectRow,
              selectedRowKeys,
            }}
            columns={this.skuColumns}
          />
        </div>
      </Modal>
    );
  }
}

export default OrderLine;
