/* eslint-disable no-script-url */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tree, Row, Col, Form, Input, Modal, Popover, Divider } from 'antd';

const FormItem = Form.Item;
const { TreeNode } = Tree;
@Form.create()
class CreateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formVals: props.formVals,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.formVals !== prevState.formVals) {
      return {
        formVals: nextProps.formVals,
      };
    }
    return null;
  }

  render() {
    const {
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      handleSubmit,
    } = this.props;
    const { formVals } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 10 },
      },
    };

    return (
      <Modal
        width={640}
        destroyOnClose
        title="部门编辑"
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <FormItem key="Code" {...this.formLayout} label="部门ID">
            {getFieldDecorator('Code', {
              initialValue: formVals.Code,
            })(<Input disabled />)}
          </FormItem>
          <FormItem key="Name" {...this.formLayout} label="名称">
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: '请输入名称！' }],
              initialValue: formVals.Name,
            })(<Input placeholder="请输入名称！" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
/* eslint react/no-multi-comp:0 */
@connect(({ organization }) => ({
  organization,
}))
class Organization extends PureComponent {
  state = {
    modalVisible: false,
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
          {item.li_attr.Name}
        </Popover>
      );
      if (item.children) {
        return (
          <TreeNode title={popover} key={item.li_attr.Code} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={popover} key={item.li_attr.Code} dataRef={item} />;
    });

  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      this.handleAdd(fieldsValue);
    });
  };

  addOrg = tree => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/single',
      payload: {
        Content: {
          Code: tree.li_attr.Code,
        },
      },
    });
  };

  updateOrg = tree => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/single',
      payload: {
        Content: {
          Code: tree.li_attr.Code,
        },
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  creatNutton = tree => {
    console.log(tree);
    return (
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
  };

  render() {
    const {
      organization: { treeData, singleInfo },
    } = this.props;
    console.log(treeData, this.props);
    const { modalVisible } = this.state;
    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <div>
        <Card title="组织架构">
          {/* <Button
            icon="plus"
            style={{ marginLeft: 8, marginBottom: 28, marginTop: 28 }}
            type="primary"
            onClick={() => this.handleModalVisible(true)}
          >
            新建根节点
          </Button> */}

          <Row>
            <Col lg={12} md={12} sm={24}>
              <Tree defaultExpandAll>{this.renderTreeNodes(treeData)}</Tree>
            </Col>
          </Row>
          <CreateForm {...parentMethods} formVals={singleInfo} modalVisible={modalVisible} />
        </Card>
      </div>
    );
  }
}

export default Organization;
