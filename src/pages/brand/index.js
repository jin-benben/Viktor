import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Modal, Button, message, Divider } from 'antd';
import StandardTable from '@/components/StandardTable';
import Staffs from '@/components/Staffs';
import Supplier from '@/components/Supplier';
import Upload from '@/components/Upload';

const { TextArea } = Input;
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
        console.log(fieldsValue);
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
              initialValue: formVals.Purchaser,
            })(<Staffs labelInValue={false} initialValue={formVals.Purchaser} />)}
          </FormItem>
          <FormItem key="CardCode" {...this.formLayout} label="默认供应商">
            {getFieldDecorator('CardCode', {
              initialValue: formVals.CardCode,
            })(<Supplier labelInValue={false} initialValue={formVals.CardCode} />)}
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
@connect(({ brands, loading }) => ({
  brands,
  loading: loading.models.rule,
}))
@Form.create()
class BrandList extends PureComponent {
  state = {
    modalVisible: false,
    method: 'A',
    formValues: {
      Name: '',
      Department: '',
      Password: '',
      Gender: '',
      CompanyCode: '',
      Position: '',
      Mobile: '',
      Email: '',
    },
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
      //  render: val => <Image src={val} />
    },
    {
      title: '列表图',
      dataIndex: 'Mobile',
      //  render: val => <Image src={val} />
    },
    {
      title: '采购员',
      dataIndex: 'Purchaser',
    },
    {
      title: '默认供应商',
      dataIndex: 'CardName',
    },
    {
      title: '时间',
      dataIndex: 'time',
      render: (text, record) => (
        <Fragment>
          <p>创建时间：{moment(record.UpdatedAt).format('YYYY-MM-DD HH:mm:ss')}</p>
          <p>更新时间{moment(record.CreateAt).format('YYYY-MM-DD HH:mm:ss')}</p>
        </Fragment>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
          <Divider type="vertical" />
          <a href="">删除</a>
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
    if (method === 'A') {
      dispatch({
        type: 'brands/add',
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
          <Col lg={8} md={8} sm={24}>
            <FormItem label="品牌名称">
              {getFieldDecorator('SearchText')(<Input placeholder="请输入" />)}
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
