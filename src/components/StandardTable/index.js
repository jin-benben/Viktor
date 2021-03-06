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
      rowId: '',
      height: 0,
    };
  }

  componentDidMount() {
    this.setState({
      height: document.body.offsetHeight - 56 - 64 - 56 - 24 - 32 - 30,
    });
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.isAll) {
      return {
        selectedRowKeys: [...Array(nextProps.selectedRows.length).keys()],
      };
    }
    if (!nextProps.selectedRows) return null;

    if (nextProps.selectedRows.length === 0) {
      return {
        selectedRowKeys: [],
      };
    }
    return null;
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

  onClickRow = record => {
    const { rowKey } = this.props;
    return {
      onClick: () => {
        this.setState({
          rowId: record[rowKey],
        });
      },
    };
  };

  setRowClassName = record => {
    const { rowId } = this.state;
    const { rowKey } = this.props;
    return record[rowKey] === rowId ? 'clickRowStyl' : '';
  };

  render() {
    const { data = {}, size, rowKey, scroll, ...rest } = this.props;
    let { rowSelection } = this.props;

    const { list = [], pagination } = data;
    const { selectedRowKeys, height } = this.state;
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
        ...rowSelection,
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
          // eslint-disable-next-line no-return-assign
          ref={c => (this.tabledom = c)}
          components={this.components}
          rowKey={rowKey || 'key'}
          dataSource={list}
          pagination={paginationProps}
          size={size || 'small'}
          onChange={this.handleTableChange}
          scroll={{ ...scroll, y: height }}
          {...rest}
          rowSelection={rowSelection}
          onRow={this.onClickRow}
          rowClassName={this.setRowClassName}
          columns={columns} //  columns={columns} 需放到  {...rest} 后，防止 columns 被覆盖
        />
      </div>
    );
  }
}

export default StandardTable;
