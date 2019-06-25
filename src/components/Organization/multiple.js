import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { TreeSelect } from 'antd';
import request from '@/utils/request';

const { TreeNode } = TreeSelect;
@connect(({ global }) => ({
  global,
}))
class Organization extends PureComponent {
  state = {
    treeData: [],
    checkedKeys: [],
    expandedKeys: [],
    hasLoad: false,
  };

  componentDidMount() {
    this.getTreeData();
  }

  static getDerivedStateFromProps(nextProps, proState) {
    if (nextProps.global.hasLoad && !proState.hasLoad) {
      const {
        global: { DepartmentList },
      } = nextProps;
      return {
        expandedKeys: DepartmentList,
        hasLoad: true,
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

  // 点击树形节点时
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
    });
  };

  // 树形check时
  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        const {
          global: { NoPermissionDepartmentList },
        } = this.props;
        const selectable = NoPermissionDepartmentList.includes(item.Code);
        return (
          <TreeNode
            title={item.Name}
            value={item.Code}
            key={item.Code}
            disableCheckbox={selectable}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.Name} value={item.Code} key={item.Code} />;
    });

  render() {
    const { treeData, expandedKeys, checkedKeys } = this.state;
    return (
      <div>
        {treeData.length ? (
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择部门"
            onTreeExpand={this.onExpand}
            className="trees"
            treeCheckable
            treeExpandedKeys={expandedKeys}
            autoExpandParent
            onChange={this.onCheck}
            value={checkedKeys}
          >
            {this.renderTreeNodes(treeData)}
          </TreeSelect>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default Organization;
