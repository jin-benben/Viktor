import React from 'react';
import request from '@/utils/request';
import { Cascader } from 'antd';

class CategoryCascader extends React.Component {
  state = {
    options: [],
  };

  componentDidMount() {
    this.getCategory();
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

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  render() {
    const { options } = this.state;
    return (
      <Cascader
        options={options}
        fieldNames={{ label: 'Name', value: 'Code', children: 'children' }}
        onChange={this.onChange}
        expandTrigger="hover"
      />
    );
  }
}

export default CategoryCascader;
