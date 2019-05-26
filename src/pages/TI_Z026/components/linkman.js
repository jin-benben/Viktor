import React, { PureComponent } from 'react';

import { Select, Spin, Empty } from 'antd';

const { Option } = Select;

class LinkMan extends PureComponent {
  state = {
    initialValue: '',
    fetching: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialValue !== prevState.initialValue) {
      return {
        initialValue: nextProps.initialValue,
      };
    }
    return null;
  }

  handleChange = initialValue => {
    this.setState({
      initialValue,
      fetching: false,
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(initialValue);
    }
  };

  render() {
    const { fetching, initialValue } = this.state;
    const { data } = this.props;
    return (
      <Select
        showArrow={false}
        value={initialValue}
        defaultValue={initialValue}
        placeholder="请选择联系人"
        notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
        filterOption={false}
        onSelect={this.handleChange}
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
