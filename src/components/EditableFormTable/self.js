import React, { PureComponent } from 'react';
import { Table, Input, InputNumber, Form } from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends PureComponent {
  getInput = () => {
    const { inputType } = this.props;
    if (inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          console.log(form);
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    initialValue: record[dataIndex],
                  })(this.getInput(form))}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    const { data, columns } = props;
    this.state = { data, columns, editingKey: '' };
  }

  // eslint-disable-next-line react/destructuring-assignment
  isEditing = record => record.key === this.state.editingKey;

  onRowClick = (e, record) => {
    this.setState({ editingKey: record.key });
  };

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const { data } = this.state;
    let { columns } = this.state;
    const { form } = this.props;
    columns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: true, // this.isEditing(record)
        }),
      };
    });
    return (
      <EditableContext.Provider value={form}>
        <Table
          components={components}
          bordered
          dataSource={data}
          columns={columns}
          onRow={record => ({
            onClick: event => {
              this.onRowClick(event, record);
            }, // 点击行
          })}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
