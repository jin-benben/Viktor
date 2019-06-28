/* eslint-disable array-callback-return */
import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Modal, message, Table } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { purchaserRule, confirmRule } from '../service';
import { getName } from '@/utils/utils';

@connect(({ global }) => ({
  global,
}))
@Form.create()
class OrderLine extends React.Component {
  state = {
    data: [],
    selectedRows: [],
    isCan: true, // 是否要去拉去最新的采购员
  };

  skuColumns = [
    {
      title: '单号',
      dataIndex: 'DocEntry',
      fixed: 'left',
      width: 80,
      align: 'center',
      render: (text, record) => <span>{`${text}-${record.LineID}`}</span>,
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
      title: '数量',
      width: 100,
      dataIndex: 'Quantity',
      align: 'center',
      render: (text, record) => <span>{`${text}-${record.Unit}`}</span>,
    },
    {
      title: '产地',
      width: 80,
      dataIndex: 'ManLocation',
      align: 'center',
      render: (text, record) => {
        const {
          global: { TI_Z042 },
        } = this.props;
        if (!record.lastIndex) {
          return record.lastIndex ? '' : <span>{getName(TI_Z042, text)}</span>;
        }
        return '';
      },
    },
    {
      title: 'HS编码',
      width: 100,
      inputType: 'text',
      dataIndex: 'HSCode',
    },
    {
      title: '税率',
      width: 80,
      dataIndex: 'HSVatRate',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? '' : <span>{`${text}-${record.HSVatRateOther}`}</span>,
    },
    {
      title: '价格',
      width: 80,
      dataIndex: 'Price',
      align: 'center',
    },
    {
      title: '行总计',
      width: 80,
      align: 'center',
      dataIndex: 'LineTotal',
    },
    {
      title: '要求交期',
      width: 100,
      dataIndex: 'DueDate',
      align: 'center',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '仓库',
      width: 100,
      dataIndex: 'WhsCode',
      align: 'center',
      render: text => {
        const {
          global: { WhsCode },
        } = this.props;
        return <span>{getName(WhsCode, text)}</span>;
      },
    },
  ];

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      const selectedRowKeys = nextProps.data.map(item => item.Key);
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

  componentDidUpdate() {
    const { data, isCan } = this.state;
    if (isCan && data.length) {
      this.getPurchaser(data);
    }
  }

  getPurchaser = async data => {
    // eslint-disable-next-line consistent-return
    const loItemList = data.map(item => {
      if (item.IsInquiry === 'N') {
        return {
          DocEntry: item.DocEntry,
          LineID: item.LineID,
        };
      }
    });
    const response = await purchaserRule({ Content: { loItemList } });
    this.setState({ isCan: false });
    if (response && response.Status === 200) {
      const { ItemList } = response.Content;
      const newData = data.map((row, index) => {
        Object.assign(row, ItemList[index], { Key: index });
        return row;
      });
      this.setState({ data: [...newData] });
    }
  };

  rowSelectChange = (value, record, index) => {
    const { selectedRows } = this.state;
    Object.assign(record, { Purchaser: value });
    selectedRows[index] = record;
    this.setState({ selectedRows: [...selectedRows] });
  };

  okHandle = async () => {
    const { selectedRows } = this.state;
    const { handleSubmit } = this.props;
    if (selectedRows.length) {
      const loItemList = selectedRows.map(item => ({
        DocEntry: item.DocEntry,
        LineID: item.LineID,
        Purchaser: item.Purchaser,
      }));
      const response = await confirmRule({ Content: { loItemList } });
      if (response && response.Status === 200) {
        handleSubmit(selectedRows);
      }
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
            rowKey="Key"
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
