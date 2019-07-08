import React, { PureComponent } from 'react';
import { Select, Spin, message, Empty } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import debounce from 'lodash/debounce';
import request from '@/utils/request';

const { Option } = Select;
@connect(({ global }) => ({
  global,
}))
class Staffs extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 1000);
    this.state = {
      data: [],
      value: { key: '', label: '' },
      fetching: false,
      initialValue: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.initialValue) {
      return {
        value: prevState.value,
      };
    }
    if (!prevState.initialValue) {
      return {
        value: nextProps.initialValue.key ? nextProps.initialValue : { key: '', label: '' },
        data: prevState.data.length ? prevState.data : nextProps.global.SupplierList,
      };
    }
    return null;
  }

  fetchUser = async value => {
    if (!value) return;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true, initialValue: true });
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
      initialValue: true,
    });
    const { onChange } = this.props;
    if (onChange) {
      if (value === undefined) {
        onChange({ key: '', label: '' });
      } else {
        onChange(value);
      }
    }
  };

  render() {
    const { fetching, data, value } = this.state;
    const { labelInValue } = this.props;

    return (
      <Select
        showSearch
        showArrow={false}
        allowClear
        labelInValue={labelInValue}
        value={value}
        placeholder="输入名称"
        notFoundContent={
          fetching ? (
            <Spin size="small" />
          ) : (
            <Empty style={{ width: '100%' }}>
              <Link target="_blank" to="/main/TI_Z007/add">
                去添加
              </Link>
            </Empty>
          )
        }
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
