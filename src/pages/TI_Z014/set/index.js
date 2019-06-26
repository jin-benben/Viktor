/* eslint-disable array-callback-return */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, message, Tree } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';

const { TreeNode } = Tree;

/* eslint react/no-multi-comp:0 */
@connect(({ authoritySet, loading }) => ({
  authoritySet,
  loading: loading.models.rule,
}))
class authorityGroup extends PureComponent {
  state = {
    checkedKeys: [],
    expandedKeys: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.getSingle();
    dispatch({
      type: 'authoritySet/fetchTree',
    });
  }

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

  getSingle() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.Code) {
      dispatch({
        type: 'authoritySet/fetch',
        payload: {
          Content: {
            Code: query.Code,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            const { PermissionCodeList } = response.Content;
            this.setState({
              expandedKeys: PermissionCodeList,
              checkedKeys: PermissionCodeList,
            });
          }
        },
      });
    }
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.Name} key={item.Code} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.Name} key={item.Code} dataRef={item} />;
    });

  updateHandle = () => {
    // 更新主数据
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { checkedKeys } = this.state;
    dispatch({
      type: 'authoritySet/update',
      payload: {
        Content: {
          Code: query.Code,
          PermissionCodeList: checkedKeys,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('更新成功');
          this.getSingle();
        }
      },
    });
  };

  render() {
    const { expandedKeys, checkedKeys } = this.state;
    const {
      authoritySet: { treeData },
    } = this.props;

    return (
      <Card bordered={false}>
        {treeData.length ? (
          <Tree
            onExpand={this.onExpand}
            className="trees"
            checkable
            expandedKeys={expandedKeys}
            autoExpandParent
            onCheck={this.onCheck}
            checkedKeys={checkedKeys}
            selectedKeys={checkedKeys}
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
        ) : null}
        <FooterToolbar>
          <Button onClick={this.updateHandle} type="primary">
            保存
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}

export default authorityGroup;
