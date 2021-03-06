/* eslint-disable array-callback-return */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Icon, message } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import StandardTable from '@/components/StandardTable';
import StaffsModal from '@/components/Modal/Staffs';
import { formLayout, formItemLayout } from '@/utils/publicData';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ authorityGroupAdd, loading }) => ({
  authorityGroupAdd,
  addloading: loading.effects['authorityGroupAdd/add'],
  updateloading: loading.effects['authorityGroupAdd/update'],
}))
@Form.create()
class authorityGroup extends PureComponent {
  columns = [
    {
      title: '成员ID',
      width: 100,
      dataIndex: 'EmployeeCode',
    },
    {
      title: '成员姓名',
      width: 100,
      dataIndex: 'EmployeeName',
    },
    {
      title: '删除',
      width: 100,
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
    rows.map(item => {
      const index = employeeList.findIndex(employee => employee.EmployeeCode === item.Code);
      if (index === -1) {
        employeeList.push({
          EmployeeCode: item.Code,
          EmployeeName: item.Name,
          Code: authorityGroupDetail.Code,
        });
      }
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
          if (response && response.Status === 200) {
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
          if (response && response.Status === 200) {
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
      addloading,
      updateloading,
    } = this.props;
    const parentMethods = {
      handleSubmit: this.addEmployee,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Card bordered={false}>
        <Form {...formItemLayout}>
          <Row gutter={8} style={{ marginBottom: 20 }}>
            <Col lg={6} md={12} sm={24}>
              <FormItem key="Code" {...formLayout} label="角色ID">
                {getFieldDecorator('Code', {
                  rules: [{ required: true, message: '请输入角色ID！' }],
                  initialValue: authorityGroupDetail.Code,
                })(<Input disabled={method === 'U'} placeholder="请输入角色ID" />)}
              </FormItem>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <FormItem key="Name" {...formLayout} label="角色名称">
                {getFieldDecorator('Name', {
                  rules: [{ required: true, message: '请输入角色名称！' }],
                  initialValue: authorityGroupDetail.Name,
                })(<Input placeholder="请输入角色名称" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>

        <StandardTable data={{ list: employeeList }} rowKey="EmployeeCode" columns={this.columns} />
        <FooterToolbar>
          {method === 'U' ? (
            <Button loading={updateloading} onClick={this.updateHandle} type="primary">
              更新
            </Button>
          ) : (
            <Button loading={addloading} onClick={this.saveHandle} type="primary">
              保存
            </Button>
          )}
          <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
            添加成员
          </Button>
        </FooterToolbar>
        <StaffsModal {...parentMethods} modalVisible={modalVisible} />
      </Card>
    );
  }
}

export default authorityGroup;
