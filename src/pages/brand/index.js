import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Modal,
  Button,
  message,
  Divider,
  Select,
} from 'antd';
import StandardTable from '@/components/StandardTable';
// import Image from '@/components/Image'
import styles from './style.less';
import {checkPhone,chechEmail} from '@/utils/utils'

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
class CreateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formVals:props.formVals,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }
  
  static getDerivedStateFromProps(nextProps, prevState) {
     if(nextProps.formVals!==prevState.formVals){
       return {
         formVals:nextProps.formVals
       }
     }
     return null;
  }

  validatorPhone= (rule, value, callback) => {
    if (value && !checkPhone(value)) {
      callback(new Error('手机号格式不正确'));
    } else {
      callback();
    }
  }

  validatorEmail= (rule, value, callback) => {
    if (value && !chechEmail(value)) {
      callback(new Error('邮箱格式不正确'));
    } else {
      callback();
    }
  } 

   render() {
      const {
        form:{getFieldDecorator},
        modalVisible,
        handleModalVisible,
        handleSubmit
      } = this.props;
      const {formVals} = this.state
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
          title="添加员工"
          visible={modalVisible}
          onOk={handleSubmit}
          onCancel={() => handleModalVisible()}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            
            <FormItem key="Name" {...this.formLayout} label="姓名">
              {getFieldDecorator('Name', {
                rules: [{ required: true, message: '请输入姓名！' }],
                initialValue: formVals.Name,
              })(<Input placeholder="请输入姓名" />)}
            </FormItem>
           
            <Row>
              <FormItem key="Department" {...this.formLayout} label="部门">
                {getFieldDecorator('Department', {
                  rules: [{ required: true, message: '请选择部门！' }],
                  initialValue: formVals.Department,
                })(<Input placeholder="请输入" />)}
              </FormItem>  
            </Row>
            <Row>
              <FormItem key="Password" {...this.formLayout} label="密码">
                {getFieldDecorator('Password', {
                  rules: [{ required: true, message: '请输入密码！' }],
                  initialValue:formVals.Password,
                })(<Input placeholder="请输入密码" />)}
              </FormItem>
            </Row>
            <Row>
              <FormItem key="Mobile" {...this.formLayout} label="手机号">
                {getFieldDecorator('Mobile', {
                  rules: [{ required: true, message: '请输入手机号！' },{
                    validator: this.validatorPhone,
                  }],
                  initialValue:formVals.Mobile,
                })(<Input placeholder="请输入手机号" />)}
              </FormItem>
            </Row>
            <Row>
              <FormItem key="Email" {...this.formLayout} label="邮箱">
                {getFieldDecorator('Email', {
                  rules: [{validator: this.validatorEmail},],
                  initialValue:formVals.Email,
                })(<Input placeholder="请输入邮箱" />)}
              </FormItem>
            </Row>
            <Row>
              <FormItem key="Position" {...this.formLayout} label="职位">
                {getFieldDecorator('Position', {
                  rules: [{ required: true, message: '请输入职位' }],
                  initialValue:formVals.Position,
                })(<Input placeholder="请输入职位" />)}
              </FormItem>
            </Row>
            <Row>
              <FormItem key="Gender" {...this.formLayout} label="性别">
                {getFieldDecorator('Gender', {
                  rules: [{  message: '请选择性别' }],
                  initialValue: formVals.Gender,
                })(
                  <Select
                    placeholder="请选择性别"
                  >
                    <Option value="1">男</Option>
                    <Option value="2">女</Option>
                    <Option value="3">不详</Option>
                  </Select>
                  )}
              </FormItem>
            </Row>
            <Row>
              <FormItem key="CompanyCode" {...this.formLayout} label="交易主体">
                {getFieldDecorator('CompanyCode', {
                  rules: [{ required: true, message: '请选择交易主体！' }],
                  initialValue: formVals.CompanyCode,
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Row>
          </Form>
        </Modal>
      )
   }
}
/* eslint react/no-multi-comp:0 */
@connect(({ brandList, loading }) => ({
  brandList,
  loading: loading.models.rule,
}))
@Form.create()
class BrandList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {
      Name:"",Department:"",Password:"",Gender:"",CompanyCode:"",
      Position:"",Mobile:"",Email:""
    },
  };

  columns = [
    {
      title: '品牌ID',
      dataIndex: 'Code'
    },
    {
      title: '品牌名称',
      dataIndex: 'Name'
    },
    {
      title: '品牌介绍',
      dataIndex: 'Content'
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
      dataIndex: 'Modifier'
    },
    {
      title: '默认供应商',
      dataIndex: 'Supplier'
    },
    {
      title: '创建时间',
      dataIndex: 'CreatedAt',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '更新时间',
      dataIndex: 'UpdatedAt',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
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
    const { dispatch } = this.props;
    dispatch({
      type: 'brandList/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'brandList/fetch',
      payload: params,
    });
  };

  


 

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'brandList/fetch',
        payload: values,
      });
    });
  };

 
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'brandList/add',
      payload: {
        desc: fields.desc,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'brandList/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      formValues:record
    });

  };

  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      this.handleAdd(fieldsValue);
    });
  }


  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      formValues:{}
    });
  }
 

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button icon="plus" style={{ marginLeft: 8 }} type="primary" onClick={() => this.handleModalVisible(true)}>
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
      brandList: { data },
      loading,
    } = this.props;
    const {  modalVisible,formValues } = this.state;
    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.brandList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()} 
            </div>
            <StandardTable
              loading={loading}
              data={data}
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
