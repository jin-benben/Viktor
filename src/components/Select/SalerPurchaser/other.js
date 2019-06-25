import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const { Option } = Select;
@connect(({ global }) => ({
  global,
}))
class SalerPurchaser extends PureComponent {
  state = {
    value: [],
  };

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
    const {
      global: { OSLPList },
    } = this.props;
    return (
      <Select
        showArrow={false}
        mode="multiple"
        value={value}
        placeholder="输入名称"
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {OSLPList.map(option => (
          <Option key={option.SlpCode} value={option.SlpCode}>
            {option.SlpName}
          </Option>
        ))}
      </Select>
    );
  }
}

export default SalerPurchaser;
