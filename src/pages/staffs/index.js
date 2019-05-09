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
            <Row>
              <Col span={12}>
                <FormItem key="Name" {...this.formLayout} label="姓名">
                  {getFieldDecorator('Name', {
                      rules: [{ required: true, message: '请输入姓名！' }],
                      initialValue: formVals.Name,
                    })(<Input placeholder="请输入姓名" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem key="Department" {...this.formLayout} label="部门">
                  {getFieldDecorator('Department', {
                    rules: [{ required: true, message: '请选择部门！' }],
                    initialValue: formVals.Department,
                  })(<Input placeholder="请输入" />)}
                </FormItem>   
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem key="Password" {...this.formLayout} label="密码">
                  {getFieldDecorator('Password', {
                    rules: [{ required: true, message: '请输入密码！' }],
                    initialValue:formVals.Password,
                  })(<Input placeholder="请输入密码" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem key="Mobile" {...this.formLayout} label="手机号">
                  {getFieldDecorator('Mobile', {
                    rules: [{ required: true, message: '请输入手机号！' },{
                      validator: this.validatorPhone,
                    }],
                    initialValue:formVals.Mobile,
                  })(<Input placeholder="请输入手机号" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem key="Email" {...this.formLayout} label="邮箱">
                  {getFieldDecorator('Email', {
                    rules: [{validator: this.validatorEmail},],
                    initialValue:formVals.Email,
                  })(<Input placeholder="请输入邮箱" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem key="Position" {...this.formLayout} label="职位">
                  {getFieldDecorator('Position', {
                    rules: [{ required: true, message: '请输入职位' }],
                    initialValue:formVals.Position,
                  })(<Input placeholder="请输入职位" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem key="Gender" {...this.formLayout} label="性别">
                  {getFieldDecorator('Gender', {
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
              </Col>
              <Col span={12}>
                <FormItem key="Dmanager" {...this.formLayout} label="部门主管">
                  {getFieldDecorator('Dmanager', {
                    initialValue: formVals.Dmanager,
                  })(
                    <Select
                      placeholder="请选择"
                    >
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
                    )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem key="Status" {...this.formLayout} label="在职状态">
                  {getFieldDecorator('Status', {
                    initialValue: formVals.Status,
                  })(
                    <Select
                      placeholder="请选择"
                    >
                      <Option value="1">在职</Option>
                      <Option value="2">离职</Option>
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem key="CompanyCode" {...this.formLayout} label="交易主体">
                  {getFieldDecorator('CompanyCode', {
                    rules: [{ required: true, message: '请选择交易主体！' }],
                    initialValue: formVals.CompanyCode,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem key="DefaultWhsCode" {...this.formLayout} label="默认仓库">
                  {getFieldDecorator('DefaultWhsCode', {
                    initialValue: formVals.DefaultWhsCode,
                  })(
                    <Select
                      placeholder="请选择"
                    >
                      <Option value="1">正常</Option>
                      <Option value="2">问题</Option>
                    </Select>
                    )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      )
   }
}
/* eslint react/no-multi-comp:0 */
@connect(({ tableList, loading }) => ({
  tableList,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {
      Name:"",Department:"",Password:"",Gender:"",CompanyCode:"",
      Position:"",Mobile:"",Email:""
    },
  };

  columns = [
    {
      title: '用户ID',
      dataIndex: 'UserID'
    },
    {
      title: '姓名',
      dataIndex: 'Name'
    },
    {
      title: '部门',
      dataIndex: 'Department'
    },
    {
      title: '部门主管',
      dataIndex: 'Dmanager',
      render: val => <span>{val==="Y"?"是":"否"}</span>,
    },
    {
      title: '密码',
      dataIndex: 'Password'
    },
    {
      title: '手机号',
      dataIndex: 'Mobile'
    },
    {
      title: 'Email',
      dataIndex: 'Email'
    },
    {
      title: '职位',
      dataIndex: 'Position'
    },
    {
      title: '性别',
      dataIndex: 'Gender'
    },
    {
      title: '在职状态',
      dataIndex: 'Status',
      render: val => <span>{val==="1"?"在职":"离职"}</span>,
    },
    {
      title: '交易公司',
      dataIndex: 'CompanyCode'
    },
    {
      title: '默认仓库',
      dataIndex: 'DefaultWhsCode'
    },
    {
      title: '入职时间',
      dataIndex: 'EntryTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '离职时间',
      dataIndex: 'ResignationTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'CreatedAt',
    //   sorter: true,
    //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    // },
    // {
    //   title: '更新时间',
    //   dataIndex: 'UpdatedAt',
    //   sorter: true,
    //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    // },
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
      type: 'tableList/fetch',
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
      type: 'tableList/fetch',
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
        type: 'tableList/fetch',
        payload: values,
      });
    });
  };

 
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableList/add',
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
      type: 'tableList/update',
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
    console.log(record)
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
      tableList: { data },
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
          <div className={styles.tableList}>
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

export default TableList;
