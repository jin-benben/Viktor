import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Divider, Icon } from 'antd';
import StandardTable from '@/components/StandardTable';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import StaffsModal from "@/components/Modal/Staffs"

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
      dataIndex: 'Code',
    },
    {
      title: '成员姓名',
      dataIndex: 'Name',
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
    supplierDetail: {
      Content: {
        Code: 'string',
        Name: 'string',
        TI_Z01402: [],
      },
    },
    modalVisible: false,
    employeeList: [],
    method: 'A',
  };

  deleteLine = index => {
    const { employeeList } = this.state;
    employeeList.splice(index, 1);
    this.setState({ employeeList: [...employeeList] });
  };

  handleModalVisible = flag => {
    this.setState({ modalVisible: !!flag });
  };

  onSelectRow = selection => {
    console.log(selection);
  };

  addEmployee() {
    // 添加行
  }

  render() {
    const { supplierDetail, employeeList, modalVisible } = this.state;
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
      <Card title="角色编辑">
        <Form {...formItemLayout}>
          <Row gutter={8}>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Code" {...this.formLayout} label="角色ID">
                {getFieldDecorator('Code', {
                  rules: [{ required: true, message: '请输入角色ID！' }],
                  initialValue: supplierDetail.Code,
                })(<Input placeholder="请输入角色ID" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="Name" {...this.formLayout} label="角色名称">
                {getFieldDecorator('Name', {
                  rules: [{ required: true, message: '请输入角色名称！' }],
                  initialValue: supplierDetail.Name,
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
        <StandardTable
          data={{ list: employeeList }}
          rowKey="EmployeeCode"
          columns={this.columns}
          onSelectRow={this.onSelectRow}
        />
        <FooterToolbar>
          {supplierDetail.method === 'A' ? (
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
