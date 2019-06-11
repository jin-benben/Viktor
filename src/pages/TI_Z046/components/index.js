import React, { PureComponent, Fragment } from 'react';

import { Row, Col, Modal, Form, Input, Select, Button } from 'antd';
import { emailSendType } from '@/utils/publicData';
import HtmlTemplate from '@/components/Modal/HtmlTemplate';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
class PrintTemplateDetail extends PureComponent {
  state = {
    templateVisible: false,
    templatdetail: {},
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      !prevState.templatdetail.HtmlTemplateCode &&
      nextProps.templatdetail !== prevState.templatdetail
    ) {
      return {
        templatdetail: nextProps.templatdetail,
      };
    }
    return null;
  }

  handleModal = flag => {
    this.setState({ templateVisible: !!flag });
  };

  selectTemplate = select => {
    const { templatdetail } = this.state;
    const { Code } = select[0];
    Object.assign(templatdetail, { HtmlTemplateCode: Code });
    this.setState({ templatdetail: { ...templatdetail }, templateVisible: false });
  };

  render() {
    const {
      form: { getFieldDecorator },
      form,
      modalVisible,
      handleModalVisible,
      handleSubmit,
    } = this.props;
    const { templateVisible, templatdetail } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 10 },
        lg: { span: 10 },
      },
    };
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const TemplateformLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    };

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        handleSubmit({ ...templatdetail, ...fieldsValue });
      });
    };
    const parentMethod = {
      handleSubmit: this.selectTemplate,
      handleModalVisible: this.handleModal,
    };
    return (
      <Modal
        width={960}
        destroyOnClose
        title="编辑模板"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Fragment>
          <Form {...formItemLayout}>
            <Row gutter={8}>
              <Col lg={10} md={12} sm={24}>
                <FormItem key="Code" {...formLayout} label="模板ID">
                  {getFieldDecorator('Code', {
                    initialValue: templatdetail.Code,
                    rules: [{ required: true, message: '请输入模板ID' }],
                  })(<Input disabled={templatdetail.Code !== ''} placeholder="请输入模板ID" />)}
                </FormItem>
              </Col>
              <Col lg={10} md={12} sm={24}>
                <FormItem key="Name" {...formLayout} label="模板名称">
                  {getFieldDecorator('Name', {
                    initialValue: templatdetail.Name,
                    rules: [{ required: true, message: '请输入模板名称' }],
                  })(<Input placeholder="请输入模板名称" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col lg={10} md={12} sm={24}>
                <FormItem key="BaseType" {...formLayout} label="单据类型">
                  {getFieldDecorator('BaseType', {
                    rules: [{ required: true, message: '请选择单据类型！' }],
                    initialValue: templatdetail.BaseType,
                  })(
                    <Select placeholder="请选择单据类型！" style={{ width: '100%' }}>
                      {emailSendType.map(option => (
                        <Option key={option.Key} value={option.Key}>
                          {option.Value}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={10} md={12} sm={24}>
                <FormItem key="Comment" {...formLayout} label="备注">
                  {getFieldDecorator('Comment', {
                    initialValue: templatdetail.Comment,
                  })(<TextArea rows={2} placeholder="请输入备注" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col lg={20} md={20} sm={24}>
                <FormItem key="HtmlTemplateCode" {...TemplateformLayout} label="模板内容">
                  <span>{templatdetail.HtmlTemplateCode}</span>
                  <Button
                    onClick={() => this.handleModal(true)}
                    style={{ marginLeft: 10 }}
                    type="dashed"
                    shape="circle"
                    icon="search"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <HtmlTemplate {...parentMethod} modalVisible={templateVisible} />
        </Fragment>
      </Modal>
    );
  }
}

export default PrintTemplateDetail;
