import React, { PureComponent } from 'react';
import request from '@/utils/request';
import { Select, Spin, Empty } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

class Staffs extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 1000);
  }

  state = {
    data: [],
    fetching: false,
    initialValue: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.initialValue && nextProps.initialValue !== prevState.initialValue) {
      return {
        initialValue: nextProps.initialValue,
      };
    }
    return null;
  }

  fetchUser = async value => {
    if (!value) return;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    const response = await request('/MDM/TI_Z004/TI_Z00402', {
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
    console.log(value);
    this.setState({
      fetching: false,
      initialValue: value,
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const { fetching, data, initialValue } = this.state;
    const { labelInValue } = this.props;
    console.log(initialValue);
    return (
      <Select
        showSearch
        showArrow={false}
        labelInValue={labelInValue}
        value={initialValue}
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

export default Staffs;
