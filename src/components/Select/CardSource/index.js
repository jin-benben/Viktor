import React, { PureComponent } from 'react';

import { Select } from 'antd';

const { Option } = Select;

class CardSource extends PureComponent {
  data = [
    {
      Code: '1',
      Name: '线下',
    },
    {
      Code: '2',
      Name: '网站',
    },
    {
      Code: '3',
      Name: '其他来源',
    },
  ];

  state = {
    value: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.value) {
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
        value={value}
        placeholder="请选择客户来源"
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {this.data.map(option => (
          <Option key={option.Code} value={option.Code}>
            {option.Name}
          </Option>
        ))}
      </Select>
    );
  }
}

export default CardSource;
