import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Modal, Table, Badge, message } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { getName } from '@/utils/utils';

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

  skuColumns = [
    {
      title: '单号',
      width: 80,
      fixed: 'left',
      dataIndex: 'DocEntry',
      // render: (text, recond) => (
      //   <Link to={`/sellabout/TI_Z026/detail?DocEntry=${text}`}>{`${text}-${recond.LineID}`}</Link>
      // ),
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
      width: 100,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },

    {
      title: '客户',
      dataIndex: 'CardName',
      width: 200,
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}{' '}
        </Ellipsis>
      ),
    },
    {
      title: '联系人',
      width: 100,
      dataIndex: 'Contacts',
    },
    {
      title: '联系方式',
      width: 100,
      dataIndex: 'contact',
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {record.CellphoneNO}
          {record.PhoneNO ? <Divider type="vertical" /> : null}
          {record.PhoneNO}
        </Ellipsis>
      ),
    },
    {
      title: '邮箱',
      width: 100,
      dataIndex: 'Email',
    },
    {
      title: '交易公司',
      width: 100,
      dataIndex: 'CompanyCode',
    },
    {
      title: '发货状态',
      dataIndex: 'DeliverSts',
      width: 100,
      render: text => (
        <span>
          {text === 'Y' ? (
            <Badge color="green" text="已发货" />
          ) : (
            <Badge color="blue" text="未发货" />
          )}
        </span>
      ),
    },
    {
      title: '发货时间',
      width: 100,
      dataIndex: 'DeliverDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '发货人',
      width: 80,
      dataIndex: 'DeliverUser',
    },
    {
      title: '快递单号',
      width: 150,
      dataIndex: 'ExpressNumber',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '销售员',
      width: 80,
      dataIndex: 'SlpCode',
    },
    {
      title: '收货地址',
      dataIndex: 'Address',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
  ];

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
            scroll={{ x: 1500, y: 500 }}
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
