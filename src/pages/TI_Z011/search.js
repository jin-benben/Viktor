import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Button, Modal, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import Brand from '@/components/Brand';
import Category from '@/components/Category';

const FormItem = Form.Item;

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
      form,
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
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleSubmit({ ...formVals, ...fieldsValue });
      });
    };
    const categoryArr = [
      {
        Code: formVals.Category1,
        Name: formVals.Cate1Name,
      },
      {
        Code: formVals.Category2,
        Name: formVals.Cate2Name,
      },
      {
        Code: formVals.Category3,
        Name: formVals.Cate3Name,
      },
    ];
    return (
      <Modal
        width={640}
        destroyOnClose
        title="SPU修改"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <FormItem key="Name" {...this.formLayout} label="名称">
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: '请输入名称！' }],
              initialValue: formVals.Name,
            })(<Input placeholder="请输入名称！" />)}
          </FormItem>
          <FormItem key="ManLocation" {...this.formLayout} label="产地">
            {getFieldDecorator('ManLocation', {
              rules: [{ required: true, message: '请输入产地！' }],
              initialValue: formVals.ManLocation,
            })(<Input placeholder="请输入产地！" />)}
          </FormItem>
          <FormItem key="Unit" {...this.formLayout} label="单位">
            {getFieldDecorator('Unit', {
              rules: [{ required: true, message: '请输入单位！' }],
              initialValue: formVals.Unit,
            })(<Input placeholder="请输入单位！" />)}
          </FormItem>
          <FormItem key="category" {...this.formLayout} label="分类">
            {getFieldDecorator('category', {
              rules: [{ required: true, message: '请输入分类！' }],
              initialValue: categoryArr,
            })(
              <Category
                initialValue={[formVals.Category1, formVals.Category2, formVals.Category3]}
              />
            )}
          </FormItem>
          <FormItem key="BrandName" {...this.formLayout} label="品牌">
            {getFieldDecorator('BrandName', {
              initialValue: formVals.BrandName,
            })(<Brand initialValue={formVals.BrandName} keyType="Name" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
/* eslint react/no-multi-comp:0 */
@connect(({ spu, loading }) => ({
  spu,
  loading: loading.models.rule,
}))
@Form.create()
class SkuFetchComponent extends PureComponent {
  columns = [
    {
      title: 'SPU代码',
      dataIndex: 'Code',
    },
    {
      title: '名称',
      dataIndex: 'Name',
    },
    {
      title: '品牌',
      dataIndex: 'BrandName',
    },
    {
      title: '单位',
      dataIndex: 'Unit',
    },
    {
      title: '产地',
      dataIndex: 'ManLocation',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (text, record) => (
        <span>{`${record.Cate1Name}/${record.Cate2Name}/${record.Cate3Name}`}</span>
      ),
    },
  ];

  state = {
    modalVisible: false,
    formValues: {},
  };

  componentDidMount() {
    const {
      dispatch,
      spu: { queryData },
    } = this.props;
    dispatch({
      type: 'spu/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleSubmit = fieldsValue => {
    const {
      dispatch,
      spu: { queryData },
    } = this.props;

    this.setState({
      formValues: {
        ...fieldsValue,
      },
    });
    let category;
    if (fieldsValue.category) {
      category = {
        Cate1Name: fieldsValue.category[0].Name,
        Cate2Name: fieldsValue.category[1].Name,
        Cate3Name: fieldsValue.category[2].Name,
        Category1: fieldsValue.category[0].Code,
        Category2: fieldsValue.category[1].Code,
        Category3: fieldsValue.category[2].Code,
      };
    }
    delete fieldsValue.category;

    dispatch({
      type: 'spu/update',
      payload: {
        Content: {
          TI_Z01101: [{ ...fieldsValue, ...category }],
        },
      },
      callback: response => {
        if (response.Status === 200) {
          this.handleModalVisible(false);
          message.success('更新成功');
          dispatch({
            type: 'spu/fetch',
            payload: {
              ...queryData,
            },
          });
        }
      },
    });
  };

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      spu: { queryData },
    } = this.props;
    dispatch({
      type: 'spu/fetch',
      payload: {
        ...queryData,
        page: pagination.current,
        rows: pagination.pageSize,
      },
    });
  };

  handleSearch = e => {
    // 搜索
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'spu/fetch',
        payload: {
          Content: {
            SearchText: '',
            SearchKey: 'Name',
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

  handleOnRow = record => ({
    onClick: () => {
      this.setState({
        modalVisible: true,
        formValues: record,
      });
    },
  });

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 10 },
      },
    };
    return (
      <Form onSubmit={this.handleSearch} {...formItemLayout} layout="inline">
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
                onClick={() => router.push('/main/product/TI_Z011/TI_Z01101')}
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
      spu: { spuList, pagination },
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
          <div className="tableLis">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: spuList }}
              pagination={pagination}
              rowKey="Code"
              columns={this.columns}
              onRow={this.handleOnRow}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} formVals={formValues} modalVisible={modalVisible} />
      </Fragment>
    );
  }
}

export default SkuFetchComponent;
