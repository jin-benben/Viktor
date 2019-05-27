import React from 'react';
import request from '@/utils/request';
import { Cascader } from 'antd';

class CategoryCascader extends React.Component {
  state = {
    options: [],
    value: [],
  };

  componentDidMount() {
    this.getCategory();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialValue !== prevState.value) {
      return {
        value: nextProps.initialValue,
      };
    }
    return null;
  }

  // eslint-disable-next-line consistent-return
  getCategory = async () => {
    const response = await request('/MDM/TI_Z010/TI_Z01002', {
      method: 'POST',
      data: {
        Content: {},
      },
    });
    if (response.Status !== 200) {
      return false;
    }
    this.setState({ options: response.Content });
  };

  handleChange = (value, selectedOptions) => {
    const { onChange } = this.props;
    this.setState({ value });
    let category;
    if (selectedOptions.length === 3) {
      category = {
        Cate1Name: selectedOptions[0].Name,
        Cate2Name: selectedOptions[1].Name,
        Cate3Name: selectedOptions[2].Name,
        Category1: selectedOptions[0].Code,
        Category2: selectedOptions[1].Code,
        Category3: selectedOptions[2].Code,
      };
    }
    if (onChange) {
      onChange(category);
    }
  };

  render() {
    const { options, value } = this.state;

    return (
      <Cascader
        options={options}
        value={value}
        style={{ width: '100%' }}
        placeholder="请选择分类"
        fieldNames={{ label: 'Name', value: 'Code', children: 'children' }}
        onChange={this.handleChange}
        expandTrigger="hover"
      />
    );
  }
}

export default CategoryCascader;
