import React, { PureComponent } from 'react';
import request from '@/utils/request';
import { Select, Spin, Empty } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

class Brand extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 1000);
  }

  state = {
    data: [],
    value: '',
    fetching: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      (!prevState.value && nextProps.initialValue !== prevState.value) ||
      !prevState.data.length
    ) {
      return {
        value: Number(nextProps.initialValue),
        data: nextProps.data,
      };
    }
    return null;
  }

  fetchUser = async value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    const response = await request('/MDM/ERPSelect/OSLP', {
      method: 'POST',
      data: {
        Content: {
          SlpName: value,
        },
      },
    });
    this.setState({ fetching: false });
    if (response.Status !== 200 || fetchId !== this.lastFetchId) {
      return;
    }

    this.setState({ data: response.Content ? response.Content.OSLP : [], fetching: false });
  };

  handleChange = value => {
    this.setState({
      value,
      fetching: false,
    });
    const { onChange } = this.props;

    if (onChange) {
      const { data } = this.state;
      const select = data.find(item => item.SlpCode === value);
      onChange(select);
    }
  };

  render() {
    const { fetching, data, value } = this.state;
    return (
      <Select
        showSearch
        showArrow={false}
        value={value}
        placeholder="输入名称"
        notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(option => (
          <Option key={option.SlpCode} value={option.SlpCode}>
            {option.SlpName}
          </Option>
        ))}
      </Select>
    );
  }
}

export default Brand;
