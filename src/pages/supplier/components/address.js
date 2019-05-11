import React, { PureComponent } from 'react';
import { Row, Form, Input, Modal, Col, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import { checkPhone, chechEmail } from '@/utils/utils';

const FormItem = Form.Item;
@Form.create()
class AddressInfo extends PureComponent {
  columns = [
    {
      title: '品牌ID',
      dataIndex: 'Code',
    },
    {
      title: '品牌名称',
      dataIndex: 'Name',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      formVals: props.formVals,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
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

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'brandList/fetch',
      payload: params,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      handleSubmit,
    } = this.props;
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
        title="选择品牌"
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={16} sm={24}>
              <FormItem label="规则名称">
                {getFieldDecorator('name')(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <span>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </span>
            </Col>
          </Row>
        </Form>
        <StandardTable
          data={{ list: [] }}
          columns={this.columns}
          onChange={this.handleStandardTableChange}
        />
      </Modal>
    );
  }
}
export default AddressInfo;
