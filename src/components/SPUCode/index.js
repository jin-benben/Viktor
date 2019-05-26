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

  componentDidMount() {
    this.fetchUser();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialValue !== prevState.value) {
      return {
        value: nextProps.initialValue,
      };
    }
    return null;
  }

  fetchUser = async value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    const response = await request('/MDM/TI_Z011/TI_Z01102', {
      method: 'POST',
      data: {
        Content: {
          SearchText: value,
          SearchKey: 'Name',
        },
        page: 1,
        rows: 100,
        sidx: 'Code',
        sord: 'DESC',
      },
    });
    this.setState({ fetching: false });
    if (response.Status !== 200 || fetchId !== this.lastFetchId) {
      return;
    }

    this.setState({ data: response.Content ? response.Content.rows : [], fetching: false });
  };

  handleChange = value => {
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
          <Option key={option.Code} value={option.Code}>
            {option.Name}
          </Option>
        ))}
      </Select>
    );
  }
}

export default Brand;
