import React, { PureComponent } from 'react';
import { Select, Spin, Empty } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import request from '@/utils/request';

const { Option } = Select;

@connect(({ global }) => ({
  global,
}))
class Brands extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 1000);
    this.state = {
      data: [],
      value: '',
      fetching: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.value || nextProps.initialValue !== prevState.value) {
      return {
        value: nextProps.initialValue,
        data: prevState.data.length ? prevState.data : nextProps.global.BrandList,
      };
    }
    return null;
  }

  fetchUser = async value => {
    if (!value && this.lastFetchId !== 0) return;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    const response = await request('/MDM/TI_Z005/TI_Z00502', {
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
    const { labelInValue, keyType } = this.props;
    const attribute = keyType || 'Code';
    return (
      <Select
        showSearch
        showArrow={false}
        labelInValue={labelInValue}
        value={value}
        placeholder="输入名称"
        notFoundContent={fetching ? <Spin size="small" /> : <Empty style={{ width: '100%' }} />}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(option => (
          <Option key={option.Code} value={option[attribute]}>
            <Ellipsis tooltip lines={1}>
              {option.Name}
            </Ellipsis>
          </Option>
        ))}
      </Select>
    );
  }
}

export default Brands;
