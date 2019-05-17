import React from 'react';
import request from '@/utils/request';
import { Cascader } from 'antd';

class CategoryCascader extends React.Component {
  state = {
    options: [],
  };

  componentDidMount() {
    this.getCategory({ PCode: '0', Level: '1' });
  }

  getCategory = async ({ PCode, Level }) => {
    const response = await request('/MDM/TI_Z010/TI_Z01005', {
      method: 'POST',
      data: {
        Content: {
          PCode,
          Level,
        },
      },
    });
    if (response.Status !== 200) {
      return false;
    }
    this.setState({ options: response.Content.rows });
  };

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  loadData = selectedOptions => {
    console.log(selectedOptions);
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    this.getCategory({ PCode: targetOption.Code, Level: targetOption.Level + 1 });
    targetOption.loading = false;
    const { options } = this.state;
    targetOption.children = [...options];
    this.setState({ ...targetOption });
  };

  render() {
    const { options } = this.state;
    return (
      <Cascader
        options={options}
        fieldNames={{ label: 'Name', value: 'Code', children: 'children' }}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
      />
    );
  }
}

export default CategoryCascader;
