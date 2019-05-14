import React, { PureComponent } from 'react';
import { Input, Form, InputNumber, DatePicker } from 'antd';

const EditableContext = React.createContext();
const FormItem = Form.Item;
class EditableCell extends PureComponent {
  getInput = () => {
    const { inputType } = this.props;
    if (inputType === 'number') {
      return <InputNumber />;
    }
    if (inputType === 'date') {
      return <DatePicker />;
    }
    return <Input />;
  };

  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    console.log(this.props);
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;

          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    initialValue: record[dataIndex],
                  })(this.getInput())}
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

export default EditableCell;
