import React, { PureComponent } from 'react';

import { Select } from 'antd';

const { Option } = Select;

class MDMCommonality extends PureComponent {
  state = {
    value: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      return {
        value: nextProps.initialValue,
        data: nextProps.data,
      };
    }
    return null;
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
