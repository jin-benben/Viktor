import React, { PureComponent } from 'react';

import { Select, Spin, Empty } from 'antd';

const { Option } = Select;

class LinkMan extends PureComponent {
  state = {
    value: '',
    data: [],
    fetching: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps.data, nextProps.initialValue, prevState.value);
    if (nextProps.data !== prevState.data) {
      console.log(nextProps.data);
      return {
        initialValue: nextProps.initialValue,
        data: nextProps.data,
      };
    }
    return null;
  }

  handleChange = value => {
    this.setState({
      value,
      fetching: false,
    });
    const { onChange } = this.props;
    const { data } = this.state;
    console.log(value);
    if (onChange) {
      const select = data.find(item => {
        return item.Name === value;
      });
      console.log(select);
      onChange(select);
    }
  };

  render() {
    const { fetching, value, data } = this.state;
    return (
      <Select
        value={value}
        placeholder="请选择联系人"
        notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
        filterOption={false}
        onSelect={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(option => (
          <Option key={option.UserID} value={option.Name}>
            {option.Name}
          </Option>
        ))}
      </Select>
    );
  }
}

export default LinkMan;
