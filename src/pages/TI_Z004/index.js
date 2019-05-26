import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Modal, Button, DatePicker, message, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import Organization from '@/components/Organization';
import MDMCommonality from '@/components/Select';

import styles from './style.less';
import { checkPhone, chechEmail, getName } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ global }) => ({
  global,
}))
@Form.create()
class CreateForm extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Company', 'WhsCode'],
        },
      },
    });
  }

  validatorPhone = (rule, value, callback) => {
    if (value && !checkPhone(value)) {
      callback(new Error('手机号格式不正确'));
    } else {
      callback();
    }
  };

  validatorEmail = (rule, value, callback) => {
    if (value && !chechEmail(value)) {
      callback(new Error('邮箱格式不正确'));
    } else {
      callback();
    }
  };

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
      global: { Company, WhsCode },
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
        title="员工编辑"
        okText="保存"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <Row>
            <Col span={12}>
              <FormItem key="Code" {...formLayout} label="代码">
                {getFieldDecorator('Code', {
                  rules: [{ required: true, message: '请输入代码！' }],
                  initialValue: formVals.Code,
                })(<Input placeholder="请输入代码" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="Name" {...formLayout} label="姓名">
                {getFieldDecorator('Name', {
                  rules: [{ required: true, message: '请输入姓名！' }],
                  initialValue: formVals.Name,
                })(<Input placeholder="请输入姓名" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="Department" {...formLayout} label="部门">
                {getFieldDecorator('Department', {
                  rules: [{ required: true, message: '请选择部门！' }],
                  initialValue: formVals.Department,
                })(<Organization initialValue={formVals.Department} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="Mobile" {...formLayout} label="手机号">
                {getFieldDecorator('Mobile', {
                  rules: [
                    { required: true, message: '请输入手机号！' },
                    {
                      validator: this.validatorPhone,
                    },
                  ],
                  initialValue: formVals.Mobile,
                })(<Input placeholder="请输入手机号" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="Email" {...formLayout} label="邮箱">
                {getFieldDecorator('Email', {
                  rules: [{ validator: this.validatorEmail }],
                  initialValue: formVals.Email,
                })(<Input placeholder="请输入邮箱" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="Position" {...formLayout} label="职位">
                {getFieldDecorator('Position', {
                  rules: [{ required: true, message: '请输入职位' }],
                  initialValue: formVals.Position,
                })(<Input placeholder="请输入职位" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="Gender" {...formLayout} label="性别">
                {getFieldDecorator('Gender', {
                  initialValue: formVals.Gender,
                })(
                  <Select placeholder="请选择性别">
                    <Option value="1">男</Option>
                    <Option value="2">女</Option>
                    <Option value="3">不详</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="Dmanager" {...formLayout} label="部门主管">
                {getFieldDecorator('Dmanager', {
                  initialValue: formVals.Dmanager,
                })(
                  <Select placeholder="请选择">
                    <Option value="1">是</Option>
                    <Option value="2">否</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="Status" {...formLayout} label="在职状态">
                {getFieldDecorator('Status', {
                  initialValue: formVals.Status,
                })(
                  <Select placeholder="请选择">
                    <Option value="1">在职</Option>
                    <Option value="2">离职</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="CompanyCode" {...formLayout} label="交易主体">
                {getFieldDecorator('CompanyCode', {
                  rules: [{ required: true, message: '请选择交易主体！' }],
                  initialValue: formVals.CompanyCode,
                })(<MDMCommonality initialValue={formVals.CompanyCode} data={Company} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="EntryTime" {...formLayout} label="入职时间">
                {getFieldDecorator('EntryTime', {
                  initialValue: formVals.ResignationTime
                    ? moment(formVals.EntryTime, 'YYYY/MM/DD')
                    : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="ResignationTime" {...formLayout} label="离职时间">
                {getFieldDecorator('ResignationTime', {
                  initialValue: formVals.ResignationTime
                    ? moment(formVals.ResignationTime, 'YYYY/MM/DD')
                    : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="DefaultWhsCode" {...formLayout} label="默认仓库">
                {getFieldDecorator('DefaultWhsCode', {
                  rules: [{ message: '请选择仓库！' }],
                  initialValue: formVals.DefaultWhsCode,
                })(<MDMCommonality initialValue={formVals.DefaultWhsCode} data={WhsCode} />)}
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
@connect(({ staffs, loading, global }) => ({
  staffs,
  global,
  loading: loading.models.staffs,
}))
@Form.create()
class Staffs extends PureComponent {
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
      title: '员工ID',
      dataIndex: 'Code',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'Name',
    },
    {
      title: '部门',
      dataIndex: 'Department',
    },
    {
      title: '部门主管',
      dataIndex: 'Dmanager',
      render: val => <span>{val === '1' ? '是' : '否'}</span>,
    },
    {
      title: '手机号',
      dataIndex: 'Mobile',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
    },
    {
      title: '职位',
      dataIndex: 'Position',
    },
    {
      title: '性别',
      dataIndex: 'Gender',
      render: val => <span>{val === '1' ? '男' : '女'}</span>,
    },
    {
      title: '在职状态',
      dataIndex: 'Status',
      render: val => <span>{val === '1' ? '在职' : '离职'}</span>,
    },
    {
      title: '交易公司',
      dataIndex: 'CompanyCode',
      render: val => {
        const {
          global: { Company },
        } = this.props;
        console.log(val);
        return <span>{getName(Company, val)}</span>;
      },
    },
    {
      title: '默认仓库',
      dataIndex: 'DefaultWhsCode',
      render: val => {
        const {
          global: { WhsCode },
        } = this.props;
        console.log(val);
        return <span>{getName(WhsCode, val)}</span>;
      },
    },
    {
      title: '入职时间',
      dataIndex: 'EntryTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '离职时间',
      dataIndex: 'ResignationTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '操作',

      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
          {/* <Divider type="vertical" />
          <a href="">删除</a> */}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      staffs: { queryData },
    } = this.props;
    dispatch({
      type: 'staffs/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      staffs: { queryData },
    } = this.props;
    dispatch({
      type: 'staffs/fetch',
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
        type: 'staffs/fetch',
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
      staffs: { queryData },
    } = this.props;
    const { method } = this.state;
    if (method === 'A') {
      dispatch({
        type: 'staffs/add',
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
              type: 'staffs/fetch',
              payload: {
                ...queryData,
              },
            });
          }
        },
      });
    } else {
      dispatch({
        type: 'staffs/update',
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
              type: 'staffs/fetch',
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
          <Col md={8} sm={24}>
            <FormItem label="员工姓名">
              {getFieldDecorator('SearchText')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
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
      staffs: { staffsList, pagination },
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
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: staffsList }}
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

export default Staffs;
