import React, { PureComponent } from 'react';
import { Table, Input, Select, DatePicker, Form } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
class EditableCell extends PureComponent {
  getInput = (dataIndex, record) => {
    const { inputType } = this.props;
    switch (inputType) {
      case 'date':
        return (
          <DatePicker
            onChange={(date, dateString) => this.dateChange(dateString, dataIndex, record)}
          />
        );
      case 'textArea':
        return <TextArea onChange={e => this.dateChange(e, dataIndex, record)} />;
      case 'select':
        return (
          <Select
            value={record[dataIndex]}
            style={{ width: 120 }}
            onChange={value => this.selectChange(value, dataIndex, record)}
          >
            {record.selectList.map(item => (
              <Option value={item.value}>{item.lable}</Option>
            ))}
          </Select>
        );
      default:
        return (
          <Input onChange={e => this.InputChange(e, dataIndex, record)} value={record[dataIndex]} />
        );
    }
  };

  dateChange = (dateString, dataIndex, record) => {
    Object.assign(record, { [dataIndex]: dateString });
    this.updateRow(record);
  };

  selectChange = (value, dataIndex, record) => {
    Object.assign(record, { [dataIndex]: value });
    this.updateRow(record);
  };

  InputChange = (e, dataIndex, record) => {
    Object.assign(record, { [dataIndex]: e.target.value });
    this.updateRow(record);
  };

  updateRow = record => {
    const { rowChange } = this.props;
    rowChange(record);
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      rowChange,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? this.getInput(dataIndex, record, index) : restProps.children}
      </td>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
class EditableTable extends React.Component {
  // eslint-disable-next-line react/destructuring-assignment

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    const { data, rowChange, rowKey, ...rest } = this.props;

    let { columns } = this.props;
    columns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          data,
          rowChange,
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: col.editable, // this.isEditing(record)
        }),
      };
    });
    return (
      <Table
        components={components}
        rowKey={rowKey || 'key'}
        bordered
        size="middle"
        dataSource={data}
        {...rest}
        columns={columns}
      />
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
