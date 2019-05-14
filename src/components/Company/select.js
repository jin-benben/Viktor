import React, { PureComponent } from 'react';
import request from '@/utils/request';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select.Option;

class Staffs extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchCompany = debounce(this.fetchCompany, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false,
  };

  fetchCompany = async value => {
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
        rows: 1000,
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
      data: [],
      fetching: false,
    });
  };

  render() {
    const { fetching, data, value } = this.state;
    return (
      <Select
        showSearch
        labelInValue
        value={value}
        placeholder="输入内容"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchCompany}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(d => (
          <Option key={d.Code}>{d.Name}</Option>
        ))}
      </Select>
    );
  }
}

export default Staffs;
