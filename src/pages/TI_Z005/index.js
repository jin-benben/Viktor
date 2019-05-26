/* eslint-disable no-param-reassign */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Modal, Button, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import Supplier from '@/components/Supplier';
import Upload from '@/components/Upload';
import MDMCommonality from '@/components/Select';
import { getName } from '@/utils/utils';

const { TextArea } = Input;
const FormItem = Form.Item;
@connect(({ global }) => ({
  global,
}))
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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Purchaser'],
        },
      },
    });
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
      global: { Purchaser },
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
    return (
      <Modal
        width={640}
        destroyOnClose
        title="品牌编辑"
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
          <FormItem key="Purchaser" {...this.formLayout} label="采购员">
            {getFieldDecorator('Purchaser', {
              rules: [{ required: true, message: '请选择采购员！' }],
              initialValue: formVals.Purchaser,
            })(<MDMCommonality initialValue={formVals.Purchaser} data={Purchaser} />)}
          </FormItem>
          <FormItem key="supplier" {...this.formLayout} label="默认供应商">
            {getFieldDecorator('supplier', {
              initialValue: { key: formVals.CardCode, label: formVals.CardName },
            })(<Supplier labelInValue />)}
          </FormItem>
          <FormItem key="Content" {...this.formLayout} label="品牌介绍">
            {getFieldDecorator('Content', {
              initialValue: formVals.Content,
            })(<TextArea rows={4} placeholder="请输入介绍" />)}
          </FormItem>
          <FormItem key="Picture" {...this.formLayout} label="品牌主图">
            {getFieldDecorator('Picture', {
              initialValue: formVals.Picture,
            })(<Upload initialValue={formVals.Picture} />)}
          </FormItem>
          <FormItem key="Picture_List" {...this.formLayout} label="品牌图列表">
            {getFieldDecorator('Picture_List', {
              initialValue: formVals.Picture_List,
            })(<Upload initialValue={formVals.Picture_List} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
/* eslint react/no-multi-comp:0 */
@connect(({ brands, loading, global }) => ({
  brands,
  global,
  loading: loading.models.rule,
}))
@Form.create()
class BrandList extends PureComponent {
  state = {
    modalVisible: false,
    method: 'A',
    formValues: {},
  };

  columns = [
    {
      title: '品牌ID',
      dataIndex: 'Code',
    },
    {
      title: '品牌名称',
      dataIndex: 'Name',
    },
    {
      title: '品牌介绍',
      dataIndex: 'Content',
    },
    {
      title: '主图',
      dataIndex: 'Picture',
      render: val => <img style={{ width: 50, height: 50 }} src={val} alt="主图" />,
    },
    {
      title: '列表图',
      dataIndex: 'Picture_List',
      render: val => <img style={{ width: 50, height: 50 }} src={val} alt="主图" />,
    },
    {
      title: '采购员',
      dataIndex: 'Purchaser',
      render: text => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, text)}</span>;
      },
    },
    {
      title: '默认供应商',
      dataIndex: 'CardName',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      brands: { queryData },
    } = this.props;
    dispatch({
      type: 'brands/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      brands: { queryData },
    } = this.props;
    dispatch({
      type: 'brands/fetch',
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
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      dispatch({
        type: 'brands/fetch',
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

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      method: 'U',
      formValues: record,
    });
  };

  handleSubmit = fieldsValue => {
    const {
      dispatch,
      brands: { queryData },
    } = this.props;
    const { method } = this.state;
    this.setState({
      formValues: {
        ...fieldsValue,
      },
    });
    let supplier;
    if (fieldsValue.supplier) {
      supplier = {
        CardCode: fieldsValue.supplier.key,
        CardName: fieldsValue.supplier.label,
      };
    }
    let purchaser;
    if (fieldsValue.purchaser) {
      purchaser = {
        Purchaser: fieldsValue.purchaser.key,
        PurchaserName: fieldsValue.purchaser.label,
      };
    }
    delete fieldsValue.purchaser;
    delete fieldsValue.supplier;
    if (method === 'A') {
      dispatch({
        type: 'brands/add',
        payload: {
          Content: {
            ...fieldsValue,
            ...supplier,
            ...purchaser,
          },
        },
        callback: response => {
          if (response.Status === 200) {
            this.handleModalVisible(false);
            message.success('添加成功');
            dispatch({
              type: 'brands/fetch',
              payload: {
                ...queryData,
              },
            });
          }
        },
      });
    } else {
      dispatch({
        type: 'brands/update',
        payload: {
          Content: {
            ...fieldsValue,
            ...supplier,
            ...purchaser,
          },
        },
        callback: response => {
          if (response.Status === 200) {
            this.handleModalVisible(false);
            message.success('更新成功');
            dispatch({
              type: 'brands/fetch',
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
          <Col className="submitButtons">
            <FormItem label="品牌名称">
              {getFieldDecorator('SearchText')(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem>
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
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      brands: { brandsList, pagination },
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
              data={{ list: brandsList }}
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

export default BrandList;