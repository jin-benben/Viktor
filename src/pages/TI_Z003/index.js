/* eslint-disable no-script-url */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tree, message, Popover, Divider, Button } from 'antd';
import router from 'umi/router';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import CreateForm from './components';

const { TreeNode } = Tree;

@connect(({ organization, loading }) => ({
  organization,
  loading,
}))
class Organization extends PureComponent {
  state = {
    modalVisible: false,
    method: 'A',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/fetch',
    });
  }

  renderTreeNodes = data =>
    data.map(item => {
      const popover = (
        <Popover placement="right" content={this.creatNutton(item)} trigger="click">
          {item.Name}
        </Popover>
      );
      if (item.children) {
        return (
          <TreeNode title={popover} key={item.Code} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={popover} key={item.Code} dataRef={item} />;
    });

  handleSubmit = fieldsValue => {
    const { dispatch } = this.props;
    const { method } = this.state;
    dispatch({
      type: 'organization/save',
      payload: {
        singleInfo: {
          ...fieldsValue,
        },
      },
    });
    if (method === 'A') {
      dispatch({
        type: 'organization/add',
        payload: {
          Content: {
            ...fieldsValue,
            DDCode: 0,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            this.handleModalVisible(false);
            message.success('添加成功');
            dispatch({
              type: 'organization/fetch',
            });
          }
        },
      });
    } else {
      dispatch({
        type: 'organization/update',
        payload: {
          Content: {
            ...fieldsValue,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            this.handleModalVisible(false);
            message.success('更新成功');
            dispatch({
              type: 'organization/fetch',
            });
          }
        },
      });
    }
  };

  reloadLocal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/reload',
      callback: response => {
        if (response && response.Status === 200) {
          message.success('刷新成功');
        }
      },
    });
  };

  addOrg = tree => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/single',
      payload: {
        Content: {
          Code: tree.Code,
        },
        method: 'A',
      },
    });
    this.setState({
      modalVisible: true,
      method: 'A',
    });
  };

  updateOrg = tree => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/single',
      payload: {
        Content: {
          Code: tree.Code,
        },
        method: 'U',
      },
    });
    this.setState({
      modalVisible: true,
      method: 'U',
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  creatNutton = tree => (
    <Fragment>
      <a href="javascript:;" onClick={() => this.addOrg(tree)}>
        添加
      </a>
      <Divider type="vertical" />
      <a href="javascript:;" onClick={() => this.updateOrg(tree)}>
        修改
      </a>
      <Divider type="vertical" />
      <a href="javascript:;" onClick={() => router.push(`/base/TI_Z004?Department=${tree.Code}`)}>
        员工
      </a>
    </Fragment>
  );

  render() {
    const {
      organization: { treeData },
    } = this.props;
    const {
      organization: { singleInfo },
    } = this.props;
    const { modalVisible } = this.state;

    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <div>
        <Card bordered={false}>
          {treeData.length ? (
            <Tree defaultExpandAll className="trees">
              {this.renderTreeNodes(treeData)}
            </Tree>
          ) : null}
          <CreateForm {...parentMethods} formVals={singleInfo} modalVisible={modalVisible} />
        </Card>
        <FooterToolbar>
          <Button type="primary" onClick={this.reloadLocal}>
            刷新缓存
          </Button>
        </FooterToolbar>
      </div>
    );
  }
}

export default Organization;
