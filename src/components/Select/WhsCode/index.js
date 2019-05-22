import React, { PureComponent } from 'react';
import request from '@/utils/request';
import { Select, message, Empty } from 'antd';

const { Option } = Select;

class CompanyCode extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      data: [
        {
          Name: '正常仓',
          Code: 'W0001',
        },
        {
          Name: '虚拟仓',
          Code: 'W0002',
        },
      ],
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
    const { defaultValue } = this.props;
    return (
      <Select
        showArrow={false}
        value={value}
        defaultValue={defaultValue}
        placeholder="请选择仓库"
        filterOption={false}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(option => (
          <Option key={option.Code} value={option.Code}>
            {option.Name}
          </Option>
        ))}
      </Select>
    );
  }
}

export default CompanyCode;
