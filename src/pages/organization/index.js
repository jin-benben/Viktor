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
  Modal,
  Popover,
  Divider,
  Popconfirm,
} from 'antd';

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
@connect(({ organization, loading }) => ({
  organization,
  loading: loading.models.rule,
}))
class Organization extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {},
    treeData: [
      { Name: '上海亚仑', Code: '0', Level: 1, FatherCode: '' },
      { Name: '绍兴亚仑', Code: '1', Level: 1, FatherCode: '' },
    ],
  };

  onLoadData = treeNode =>
    new Promise(resolve => {
      const { treeData } = this.state;
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        // eslint-disable-next-line no-param-reassign
        treeNode.props.dataRef.children = [
          { Name: 'Child Node', Code: `${treeNode.props.eventKey}-0` },
          { Name: 'Child Node', Code: `${treeNode.props.eventKey}-1` },
        ];
        this.setState({
          treeData: [...treeData],
        });
        resolve();
      }, 1000);
    });

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

  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      this.handleAdd(fieldsValue);
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      formValues: {},
    });
  };

  creatNutton = tree => {
    console.log(tree);
    return (
      <Fragment>
        <a href="javascript:;">添加</a>
        <Divider type="vertical" />
        <a href="javascript:;">修改</a>
        <Divider type="vertical" />
        <Popconfirm title="确定要删除吗?" onConfirm={() => this.deleteCategory(tree.Code)}>
          <a href="javascript:;">删除</a>
        </Popconfirm>
      </Fragment>
    );
  };

  deleteCategory = Code => {
    console.log(Code);
  };

  render() {
    const { loading } = this.props;
    console.log(loading);
    const { modalVisible, formValues, treeData } = this.state;
    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <div>
        <Card>
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
              <Tree loadData={this.onLoadData}>{this.renderTreeNodes(treeData)}</Tree>
            </Col>
          </Row>
          <CreateForm {...parentMethods} formVals={formValues} modalVisible={modalVisible} />
        </Card>
      </div>
    );
  }
}

export default Organization;
