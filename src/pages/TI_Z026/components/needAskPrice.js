/* eslint-disable array-callback-return */
import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Modal, message, Table } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import MDMCommonality from '@/components/Select';
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
    isCan: false, // 是否要去拉去最新的采购员
  };

  skuColumns = [
    {
      title: '单号',
      dataIndex: 'DocEntry',
      fixed: 'left',
      width: 50,
      align: 'center',
    },
    {
      title: '行号',
      dataIndex: 'LineID',
      fixed: 'left',
      width: 50,
      align: 'center',
    },
    {
      title: 'SKU',
      dataIndex: 'SKU',
      align: 'center',
      width: 80,
    },
    {
      title: '产品描述',
      dataIndex: 'SKUName',
      width: 200,
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '品牌',
      width: 100,
      align: 'center',
      dataIndex: 'BrandName',
    },
    {
      title: '名称',
      dataIndex: 'ProductName',
      width: 150,
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '外文名称',
      dataIndex: 'ForeignName',
      width: 150,
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '型号',
      width: 100,
      dataIndex: 'ManufactureNO',
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '参数',
      width: 100,
      dataIndex: 'Parameters',
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '包装',
      width: 100,
      dataIndex: 'Package',
      align: 'center',
    },
    {
      title: '数量',
      width: 80,
      dataIndex: 'Quantity',
      align: 'center',
    },
    {
      title: '单位',
      width: 80,
      dataIndex: 'Unit',
      align: 'center',
    },
    {
      title: '采购员',
      width: 100,
      dataIndex: 'Purchaser',
      align: 'center',
      render: (text, record, index) => {
        const {
          global: { Purchaser },
        } = this.props;
        return (
          <MDMCommonality
            onChange={value => {
              this.rowSelectChange(value, record, index);
            }}
            initialValue={text}
            data={Purchaser}
          />
        );
      },
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
    {
      title: '价格',
      width: 100,
      dataIndex: 'Price',
      align: 'center',
    },
    {
      title: '行总计',

      align: 'center',
      dataIndex: 'LineTotal',
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
    console.log(selectedRowKeys);
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
            size="middle"
            pagination={false}
            rowKey="Key"
            scroll={{ x: 1750, y: 500 }}
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
