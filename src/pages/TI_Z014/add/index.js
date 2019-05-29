/* eslint-disable array-callback-return */
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
    authorityGroupDetail: {
      Content: {
        Code: '',
        Name: '',
        TI_Z01402: [],
      },
    },
    method: 'A',
    modalVisible: false,
    employeeList: [],
  };

  componentDidMount() {
    this.getSingle();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.authorityGroupAdd.authorityGroupDetail !== prevState.authorityGroupDetail) {
      return {
        authorityGroupDetail: nextProps.authorityGroupAdd.authorityGroupDetail,
        employeeList: nextProps.authorityGroupAdd.authorityGroupDetail.TI_Z01402,
      };
    }
    return null;
  }

  getSingle() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.Code) {
      this.setState({ method: 'U' });
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
    const { employeeList, authorityGroupDetail } = this.state;
    const isnull = employeeList.length === 0;
    if (isnull) {
      rows.map(item => {
        employeeList.push({
          EmployeeCode: item.Code,
          EmployeeName: item.Name,
          Code: authorityGroupDetail.Code,
        });
      });
    } else {
      rows.map(item => {
        if (!isnull) {
          employeeList.map(employee => {
            if (item.Code !== employee.EmployeeCode) {
              employeeList.push({
                EmployeeCode: item.Code,
                EmployeeName: item.Name,
                Code: authorityGroupDetail.Code,
              });
            }
          });
        }
      });
    }
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
    const { authorityGroupDetail, employeeList, modalVisible, method } = this.state;
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
    return (
      <Card bordered={false}>
        <Form {...formItemLayout}>
          <Row gutter={8}>
            <Col lg={6} md={12} sm={24}>
              <FormItem key="Code" {...this.formLayout} label="角色ID">
                {getFieldDecorator('Code', {
                  rules: [{ required: true, message: '请输入角色ID！' }],
                  initialValue: authorityGroupDetail.Code,
                })(<Input disabled={method === 'U'} placeholder="请输入角色ID" />)}
              </FormItem>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <FormItem key="Name" {...this.formLayout} label="角色名称">
                {getFieldDecorator('Name', {
                  rules: [{ required: true, message: '请输入角色名称！' }],
                  initialValue: authorityGroupDetail.Name,
                })(<Input placeholder="请输入角色名称" />)}
              </FormItem>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <FormItem key="Name" {...this.formLayout}>
                <Button
                  icon="plus"
                  style={{ marginBottom: 20 }}
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  添加成员
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>

        <StandardTable data={{ list: employeeList }} rowKey="EmployeeCode" columns={this.columns} />
        <FooterToolbar>
          {method === 'U' ? (
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
