/* eslint-disable no-script-url */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Modal, Button, Divider, Popconfirm, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import MyIcon from '@/components/MyIcon';
import { formItemLayout, formLayout } from '@/utils/publicData';

const FormItem = Form.Item;
const { TextArea } = Input;

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
      method,
    } = this.props;

    return (
      <Modal
        width={640}
        destroyOnClose
        maskClosable={false}
        title="产地编辑"
        okText="保存"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <Row>
            <Col span={12}>
              <FormItem key="Code" {...formLayout} label="产地ID">
                {getFieldDecorator('Code', {
                  rules: [{ required: true, message: '请输入产地ID！' }],
                  initialValue: formVals.Code,
                })(<Input disabled={method === 'U'} placeholder="请输入产地ID" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="Name" {...formLayout} label="名称">
                {getFieldDecorator('Name', {
                  rules: [{ required: true, message: '请输入名称！' }],
                  initialValue: formVals.Name,
                })(<Input placeholder="请输入名称" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="Comment" {...formLayout} label="备注">
                {getFieldDecorator('Comment', {
                  initialValue: formVals.Comment,
                })(<TextArea placeholder="请输入备注" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
/* eslint react/no-multi-comp:0 */
@connect(({ manLocation, loading }) => ({
  manLocation,
  loading: loading.models.manLocation,
}))
@Form.create()
class Staffs extends PureComponent {
  state = {
    modalVisible: false,
    method: 'A',
    formValues: {
      Code: '',
      Name: '',
      Comment: '',
    },
    queryData: {
      Content: {
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
      title: '产地ID',
      width: 100,
      dataIndex: 'Code',
      align: 'center',
    },
    {
      title: '名称',
      width: 200,
      dataIndex: 'Name',
      align: 'center',
    },

    {
      title: '备注',
      width: 100,
      dataIndex: 'Comment',
      align: 'center',
    },

    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
            {' '}
            <MyIcon type="iconedit" />
          </a>
          <Divider type="vertical" />
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record.Code)}>
            <a href="javascript:;">
              {' '}
              <MyIcon type="iconshanchu" />
            </a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'manLocation/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'manLocation/fetch',
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
      this.setState({
        queryData: {
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
      dispatch({
        type: 'manLocation/fetch',
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

  // 删除的产地
  handleDelete = Code => {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'manLocation/remove',
      payload: {
        Content: {
          Code,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('删除成功');
          dispatch({
            type: 'manLocation/fetch',
            payload: {
              ...queryData,
            },
          });
        }
      },
    });
  };

  handleSubmit = fieldsValue => {
    const { dispatch } = this.props;
    const { method, queryData } = this.state;
    this.setState({
      formValues: { ...fieldsValue },
    });
    if (method === 'A') {
      dispatch({
        type: 'manLocation/add',
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
              type: 'manLocation/fetch',
              payload: {
                ...queryData,
              },
            });
          }
        },
      });
    } else {
      dispatch({
        type: 'manLocation/update',
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
              type: 'manLocation/fetch',
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
      manLocation: { manLocationList, pagination },
      loading,
    } = this.props;
    const { modalVisible, formValues, method } = this.state;
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
              data={{ list: manLocationList }}
              rowKey="Code"
              pagination={pagination}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          formVals={formValues}
          method={method}
          modalVisible={modalVisible}
        />
      </Fragment>
    );
  }
}

export default Staffs;
