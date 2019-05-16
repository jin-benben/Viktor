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
  Upload,
  Button,
  message,
  Switch,
  Icon,
  Modal,
  Select,
  Popover,
  Divider,
} from 'antd';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const { Option } = Select;
@Form.create()
class CreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PicturePath: props.PicturePath,
      PicCode: props.PicCode,
      Status: props.Status ? '1' : '2',
    };
  }

  switchChange = Status => {
    this.setState({ Status });
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.response.Status === 200) {
      const { FilePath, FileCode } = info.file.response;
      this.setState({
        PicturePath: FilePath,
        PicCode: FileCode,
      });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      form,
      formVals,
      modalVisible,
      handleModalVisible,
      handleSubmit,
    } = this.props;
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
        handleSubmit({ ...formVals, ...fieldsValue, ...this.state });
      });
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { PicturePath, Status } = this.state;
    return (
      <Modal
        width={640}
        destroyOnClose
        title="分离编辑"
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
          <FormItem key="Code" {...formLayout} label="分类ID">
            {getFieldDecorator('Code', {
              rules: [{ required: true, message: '请输入分类ID！' }],
              initialValue: formVals.Code,
            })(<Input placeholder="请输入分类ID！" />)}
          </FormItem>
          <FormItem key="Name" {...formLayout} label="名称">
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: '请输入名称！' }],
              initialValue: formVals.Name,
            })(<Input placeholder="请输入名称！" />)}
          </FormItem>
          <FormItem key="Status" {...formLayout} label="状态">
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              defaultChecked={formVals.Status === '1'}
              onChange={this.switchChange}
              checked={Status}
            />
          </FormItem>
          <FormItem key="PicturePath" {...formLayout} label="分类图片">
            <Upload
              action="http://117.149.160.231:9301/MDMPicUpload/PictureUpLoad"
              listType="picture-card"
              showUploadList={false}
              onChange={this.handleChange}
              data={{ UserCode: 'jinwentao', Folder: 'TI_Z026', Tonken: '22233' }}
            >
              {PicturePath ? (
                <img style={{ width: 80, height: 80 }} src={PicturePath} alt="avatar" />
              ) : (
                uploadButton
              )}
            </Upload>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
/* eslint react/no-multi-comp:0 */
@connect(({ category, loading }) => ({
  category,
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
      type: 'category/fetch',
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

  handleSubmit = fieldsValue => {
    const { dispatch } = this.props;
    const { method } = this.state;
    if (method === 'A') {
      dispatch({
        type: 'category/add',
        payload: {
          Content: {
            ...fieldsValue,
            Status: fieldsValue.Status ? '1' : '2',
          },
        },
        callback: response => {
          if (response.Status === 200) {
            this.handleModalVisible(false);
            message.success('添加成功');
            dispatch({
              type: 'category/fetch',
            });
          }
        },
      });
    } else {
      dispatch({
        type: 'category/update',
        payload: {
          Content: {
            ...fieldsValue,
            Status: fieldsValue.Status ? '1' : '2',
          },
        },
        callback: response => {
          if (response.Status === 200) {
            this.handleModalVisible(false);
            message.success('更新成功');
            dispatch({
              type: 'category/fetch',
            });
          }
        },
      });
    }
  };

  addOrg = tree => {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/single',
      payload: {
        Content: {
          Code: tree.li_attr.Code,
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
      type: 'category/single',
      payload: {
        Content: {
          Code: tree.li_attr.Code,
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
      category: { treeData },
    } = this.props;
    let {
      category: { singleInfo },
    } = this.props;
    const { modalVisible, method } = this.state;
    if (method === 'A') {
      singleInfo = {
        ...singleInfo,
        Code: '',
        Name: '',
        PicturePath: '',
        PicCode: '',
        Comment: '',
        Status: '1',
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
        <Card title="分类管理">
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
          {<CreateForm {...parentMethods} formVals={singleInfo} modalVisible={modalVisible} />}
        </Card>
      </div>
    );
  }
}

export default Organization;
