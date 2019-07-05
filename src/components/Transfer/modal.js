import React, { PureComponent } from 'react';
import { Row, Form, Input, Modal, Col, Checkbox } from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;
@Form.create()
@connect(({ loading, global }) => ({
  global,
  loading: loading.models.global,
}))
class TransferConfirm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
  }

  componentDidMount() {
    const {
      dispatch,
      global: { TI_Z050 },
    } = this.props;
    if (!TI_Z050.length) {
      dispatch({
        type: 'global/getMDMCommonality',
        payload: {
          Content: {
            CodeList: ['TI_Z050'],
          },
        },
      });
    }
  }

  okHandle = () => {
    const {
      handleSubmit,
      DocEntry,
      form,
      global: { TI_Z050 },
    } = this.props;
    if (handleSubmit) {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const { IsConfirm, IsEnquiry, Comment, Transfer } = fieldsValue;
        // eslint-disable-next-line camelcase
        let TI_Z04302List = [];
        if (Transfer.length) {
          // eslint-disable-next-line camelcase
          TI_Z04302List = Transfer.map((item, index) => {
            const thisLine = TI_Z050.find(val => val.Key === item);
            return {
              DocEntry,
              OrderID: index + 1,
              TransferType: thisLine.Key,
              TransferTypeName: thisLine.Value,
            };
          });
        }
        const newobj = {
          IsConfirm: IsConfirm ? 'Y' : 'N',
          IsEnquiry: IsEnquiry ? 'Y' : 'N',
          Comment,
          TI_Z04302List,
        };
        handleSubmit(newobj);
      });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      global: { TI_Z050 },
    } = this.props;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
      },
    };

    return (
      <Modal
        width={640}
        destroyOnClose
        title="确认转移"
        maskClosable={false}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row>
            <Col lg={24} md={24} sm={24}>
              <Form.Item>
                {getFieldDecorator('Transfer', {
                  rules: [{ required: true, message: '请选择转移类型！' }],
                })(
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      {TI_Z050.map(item => (
                        <Col lg={8} md={12} sm={24} key={item.Key}>
                          <Checkbox value={item.Key}>{item.Value}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={24} md={24} sm={24}>
              <Form.Item>
                {getFieldDecorator('Comment', {
                  rules: [{ required: true, message: '请填写备注！' }],
                })(<TextArea placeholder="备注" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={4} md={12} sm={24}>
              <Form.Item>
                {getFieldDecorator('IsConfirm', {
                  valuePropName: 'checked',
                })(<Checkbox>需要确认</Checkbox>)}
              </Form.Item>
            </Col>
            <Col lg={4} md={12} sm={24}>
              <Form.Item>
                {getFieldDecorator('IsEnquiry', {
                  valuePropName: 'checked',
                })(<Checkbox>需要询价</Checkbox>)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
export default TransferConfirm;
