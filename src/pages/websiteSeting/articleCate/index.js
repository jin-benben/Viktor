/* eslint-disable no-script-url */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Modal,
  Button,
  message,
  Popconfirm,
  Icon,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import MDMCommonality from '@/components/Select';
import MyIcon from '@/components/MyIcon';
import { formItemLayout, formLayout, articleType } from '@/utils/publicData';
import { getName } from '@/utils/utils';

const FormItem = Form.Item;
const CreateForm = Form.create()(props => {
  const {
    form: { getFieldDecorator },
    form,
    formVals,
    modalVisible,
    handleSubmit,
    handleModalVisible,
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
      title="文章分类编辑"
      maskClosable={false}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form {...formItemLayout}>
        <Row>
          <FormItem key="Code" {...formLayout} label="分类代码">
            {getFieldDecorator('Code', {
              rules: [{ required: true, message: '请输入分类代码！' }],
              initialValue: formVals.Code,
            })(<Input placeholder="请输入分类代码" />)}
          </FormItem>
        </Row>
        <Row>
          <FormItem key="Name" {...formLayout} label="分类名称">
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: '请输入分类名称！' }],
              initialValue: formVals.Name,
            })(<Input placeholder="请输入分类名称" />)}
          </FormItem>
        </Row>
        <Row>
          <FormItem key="Type" {...formLayout} label="类型">
            {getFieldDecorator('Type', { initialValue: formVals.Type })(
              <MDMCommonality initialValue={formVals.Type} data={articleType} />
            )}
          </FormItem>
        </Row>
      </Form>
    </Modal>
  );
});
/* eslint react/no-multi-comp:0 */
@connect(({ articleCate, loading }) => ({
  articleCate,
  loading: loading.models.articleCate,
}))
@Form.create()
class ArticleCates extends PureComponent {
  state = {
    modalVisible: false,
    method: 'A',
    formValues: {
      Code: '',
      articleCatePassword: '',
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
      title: '分类代码',
      width: 100,
      dataIndex: 'Code',
    },
    {
      title: '分类名称',
      width: 100,
      dataIndex: 'Name',
    },
    {
      title: '分类类型',
      width: 100,
      dataIndex: 'Type',
      render: text => <span>{getName(articleType, text)}</span>,
    },
    {
      title: '操作',
      width: 50,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
            <MyIcon type="iconedit" />
          </a>
          <Divider type="vertical" />
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record.Code)}>
            <a href="javascript:;">
              <Icon type="delete" theme="twoTone" />
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
      type: 'articleCate/fetch',
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
      type: 'articleCate/remove',
      payload: {
        Content: {
          Code,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('删除成功');
          dispatch({
            type: 'articleCate/fetch',
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
      type: 'articleCate/fetch',
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
        type: 'articleCate/fetch',
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
    this.setState({
      formValues: { ...fieldsValue },
    });
    if (method === 'A') {
      dispatch({
        type: 'articleCate/add',
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
              type: 'articleCate/fetch',
              payload: {
                ...queryData,
              },
            });
          }
        },
      });
    } else {
      dispatch({
        type: 'articleCate/update',
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
              type: 'articleCate/fetch',
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
      articleCate: { articleCateList, pagination },
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
          <div className="tableList" style={{ with: 600 }}>
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: articleCateList }}
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

export default ArticleCates;
