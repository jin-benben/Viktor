import React, { Component } from 'react';
import StandardTable from '@/components/StandardTable';

class OrderPreview extends Component {
  state = {
    orderList: [],
    selectedRows: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps.orderLineList);
    if (nextProps.orderLineList !== prevState.orderLineList) {
      return {
        orderLineList: nextProps.orderLineList,
      };
    }
    return null;
  }

  childOnSelectRow = (selectRows, index) => {
    const { selectedRows } = this.state;
    console.log(selectedRows);
    selectedRows[index].TI_Z02803 = [...selectRows];
  };

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  expandedRowRender = (record, index) => {
    const { childColumns } = this.props;
    return (
      <StandardTable
        data={{ list: record.TI_Z02803 }}
        rowSelection={{
          onSelectRow: selectRows => this.childOnSelectRow(selectRows, index),
        }}
        isAll
        selectedRows={record.TI_Z02803}
        columns={childColumns}
      />
    );
  };

  render() {
    const { columns } = this.props;
    const { orderLineList } = this.state;
    return (
      <div>
        <StandardTable
          data={{ list: orderLineList }}
          rowKey="LineID"
          scroll={{ x: 2250, y: 500 }}
          rowSelection={{
            onSelectRow: this.onSelectRow,
          }}
          isAll
          selectedRows={orderLineList}
          expandedRowRender={this.expandedRowRender}
          columns={columns}
          onChange={this.handleStandardTableChange}
        />
      </div>
    );
  }
}

export default OrderPreview;
