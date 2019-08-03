import React, { Component } from 'react';
import { Input, AutoComplete } from 'antd';
import debounce from 'lodash/debounce';
import request from '@/utils/request';

const { Option } = AutoComplete;
const { TextArea } = Input;

class OrderAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = debounce(this.handleSearch, 1000);
    this.state = {
      dataSource: [],
      value: props.defaultValue,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.state;
    if ((!value && nextProps.defaultValue) || nextProps.defaultValue !== value) {
      this.setState({
        value: nextProps.defaultValue,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { value, dataSource } = this.state;
    if (nextState.value === value && nextState.dataSource === dataSource) {
      return false;
    }
    return true;
  }

  renderOption = item => {
    const { Type } = this.props;
    return (
      <Option key={item.Code} item={item} title={item[Type]}>
        {`${item[Type]}`}
      </Option>
    );
  };

  handleChange = (value, option) => {
    const { item } = option.props;
    const { onChage, parentSelect, Type } = this.props;
    this.setState({
      value: item ? item[Type] : value,
    });
    if (onChage) {
      if (item) {
        parentSelect(item);
      } else {
        onChage(value);
      }
    }
  };

  handleSearch = async SearchText => {
    const { BrandCode } = this.props;
    const response = await request('/MDM/TI_Z009/TI_Z00902', {
      method: 'POST',
      data: {
        Content: {
          SearchText,
          SearchKey: 'Name',
          BrandCode,
        },
        page: 1,
        rows: 30,
        sidx: 'Code',
        sord: 'Desc',
      },
    });
    if (response && response.Status === 200) {
      if (response.Content) {
        const { rows } = response.Content;
        this.setState({
          dataSource: [...rows],
        });
      } else {
        this.setState({
          dataSource: [],
        });
      }
    }
  };

  render() {
    const { dataSource, value } = this.state;
    console.log('ok', value);
    return (
      <AutoComplete
        className="global-search"
        size="large"
        style={{ width: '100%' }}
        value={value}
        defaultActiveFirstOption={false}
        dataSource={dataSource.map(this.renderOption)}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
      >
        <TextArea style={{ width: '100%', backgroundColor: '#fff' }} />
      </AutoComplete>
    );
  }
}

export default OrderAutoComplete;
