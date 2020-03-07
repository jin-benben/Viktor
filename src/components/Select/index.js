import React, { PureComponent } from 'react';

import { Select } from 'antd';

const { Option } = Select;

class MDMCommonality extends PureComponent {
  state = {
    value: '',
    data: [],
  };

  static getDerivedStateFromProps(nextProps, preState) {
    const initialValue = nextProps.initialValue ? nextProps.initialValue.toString() : '';
    return {
      data: nextProps.data,
      value: preState.value || initialValue,
    };
  }

  handleChange = value => {
    this.setState({
      value,
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

 

  render() {
    const { value, data } = this.state;
    const { placeholder } = this.props;
    return (
      <Select
        value={value}
        showSearch
        placeholder={`请选择${placeholder}`}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(option => (
          <Option key={option.Key} value={option.Key}>
            {option.Value}
          </Option>
        ))}
      </Select>
    );
  }
}

export default MDMCommonality;
