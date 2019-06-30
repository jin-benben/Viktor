/* eslint-disable no-script-url */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tree, Form, Input, message, Modal, Select, Popover, Divider, Button } from 'antd';
import router from 'umi/router';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import { formLayout, formItemLayout } from '@/utils/publicData';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const { Option } = Select;
const { TextArea } = Input;

const CreateForm = Form.create()(props => {
  const {
    form: { getFieldDecorator },
    form,
    formVals,
    modalVisible,
    handleModalVisible,
    handleSubmit,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSubmit({ ...formVals, ...fieldsValue });
    });
  };
  return (
    <Modal
      width={640}
      destroyOnClose
      title="部门编辑"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form {...formItemLayout}>
        {/* <FormItem key="FatherCode" {...formLayout} label="父级代码">
            {getFieldDecorator('FatherCode', {
              initialValue: formVals.FatherCode,
            })(<Input disabled />)}
          </FormItem> */}
        <FormItem key="Level" {...formLayout} label="层级">
          {getFieldDecorator('Level', {
            initialValue: formVals.Level,
          })(
            <Select placeholder="级别" disabled>
              <Option value={1}>一级</Option>
              <Option value={2}>二级</Option>
              <Option value={3}>三级</Option>
            </Select>
          )}
        </FormItem>
        <FormItem key="Type" {...formLayout} label="类型">
          {getFieldDecorator('Type', {
            initialValue: formVals.Type,
          })(
            <Select placeholder="类型">
              <Option value="1">交易公司</Option>
              <Option value="2">部门</Option>
            </Select>
          )}
        </FormItem>
        <FormItem key="Code" {...formLayout} label="部门ID">
          {getFieldDecorator('Code', {
            // rules: [{ required: true, message: '请输入部门ID！' }],
            initialValue: formVals.Code,
          })(<Input placeholder="请输入部门ID！" />)}
        </FormItem>
        <FormItem key="Name" {...formLayout} label="名称">
          {getFieldDecorator('Name', {
            //  rules: [{ required: true, message: '请输入名称！' }],
            initialValue: formVals.Name,
          })(<Input placeholder="请输入名称！" />)}
        </FormItem>
        <FormItem key="备注" {...formLayout} label="备注">
          {getFieldDecorator('Comment', {
            initialValue: formVals.Comment,
          })(<TextArea placeholder="请输入备注！" />)}
        </FormItem>
      </Form>
    </Modal>
  );
});
/* eslint react/no-multi-comp:0 */
@connect(({ organization, loading }) => ({
  organization,
  loading,
}))
@Form.create()
class Organization extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      method: 'A',
    };
  }

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
    if (method === 'A') {
      dispatch({
        type: 'organization/save',
        payload: {
          singleInfo: {
            ...fieldsValue,
          },
        },
      });
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
