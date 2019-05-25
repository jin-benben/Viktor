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
    console.log(value);
    return (
      <Select
        value={value}
        placeholder="请选择"
        filterOption={false}
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
