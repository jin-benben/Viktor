import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { formLayout, formItemLayout } from '@/utils/publicData';

const FormItem = Form.Item;

const { Option } = Select;
const { TextArea } = Input;
const CreateForm = Form.create()(props => {
  const {
    form: { getFieldDecorator },
    form,
    formVals,
    modalVisible,
    handleModalVisible,
    handleSubmit,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSubmit({ ...formVals, ...fieldsValue });
    });
  };
  return (
    <Modal
      width={640}
      maskClosable={false}
      destroyOnClose
      title="部门编辑"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form {...formItemLayout}>
        <FormItem key="Level" {...formLayout} label="层级">
          {getFieldDecorator('Level', {
            initialValue: formVals.Level,
          })(
            <Select placeholder="级别" disabled>
              <Option value={1}>一级</Option>
              <Option value={2}>二级</Option>
              <Option value={3}>三级</Option>
            </Select>
          )}
        </FormItem>
        <FormItem key="Type" {...formLayout} label="类型">
          {getFieldDecorator('Type', {
            initialValue: formVals.Type,
          })(
            <Select placeholder="类型">
              <Option value="1">交易公司</Option>
              <Option value="2">部门</Option>
            </Select>
          )}
        </FormItem>
        <FormItem key="Code" {...formLayout} label="部门ID">
          {getFieldDecorator('Code', {
            rules: [{ required: true, message: '请输入部门ID！' }],
            initialValue: formVals.Code,
          })(<Input placeholder="请输入部门ID！" />)}
        </FormItem>
        <FormItem key="Name" {...formLayout} label="名称">
          {getFieldDecorator('Name', {
            rules: [{ required: true, message: '请输入名称！' }],
            initialValue: formVals.Name,
          })(<Input placeholder="请输入名称！" />)}
        </FormItem>
        <FormItem key="备注" {...formLayout} label="备注">
          {getFieldDecorator('Comment', {
            initialValue: formVals.Comment,
          })(<TextArea placeholder="请输入备注！" />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

export default CreateForm;
