import React, { PureComponent } from 'react';

import { Select, Spin, Empty } from 'antd';

const { Option } = Select;

class LinkMan extends PureComponent {
  state = {
    value: [],
    fetching: false,
  };

  handleChange = (value, option) => {
    this.setState({
      value,
      fetching: false,
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const { fetching, value } = this.state;
    const { initialValue, data } = this.props;
    console.log(initialValue, this.props);
    return (
      <Select
        showSearch
        showArrow={false}
        value={value}
        defaultValue={initialValue}
        placeholder="输入名称"
        notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
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

export default LinkMan;
