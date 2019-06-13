import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { orderSourceType } from '@/utils/publicData';

const { Option } = Select;

class OrderSource extends PureComponent {
  state = {
    value: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialValue !== prevState.value) {
      return {
        value: nextProps.initialValue,
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
    const { value } = this.state;
    return (
      <Select
        showArrow={false}
        value={value}
        placeholder="请选择来源"
        filterOption={false}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {orderSourceType.map(option => (
          <Option key={option.Key} value={option.Key}>
            {option.Value}
          </Option>
        ))}
      </Select>
    );
  }
}

export default OrderSource;
