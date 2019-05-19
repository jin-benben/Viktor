import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Divider, Icon, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import StaffsModal from '@/components/Modal/Staffs';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ authorityGroupAdd, loading }) => ({
  authorityGroupAdd,
  loading: loading.models.rule,
}))
@Form.create()
class authorityGroup extends PureComponent {
  columns = [
    {
      title: '成员ID',
      dataIndex: 'EmployeeCode',
    },
    {
      title: '成员姓名',
      dataIndex: 'EmployeeName',
    },
    {
      title: '删除',
      dataIndex: 'contact',
      render: (text, record, index) => (
        // eslint-disable-next-line no-script-url
        <a href="javascript:;" onClick={() => this.deleteLine(index)}>
          <Icon type="delete" theme="twoTone" />
        </a>
      ),
    },
  ];

  state = {
    authorityGroupAddDetail: {
      Content: {
        Code: 'string',
        Name: 'string',
        TI_Z01402: [],
      },
    },
    modalVisible: false,
    employeeList: [],
  };

  componentDidMount() {
    this.getSingle();
  }

  getSingle() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.Code) {
      dispatch({
        type: 'authorityGroupAdd/fetch',
        payload: {
          Content: {
            Code: query.Code,
          },
        },
      });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.authorityGroupAdd.companyDetail !== prevState.formVals) {
      return {
        formVals: nextProps.companyEdit.companyDetail,
      };
    }
    return null;
  }

  deleteLine = index => {
    const { employeeList } = this.state;
    employeeList.splice(index, 1);
    this.setState({ employeeList: [...employeeList] });
  };

  handleModalVisible = flag => {
    this.setState({ modalVisible: !!flag });
  };

  addEmployee = rows => {
    // 添加行
    const { employeeList } = this.state;
    const isnull = employeeList.length === 0;
    rows.map(item => {
      if (!isnull) {
        employeeList.map(employee => {
          if (item.Code !== employee.EmployeeCode) {
            employeeList.push({ EmployeeCode: item.Code, EmployeeName: item.Name });
          }
        });
      }
      employeeList.push({ EmployeeCode: item.Code, EmployeeName: item.Name });
    });
    this.setState({ employeeList: [...employeeList] });
    this.handleModalVisible(false);
  };

  saveHandle = () => {
    // 保存主数据
    const { form, dispatch } = this.props;
    const { employeeList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'authorityGroupAdd/add',
        payload: {
          Content: {
            ...fieldsValue,
            TI_Z01402: employeeList,
          },
        },
        callback: response => {
          if (response.Status === 200) {
            message.success('添加成功');
          }
        },
      });
    });
  };

  updateHandle = () => {
    // 更新主数据
    const { form, dispatch } = this.props;
    const { employeeList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'authorityGroupAdd/update',
        payload: {
          Content: {
            ...fieldsValue,
            TI_Z01402: employeeList,
          },
        },
        callback: response => {
          if (response.Status === 200) {
            message.success('更新成功');
          }
        },
      });
    });
  };

  render() {
    const { authorityGroupAddDetail, employeeList, modalVisible } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
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
    const parentMethods = {
      handleSubmit: this.addEmployee,
      handleModalVisible: this.handleModalVisible,
    };
    console.log(authorityGroupAddDetail.Code);
    return (
      <Card title="角色编辑">
        <Form {...formItemLayout}>
          <Row gutter={8}>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Code" {...this.formLayout} label="角色ID">
                {getFieldDecorator('Code', {
                  rules: [{ required: true, message: '请输入角色ID！' }],
                  initialValue: authorityGroupAddDetail.Code,
                })(<Input placeholder="请输入角色ID" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Name" {...this.formLayout} label="角色名称">
                {getFieldDecorator('Name', {
                  rules: [{ required: true, message: '请输入角色名称！' }],
                  initialValue: authorityGroupAddDetail.Name,
                })(<Input placeholder="请输入角色名称" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Divider orientation="left">成员列表</Divider>
        <Button
          icon="plus"
          style={{ marginLeft: 8 }}
          type="primary"
          onClick={() => this.handleModalVisible(true)}
        >
          新建
        </Button>
        <StandardTable data={{ list: employeeList }} rowKey="EmployeeCode" columns={this.columns} />
        <FooterToolbar>
          {authorityGroupAddDetail.Code ? (
            <Button onClick={this.updateHandle} type="primary">
              更新
            </Button>
          ) : (
            <Button onClick={this.saveHandle} type="primary">
              保存
            </Button>
          )}
        </FooterToolbar>
        <StaffsModal {...parentMethods} modalVisible={modalVisible} />
      </Card>
    );
  }
}

export default authorityGroup;
