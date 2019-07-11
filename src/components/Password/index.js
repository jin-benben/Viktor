import React, { PureComponent } from 'react';

import { Row, Col, Form, Input, Modal, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ global, loading }) => ({
  global,
  loading: loading.effects['global/changepassword'],
}))
class ChangePassword extends PureComponent {
  okHandle = () => {
    const { dispatch, form, Code, handleModalVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { Password } = fieldsValue;
      dispatch({
        type: 'global/changepassword',
        payload: {
          Content: {
            Code,
            Password,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('修改成功');
            handleModalVisible(false);
          }
        },
      });
    });
  };

  render() {
    const {
      modalVisible,
      form: { getFieldDecorator },
      handleModalVisible,
      loading,
    } = this.props;
    return (
      <Modal
        width={640}
        maskClosable={false}
        confirmLoading={loading}
        destroyOnClose
        title="密码修改"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 8 }}>
            <Col>
              <FormItem label="新密码">
                {getFieldDecorator('Password', {
                  rules: [{ required: true, message: '请输入新密码' }],
                })(<Input placeholder="请输入新密码" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default ChangePassword;
