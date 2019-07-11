/* eslint-disable no-param-reassign */
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
  DatePicker,
  message,
  Select,
  Checkbox,
  Tag,
  Icon,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import Organization from '@/components/Organization';
import MDMCommonality from '@/components/Select';
import MyIcon from '@/components/MyIcon';
import ChangePassword from '@/components/Password';
import { validatorEmail, checkPhone, getName } from '@/utils/utils';
import { formLayout, formItemLayout, roleType } from '@/utils/publicData';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ global, loading }) => ({
  global,
  addloading: loading.effects['staffs/add'],
  updateloading: loading.effects['staffs/update'],
}))
@Form.create()
class CreateForm extends PureComponent {
  validatorPhone = (rule, value, callback) => {
    const { form } = this.props;
    if (value && form.getFieldValue('GAreaCode') === '86' && !checkPhone(value)) {
      callback(new Error('手机号格式不正确'));
    } else {
      callback();
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      form,
      method,
      global: { Company, WhsCode, TI_Z051 },
      formVals,
      modalVisible,
      handleModalVisible,
      handleSubmit,
      updateloading,
      addloading,
    } = this.props;
    const prefixSelector = getFieldDecorator('GAreaCode', {
      initialValue: formVals.GAreaCode || '86',
    })(
      <Select style={{ width: 90 }}>
        <Option value="86">+86(中)</Option>
        <Option value="49">+49(德)</Option>
        <Option value="1">+1(美)</Option>
      </Select>
    );
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        fieldsValue.AllDataPermission = fieldsValue.AllDataPermission ? 'Y' : 'N';
        fieldsValue.IsAdministrator = fieldsValue.IsAdministrator ? 'Y' : 'N';
        handleSubmit({ ...formVals, ...fieldsValue });
      });
    };
    const loading = method === 'A' ? addloading : updateloading;
    return (
      <Modal
        width={960}
        confirmLoading={loading}
        destroyOnClose
        title="员工编辑"
        okText="保存"
        maskClosable={false}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <Row>
            <Col span={12}>
              <FormItem key="Code" {...formLayout} label="代码">
                {getFieldDecorator('Code', {
                  rules: [{ required: true, message: '请输入代码！' }],
                  initialValue: formVals.Code,
                })(<Input disabled={method !== 'A'} placeholder="请输入代码" />)}
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
              <FormItem label="手机号" {...formLayout} key="Mobile">
                {getFieldDecorator('Mobile', {
                  rules: [
                    { required: true, message: '请输入手机号！' },
                    {
                      validator: this.validatorPhone,
                    },
                  ],
                  initialValue: formVals.Mobile,
                })(<Input addonBefore={prefixSelector} placeholder="请输入手机号" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="Email" {...formLayout} label="邮箱">
                {getFieldDecorator('Email', {
                  rules: [{ validator: validatorEmail }],
                  initialValue: formVals.Email,
                })(<MDMCommonality initialValue={formVals.Email} data={TI_Z051} />)}
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
              <FormItem key="Fax" {...formLayout} label="传真">
                {getFieldDecorator('Fax', {
                  initialValue: formVals.Fax,
                })(<Input placeholder="请输入传真" />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem key="Tel" {...formLayout} label="电话">
                {getFieldDecorator('Tel', {
                  initialValue: formVals.Tel,
                })(<Input placeholder="请输入电话" />)}
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
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="Dmanager" {...formLayout} label="级别">
                {getFieldDecorator('Dmanager', {
                  initialValue: formVals.Dmanager,
                })(
                  <Select placeholder="请选择">
                    <Option value="1">主管</Option>
                    <Option value="2">员工</Option>
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
              <FormItem key="Role" {...formLayout} label="角色">
                {getFieldDecorator('Role', {
                  rules: [{ required: true, message: '请选择角色！' }],
                  initialValue: formVals.Role,
                })(<MDMCommonality initialValue={formVals.Role} data={roleType} />)}
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
              <FormItem key="IsAdministrator" {...formLayout} label="管理员">
                {getFieldDecorator('IsAdministrator', {
                  valuePropName: 'checked',
                  initialValue: formVals.IsAdministrator === 'Y',
                })(<Checkbox />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem key="AllDataPermission" {...formLayout} label="数据权限">
                {getFieldDecorator('AllDataPermission', {
                  valuePropName: 'checked',
                  initialValue: formVals.AllDataPermission === 'Y',
                })(<Checkbox />)}
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
    passwordModalVisible: false,
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
      Role: '',
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
      title: '员工ID',
      width: 80,
      dataIndex: 'Code',
    },
    {
      title: '姓名',
      width: 80,
      dataIndex: 'Name',
    },
    {
      title: '部门',
      width: 200,
      dataIndex: 'Department',
      render: val => {
        const {
          global: { TI_Z003 },
        } = this.props;
        return <span style={{ fontSize: 13 }}>{getName(TI_Z003, val)}</span>;
      },
    },
    {
      title: '级别',
      width: 60,
      dataIndex: 'Dmanager',
      render: val => (val === '1' ? <Tag color="blue">主管</Tag> : ''),
    },
    {
      title: '角色',
      width: 60,
      dataIndex: 'Role',
      align: 'center',
      render: val => this.whichRole(val),
    },
    {
      title: '手机号',
      width: 120,
      dataIndex: 'Mobile',
      render: (text, record) => (
        <span style={{ fontSize: 13 }}>
          {record.GAreaCode ? <span>{`+${record.GAreaCode}-`}</span> : ''}
          {text}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      render: text => <span style={{ fontSize: 13 }}>{text}</span>,
    },
    {
      title: '职位',
      width: 100,
      dataIndex: 'Position',
    },
    {
      title: '电话',
      width: 150,
      dataIndex: 'Tel',
    },
    {
      title: '传真',
      width: 150,
      dataIndex: 'Fax',
    },
    {
      title: '性别',
      width: 60,
      dataIndex: 'Gender',
      render: val => <span>{val === '1' ? '男' : '女'}</span>,
    },
    {
      title: '管理员',
      width: 80,
      align: 'center',
      dataIndex: 'IsAdministrator',
      render: val => (val === 'Y' ? <Tag color="blue">管理员</Tag> : ''),
    },
    {
      title: '数据权限',
      width: 80,
      dataIndex: 'AllDataPermission',
      render: val => (val === 'Y' ? <Tag color="blue">全部</Tag> : ''),
    },
    {
      title: '状态',
      width: 60,
      align: 'center',
      dataIndex: 'Status',
      render: val => (val === '1' ? <Tag color="blue">在职</Tag> : <Tag color="red">离职</Tag>),
    },
    {
      title: '交易公司',
      width: 200,
      dataIndex: 'CompanyCode',
      render: val => {
        const {
          global: { Company },
        } = this.props;
        return <span style={{ fontSize: 13 }}>{getName(Company, val)}</span>;
      },
    },
    {
      title: '默认仓库',
      width: 150,
      dataIndex: 'DefaultWhsCode',
      render: val => {
        const {
          global: { WhsCode },
        } = this.props;
        return <span>{getName(WhsCode, val)}</span>;
      },
    },
    {
      title: '入职时间',
      width: 100,
      dataIndex: 'EntryTime',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '离职时间',
      width: 100,
      dataIndex: 'ResignationTime',
      render: (val, record) => (
        <span>{val && record.Status !== '1' ? moment(val).format('YYYY-MM-DD') : ''}</span>
      ),
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
            <MyIcon type="iconedit" />
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.changePassword(record)}>
            <Icon type="lock" theme="twoTone" />
          </a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      location: { query },
      global: { TI_Z003, Company, WhsCode },
    } = this.props;
    const { Department } = query;
    const { queryData } = this.state;
    Object.assign(queryData.Content, { Department: Department || '' });
    this.setState({ queryData: { ...queryData } });
    if (!TI_Z003.length || !WhsCode.length || !Company.length) {
      dispatch({
        type: 'global/getMDMCommonality',
        payload: {
          Content: {
            CodeList: ['Company', 'WhsCode', 'TI_Z003', 'TI_Z051'],
          },
        },
      });
    }
    dispatch({
      type: 'staffs/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  whichRole = role => {
    switch (role) {
      case 'A':
        return <Tag color="blue">全部</Tag>;
      case 'S':
        return <Tag color="cyan">销售</Tag>;
      case 'P':
        return <Tag color="green">采购</Tag>;
      default:
        return '';
    }
  };

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    this.setState({
      queryData: { ...queryData, page: pagination.current, rows: pagination.pageSize },
    });
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
        type: 'staffs/fetch',
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

  changePassword = record => {
    this.setState({
      formValues: record,
      passwordModalVisible: true,
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
        type: 'staffs/add',
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
          if (response && response.Status === 200) {
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

  departmentChange = val => {
    const { queryData } = this.state;
    Object.assign(queryData.Content, { Department: val || '' });
    this.setState({
      queryData: { ...queryData },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      passwordModalVisible: !!flag,
      method: 'A',
      formValues: {},
    });
  };

  addStaffs = () => {
    this.setState({
      modalVisible: true,
      method: 'A',
      formValues: {},
    });
  };

  reloadLocal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'staffs/reload',
      callback: response => {
        if (response && response.Status === 200) {
          message.success('刷新成功');
        }
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      queryData: {
        Content: { Department },
      },
    } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="Department" {...formLayout} label="部门">
              {getFieldDecorator('Department', {
                initialValue: Department,
              })(<Organization onChange={this.departmentChange} initialValue={Department} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                icon="plus"
                style={{ marginLeft: 8, marginRight: 8 }}
                type="primary"
                onClick={this.addStaffs}
              >
                新建
              </Button>
              <Button type="primary" onClick={this.reloadLocal}>
                刷新缓存
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
    const { modalVisible, formValues, method, passwordModalVisible } = this.state;
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
              data={{ list: staffsList }}
              rowKey="Code"
              scroll={{ x: 2150 }}
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
        <ChangePassword
          Code={formValues.Code}
          modalVisible={passwordModalVisible}
          handleModalVisible={this.handleModalVisible}
        />
      </Fragment>
    );
  }
}

export default Staffs;
