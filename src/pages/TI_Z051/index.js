/* eslint-disable no-script-url */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Modal, Button, message, Popconfirm } from 'antd';
import StandardTable from '@/components/StandardTable';

import { validatorEmail } from '@/utils/utils';

const FormItem = Form.Item;

@Form.create()
class CreateForm extends PureComponent {
  okHandle = () => {
    const { form, formVals, handleSubmit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSubmit({ ...formVals, ...fieldsValue });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      formVals,
      modalVisible,
      handleModalVisible,
    } = this.props;
    const formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
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
    return (
      <Modal
        width={640}
        destroyOnClose
        title="邮箱编辑"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <Row>
            <FormItem key="Code" {...formLayout} label="邮箱">
              {getFieldDecorator('Code', {
                rules: [{ validator: validatorEmail, required: true, message: '请输入邮箱！' }],
                initialValue: formVals.Code,
              })(<Input placeholder="请输入邮箱" />)}
            </FormItem>
          </Row>
          <Row>
            <FormItem key="EmailPassword" {...formLayout} label="邮箱密码">
              {getFieldDecorator('EmailPassword', {
                rules: [{ required: true, message: '请输入邮箱密码！' }],
                initialValue: formVals.EmailPassword,
              })(<Input placeholder="请输入邮箱" />)}
            </FormItem>
          </Row>
        </Form>
      </Modal>
    );
  }
}
/* eslint react/no-multi-comp:0 */
@connect(({ email, loading }) => ({
  email,
  loading: loading.models.email,
}))
@Form.create()
class Emails extends PureComponent {
  state = {
    modalVisible: false,
    method: 'A',
    formValues: {
      Code: '',
      EmailPassword: '',
    },
    queryData: {
      Content: {
        Department: '',
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
      sidx: 'Code',
      sord: 'Desc',
    },
  };

  columns = [
    {
      title: '邮箱',
      width: 100,
      dataIndex: 'Code',
    },
    {
      title: '密码',
      width: 100,
      dataIndex: 'EmailPassword',
    },

    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record.Code)}>
          <a href="javascript:;">删除</a>
        </Popconfirm>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'email/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  // 删除邮箱
  handleDelete = Code => {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'email/remove',
      payload: {
        Content: {
          Code,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('删除成功');
          dispatch({
            type: 'email/fetch',
            payload: {
              ...queryData,
            },
          });
        }
      },
    });
  };

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'email/fetch',
      payload: {
        ...queryData,
        page: pagination.current,
        rows: pagination.pageSize,
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { queryData } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'email/fetch',
        payload: {
          Content: {
            ...queryData.Content,
            ...fieldsValue,
          },
          page: 1,
          rows: 30,
          sidx: 'Code',
          sord: 'Desc',
        },
      });
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      method: 'U',
      formValues: record,
    });
  };

  handleSubmit = fieldsValue => {
    const { dispatch } = this.props;
    const { method, queryData } = this.state;
    if (method === 'A') {
      dispatch({
        type: 'email/add',
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
              type: 'email/fetch',
              payload: {
                ...queryData,
              },
            });
          }
        },
      });
    } else {
      dispatch({
        type: 'email/update',
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
              type: 'email/fetch',
              payload: {
                ...queryData,
              },
            });
          }
        },
      });
    }
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      method: 'A',
      formValues: {},
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                icon="plus"
                style={{ marginLeft: 8 }}
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              >
                新建
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      email: { emailList, pagination },
      loading,
    } = this.props;
    const { modalVisible, formValues } = this.state;
    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: emailList }}
              rowKey="Code"
              pagination={pagination}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} formVals={formValues} modalVisible={modalVisible} />
      </Fragment>
    );
  }
}

export default Emails;
