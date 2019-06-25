/* eslint-disable array-callback-return */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Switch, Card, Form, Button, message, Tree } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import StandardTable from '@/components/StandardTable';

function switchType(Type) {
  switch (Type) {
    case '1':
      return '节点';
    case '2':
      return 'Action';
    case '3':
      return '数据列';
    default:
      return '未知';
  }
}

const { TreeNode } = Tree;

/* eslint react/no-multi-comp:0 */
@connect(({ authoritySet, loading }) => ({
  authoritySet,
  loading: loading.models.rule,
}))
@Form.create()
class authorityGroup extends PureComponent {
  columns = [
    {
      title: '权限代码',
      dataIndex: 'PermissionCode',
    },
    {
      title: '权限名称',
      dataIndex: 'PermissionName',
    },
    {
      title: '权限类型',
      dataIndex: 'Type',
      render: text => <span>{switchType(text)}</span>,
    },
    {
      title: '权限',
      dataIndex: 'Permission',
      render: (text, record, index) => (
        <Switch
          checkedChildren="开"
          onChange={value => {
            this.permissionChange(value, record, index);
          }}
          unCheckedChildren="关"
          defaultChecked={record.Permission === 'Y'}
        />
      ),
    },
  ];

  state = {
    authorityList: [],
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.authoritySet.authorityList !== prevState.authorityList) {
      return {
        authorityList: nextProps.authoritySet.authorityList,
      };
    }
    return null;
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

  permissionChange = (value, record, index) => {
    const { authorityList } = this.state;
    // eslint-disable-next-line no-param-reassign
    record.Permission = value ? 'Y' : 'N';
    authorityList[index] = record;
    this.setState({ authorityList });
  };

  updateHandle = () => {
    // 更新主数据
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { authorityList } = this.state;
    dispatch({
      type: 'authoritySet/update',
      payload: {
        Content: {
          Code: query.Code,
          TI_Z01501: authorityList,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('更新成功');
        }
      },
    });
  };

  render() {
    const { expandedKeys, checkedKeys, authorityList } = this.state;
    const {
      authoritySet: { treeData },
    } = this.props;

    return (
      <Card bordered={false}>
        <StandardTable
          data={{ list: authorityList }}
          rowKey="PermissionCode"
          columns={this.columns}
        />
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
