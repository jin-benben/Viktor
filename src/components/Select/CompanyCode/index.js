import React, { PureComponent } from 'react';
import request from '@/utils/request';
import { Select, Spin, message, Empty } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

class CompanyCode extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 1000);
    this.state = {
      data: [],
      value: props.value,
      fetching: false,
    };
  }

  fetchUser = async value => {
    if (!value) return;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    const response = await request('/MDM/TI_Z007/TI_Z00702', {
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
    if (!response.Content || !response.Content.rows.length) {
      message.warn('暂无匹配');
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
    const { initialValue, labelInValue } = this.props;

    console.log(initialValue);
    return (
      <Select
        showSearch
        showArrow={false}
        labelInValue={labelInValue}
        value={value}
        defaultValue={initialValue}
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

export default CompanyCode;