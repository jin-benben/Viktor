import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Modal, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import { getName } from '@/utils/utils';

@connect(({ global }) => ({
  global,
}))
@Form.create()
class OrderLine extends PureComponent {
  state = {
    data: [],
    selectedRows: [],
  };

  skuColumns = [
    {
      title: '单号',
      width: 50,
      fixed: 'left',
      dataIndex: 'DocEntry',
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
      width: 100,
    },
    {
      title: '产品描述',
      dataIndex: 'SKUName',

      width: 200,

      align: 'center',
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
    },
    {
      title: '型号',
      width: 150,
      dataIndex: 'ManufactureNO',
      align: 'center',
    },
    {
      title: '参数',
      width: 150,
      dataIndex: 'Parameters',

      align: 'center',
    },
    {
      title: '包装',
      width: 150,
      dataIndex: 'Package',

      align: 'center',
    },
    {
      title: '采购员',
      width: 100,
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
      title: '数量',
      width: 100,
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
      title: '要求交期',
      width: 150,
      dataIndex: 'DueDate',
      align: 'center',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '仓库',
      width: 150,
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
      title: '销售建议价',
      width: 120,
      dataIndex: 'Price',
      align: 'center',
    },
    {
      title: '询价备注',
      dataIndex: 'InquiryComment',

      width: 150,

      align: 'center',
    },
    {
      title: '销售行总计',
      width: 150,
      align: 'center',
      dataIndex: 'LineTotal',
    },
  ];

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      return {
        data: nextProps.data,
        selectedRows: nextProps.data,
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

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  render() {
    const { modalVisible, handleModalVisible } = this.props;
    const { data, selectedRows } = this.state;
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
          <StandardTable
            data={{ list: data }}
            rowKey="Key"
            columns={this.skuColumns}
            scroll={{ x: 2000 }}
            rowSelection={{
              onSelectRow: this.onSelectRow,
            }}
            isAll
            selectedRows={selectedRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Modal>
    );
  }
}

export default OrderLine;
