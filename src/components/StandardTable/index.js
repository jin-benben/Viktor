import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';

import styles from './index.less';

// 要想列可以拖拽，列必须制定宽度

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
};

class StandardTable extends PureComponent {
  components = {
    // 修改表头组件
    header: {
      cell: ResizeableTitle,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      columns: props.columns,
    };
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const {
      rowSelection: { onSelectRow },
    } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }
    this.setState({ selectedRowKeys });
  };

  render() {
    const { data = {}, rowKey, ...rest } = this.props;
    let { rowSelection } = this.props;

    const { list = [], pagination } = data;
    const { selectedRowKeys } = this.state;
    let paginationProps = false;
    if (pagination) {
      paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        ...pagination,
      };
    }
    if (rowSelection) {
      rowSelection = {
        selectedRowKeys,
        onChange: this.handleRowSelectChange,
        getCheckboxProps: record => ({
          disabled: record.disabled,
        }),
      };
    }

    let { columns } = this.state;
    columns = columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));
    return (
      <div className={styles.standardTable}>
        <Table
          bordered
          components={this.components}
          rowKey={rowKey || 'key'}
          dataSource={list}
          pagination={paginationProps}
          size="middle"
          onChange={this.handleTableChange}
          {...rest}
          rowSelection={rowSelection}
          columns={columns} //  columns={columns} 需放到  {...rest} 后，防止 columns 被覆盖
        />
      </div>
    );
  }
}

export default StandardTable;
