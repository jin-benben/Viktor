/* eslint-disable no-script-url */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tree, Row, Col, Form, Input, message, Modal, Select, Popover, Divider } from 'antd';

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
  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
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
            rules: [{ required: true, message: '请输入部门ID！' }],
            initialValue: formVals.Code,
          })(<Input placeholder="请输入部门ID！" />)}
        </FormItem>
        <FormItem key="Name" {...formLayout} label="名称">
          {getFieldDecorator('Name', {
            rules: [{ required: true, message: '请输入名称！' }],
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
        type: 'organization/add',
        payload: {
          Content: {
            ...fieldsValue,
          },
        },
        callback: response => {
          if (response.Status === 200) {
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
          if (response.Status === 200) {
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

  addOrg = tree => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/single',
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
      type: 'organization/single',
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
      organization: { treeData },
    } = this.props;
    let {
      organization: { singleInfo },
    } = this.props;
    const { modalVisible, method } = this.state;
    if (method === 'A') {
      singleInfo = {
        ...singleInfo,
        Code: '',
        Name: '',
        Comment: '',
        FatherCode: singleInfo.Code,
        Level: singleInfo.Level + 1,
      };
    }
    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <div>
        <Card bordered={false}>
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
              <Tree className="trees">{this.renderTreeNodes(treeData)}</Tree>
            </Col>
          </Row>
          {<CreateForm {...parentMethods} formVals={singleInfo} modalVisible={modalVisible} />}
        </Card>
      </div>
    );
  }
}

export default Organization;
