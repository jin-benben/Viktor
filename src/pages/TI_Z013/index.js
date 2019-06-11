/* eslint-disable no-script-url */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Tree,
  Row,
  Col,
  Form,
  Input,
  Button,
  message,
  Modal,
  Select,
  Popover,
  Divider,
} from 'antd';
import { formLayout, formItemLayout } from '@/utils/publicData';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = Tree;
const { Option } = Select;
@Form.create()
class CreateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        Code: '',
        Name: '',
        PCode: '',
        Level: 1,
        Type: '',
        Action: '',
        Method: '',
      },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.formVals !== prevState.formVals) {
      let option;
      if (nextProps.method === 'A') {
        option = {
          Code: '',
          Name: '',
          PCode: nextProps.formVals.Code,
          Level: nextProps.formVals.Level + 1,
          Type: '',
          Action: '',
          Method: '',
        };
      }
      return {
        formVals: { ...nextProps.formVals, ...option },
      };
    }
    return null;
  }

  render() {
    const {
      form: { getFieldDecorator },
      form,
      modalVisible,
      method,
      handleModalVisible,
      handleSubmit,
    } = this.props;
    const { formVals } = this.state;
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
        title="权限编辑"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <FormItem key="PCode" {...formLayout} label="父级代码">
            {getFieldDecorator('PCode', {
              initialValue: formVals.PCode,
            })(<Input disabled />)}
          </FormItem>
          <FormItem key="Level" {...formLayout} label="级别">
            {getFieldDecorator('Level', {
              initialValue: formVals.Level,
            })(<Input disabled />)}
          </FormItem>
          <FormItem key="Code" {...formLayout} label="权限ID">
            {getFieldDecorator('Code', {
              initialValue: formVals.Code,
            })(<Input disabled={method === 'U'} />)}
          </FormItem>
          <FormItem key="Name" {...formLayout} label="权限名称">
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: '请输入权限名称！' }],
              initialValue: formVals.Name,
            })(<Input placeholder="请输入权限名称！" />)}
          </FormItem>
          <FormItem key="Type" {...formLayout} label="权限类型">
            {getFieldDecorator('Type', {
              initialValue: formVals.Type,
            })(
              <Select placeholder="请选择权限类别">
                <Option value="1">节点</Option>
                <Option value="2">Action</Option>
                <Option value="3">数据列</Option>
              </Select>
            )}
          </FormItem>
          <FormItem key="Method" {...formLayout} label="方法">
            {getFieldDecorator('Method', {
              initialValue: formVals.Method,
            })(
              <Select placeholder="请选择方法">
                <Option value="A">添加</Option>
                <Option value="U">更新</Option>
                <Option value="D">删除</Option>
                <Option value="Q">查询</Option>
                <Option value="C">自定义</Option>
              </Select>
            )}
          </FormItem>
          <FormItem key="Action" {...formLayout} label="Action">
            {getFieldDecorator('Action', {
              initialValue: formVals.Action,
            })(<TextArea placeholder="请输入Action" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
/* eslint react/no-multi-comp:0 */
@connect(({ authority, loading }) => ({
  authority,
  loading,
}))
@Form.create()
class Organization extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      method: 'A',
      singleInfo: {
        Code: '',
        Name: '',
        PCode: '',
        Level: 1,
        Type: '',
        Action: '',
        Method: '',
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/fetch',
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.authority.singleInfo !== prevState.singleInfo) {
      return {
        singleInfo: nextProps.authority.singleInfo,
      };
    }
    return null;
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
        type: 'authority/add',
        payload: {
          Content: {
            ...fieldsValue,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            this.handleModalVisible(false);
            message.success('添加成功');
            dispatch({
              type: 'authority/fetch',
            });
          }
        },
      });
    } else {
      dispatch({
        type: 'authority/update',
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
              type: 'authority/fetch',
            });
          }
        },
      });
    }
  };

  addOrg = tree => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/single',
      payload: {
        Content: {
          Code: tree.Code,
        },
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
      type: 'authority/single',
      payload: {
        Content: {
          Code: tree.Code,
        },
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
      method: 'A',
      singleInfo: {
        Code: '',
        Name: '',
        PCode: '',
        Level: 0,
        Type: '',
        Action: '',
        Method: '',
      },
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
    </Fragment>
  );

  render() {
    const {
      authority: { treeData },
    } = this.props;
    const { modalVisible, method, singleInfo } = this.state;

    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <div>
        <Card bordered={false}>
          <Button
            icon="plus"
            style={{ marginLeft: 8, marginBottom: 28, marginTop: 28 }}
            type="primary"
            onClick={() => this.handleModalVisible(true)}
          >
            新建根节点
          </Button>

          <Row>
            <Col lg={12} md={12} sm={24}>
              <Tree className="trees" defaultExpandAll>
                {this.renderTreeNodes(treeData)}
              </Tree>
            </Col>
          </Row>
          {
            <CreateForm
              {...parentMethods}
              method={method}
              formVals={singleInfo}
              modalVisible={modalVisible}
            />
          }
        </Card>
      </div>
    );
  }
}

export default Organization;
