import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Button, DatePicker, Input } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import MDMCommonality from '@/components/Select/index';
import { connect } from 'dva';

@connect(({ global }) => ({
  global,
}))
class SelectionLine extends Component {
  state = {
    selectedRows: [],
    orderLineList: [],
  };

  columns = [
    {
      title: '供应商',
      width: 200,
      dataIndex: 'CardName',
    },
    {
      title: '总物料数',
      dataIndex: 'LineSum',
      width: 150,
      render: (text, record) => <span>{record.TI_Z02702.length}</span>,
    },
    {
      title: '有效期',
      dataIndex: 'ToDate',
      render: (text, record, index) => (
        <DatePicker
          onChange={(date, dateString) => this.RowChange(dateString, index, record, 'ToDate')}
          defaultValue={moment(record.ToDate, 'YYYY-MM-DD')}
        />
      ),
    },
    {
      title: '供应商参考号',
      width: 150,
      dataIndex: 'NumAtCard',
      render: (text, record, index) => (
        <Input
          onChange={e => this.RowChange(e.target.value, index, record, 'NumAtCard')}
          value={text}
        />
      ),
    },
    {
      title: '所有者',
      width: 150,
      dataIndex: 'Owner',
      render: (text, record, index) => {
        const {
          global: { Purchaser },
        } = this.props;
        return (
          <MDMCommonality
            onChange={value => {
              this.RowChange(value, index, record, 'Owner');
            }}
            initialValue={text}
            data={Purchaser}
          />
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'Comment',
      render: (text, record, index) => (
        <Input
          onChange={e => this.RowChange(e.target.value, index, record, 'Comment')}
          value={text}
        />
      ),
    },
  ];

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.orderLineList !== prevState.orderLineList) {
      return {
        orderLineList: nextProps.orderLineList,
        selectedRows: nextProps.orderLineList,
      };
    }
    return null;
  }

  RowChange = (value, index, record, key) => {
    const { orderLineList } = this.state;
    record[key] = value;
    orderLineList[index] = record;
    this.setState({ orderLineList });
  };

  onSelectRow = selectedRows => {
    const { submitStepParent } = this.props;
    this.setState({ selectedRows: [...selectedRows] });
    submitStepParent(selectedRows);
  };

  expandedRowRender = record => {
    const columns = [
      {
        title: '客户参考号',
        width: 150,
        dataIndex: 'NumAtCard',
      },
      {
        title: 'SKU',
        width: 80,
        dataIndex: 'SKU',
      },
      {
        title: '产品描述',
        dataIndex: 'SKUName',
        render: text => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '品牌',
        width: 80,
        dataIndex: 'BrandName',
      },
      {
        title: '名称',
        width: 100,
        dataIndex: 'ProductName',
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
        render: text => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '数量',
        width: 80,
        dataIndex: 'Quantity',
      },
      {
        title: '单位',
        width: 80,
        dataIndex: 'Unit',
      },
      {
        title: '要求交期',
        dataIndex: 'DueDate',
        width: 100,
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '行备注',
        width: 80,
        dataIndex: 'LineComment',
      },
      {
        title: '单号',
        width: 100,
        dataIndex: 'DocEntry',
      },
      {
        title: '行号',
        width: 50,
        dataIndex: 'LineID',
      },
    ];

    return <StandardTable data={{ list: record.TI_Z02702 }} columns={columns} />;
  };

  render() {
    const { orderLineList } = this.props;
    const { selectedRows } = this.state;
    return (
      <div>
        <StandardTable
          data={{ list: orderLineList }}
          rowKey="key"
          scroll={{ x: 1500 }}
          columns={this.columns}
          isAll
          selectedRows={selectedRows}
          rowSelection={{
            onSelectRow: this.onSelectRow,
          }}
          expandedRowRender={this.expandedRowRender}
          onChange={this.handleStandardTableChange}
        />
      </div>
    );
  }
}

export default SelectionLine;
