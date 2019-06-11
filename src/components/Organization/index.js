import React, { PureComponent } from 'react';
import request from '@/utils/request';
import { TreeSelect } from 'antd';

const { TreeNode } = TreeSelect;
class Organization extends PureComponent {
  state = {
    treeData: [],
    value: '',
  };

  componentDidMount() {
    this.getTreeData();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.value && nextProps.initialValue !== prevState.value) {
      return {
        value: nextProps.initialValue,
      };
    }
    return null;
  }

  // eslint-disable-next-line consistent-return
  getTreeData = async () => {
    const response = await request('/MDM/TI_Z003/TI_Z00302', {
      method: 'POST',
      data: {
        Content: {},
      },
    });
    if (response.Status !== 200) {
      return false;
    }
    this.setState({ treeData: response.Content });
  };

  handleChange = value => {
    const { onChange } = this.props;
    this.setState({ value });
    if (onChange) {
      onChange(value);
    }
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.Name} value={item.Code} key={item.Code}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.Name} value={item.Code} key={item.Code} />;
    });

  render() {
    const { treeData, value } = this.state;
    return (
      <TreeSelect
        style={{ width: '100%' }}
        value={value}
        allowClear
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择部门"
        treeDefaultExpandAll
        onChange={this.handleChange}
      >
        {this.renderTreeNodes(treeData)}
      </TreeSelect>
    );
  }
}

export default Organization;
