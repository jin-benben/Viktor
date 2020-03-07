import React, { PureComponent } from 'react';
import { Select, Spin, Empty } from 'antd';
import debounce from 'lodash/debounce';
import request from '@/utils/request';

const { Option } = Select;

class SalerPurchaser extends PureComponent {
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
        value: nextProps.initialValue,
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
      const { type } = this.props;
      const TypeKey = type || 'SlpCode';
      const select = data.find(item => item[TypeKey] === value);
      if (type) {
        onChange(select.Code);
      } else {
        onChange(select);
      }
    }
  };

  render() {
    const { fetching, data, value } = this.state;
    const { type } = this.props;
    const TypeKey = type || 'SlpCode';
    return (
      <Select
        showSearch
        showArrow={false}
        value={value}
        placeholder="输入名称"
        notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(option => (
          <Option key={option[TypeKey]} value={option[TypeKey]}>
            {option.SlpName}
          </Option>
        ))}
      </Select>
    );
  }
}

export default SalerPurchaser;
