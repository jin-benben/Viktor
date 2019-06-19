import React, { PureComponent } from 'react';
import { Row, Form, Input, Modal, Col, Checkbox } from 'antd';
import { connect } from 'dva';
import { getName } from '@/utils/utils';

const { TextArea } = Input;
@Form.create()
@connect(({ loading, global }) => ({
  global,
  loading: loading.models.global,
}))
class TransferConfirm extends PureComponent {
  columns = [
    {
      title: '处理人',
      dataIndex: 'Code',
    },
    {
      title: '处理角色',
      dataIndex: 'CardName',
    },
    {
      title: '客询价单',
      dataIndex: 'BrandName',
    },

    {
      title: 'SKU',
      dataIndex: 'ManufactureNO',
    },
    {
      title: '物料描述',
      dataIndex: 'Parameters',
    },
    {
      title: '数量',
      dataIndex: 'package',
    },
    {
      title: '单位',
      dataIndex: 'Unit',
    },
    {
      title: '原处理人',
      dataIndex: 'Unit',
    },
    {
      title: '单据类型',
      dataIndex: 'category',
      render: (text, record) => (
        <span>{`${record.Cate1Name}/${record.Cate2Name}/${record.Cate3Name}`}</span>
      ),
    },

    {
      title: '单号',
      dataIndex: 'Putaway',
    },
    {
      title: '行号',
      dataIndex: 'Putaway',
    },
    {
      title: '采购员',
      width: 80,
      dataIndex: 'Purchaser',
      align: 'center',
      render: (val, record) => {
        const {
          global: { Purchaser },
        } = this.props;
        return record.lastIndex ? '' : <span>{getName(Purchaser, val)}</span>;
      },
    },
    {
      title: '销售员',
      width: 80,
      dataIndex: 'Purchaser',
      align: 'center',
      render: (val, record) => {
        const {
          global: { Saler },
        } = this.props;
        return record.lastIndex ? '' : <span>{getName(Saler, val)}</span>;
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {};
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['TI_Z050'],
        },
      },
    });
  }

  okHandle = () => {
    const { handleSubmit, form } = this.props;
    if (handleSubmit) {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        handleSubmit(fieldsValue);
      });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      handleSubmit,
      global: { TI_Z050 },
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
        title="确认转移"
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row>
            <Col lg={10} md={24} sm={24}>
              <Form.Item>
                {getFieldDecorator('Transfer')(
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      {TI_Z050.map(item => (
                        <Col span={8}>
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
            <Col>
              <Form.Item>
                {getFieldDecorator('Comment', {})(<TextArea placeholder="备注" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={10} md={12} sm={24}>
              <Form.Item>
                {getFieldDecorator('IsConfirm', {
                  valuePropName: 'checked',
                })(<Checkbox>需要确认</Checkbox>)}
              </Form.Item>
            </Col>
            <Col lg={10} md={12} sm={24}>
              <Form.Item>
                {getFieldDecorator('IsConfirm', {
                  valuePropName: 'checked',
                })(<Checkbox>需要确认</Checkbox>)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
export default TransferConfirm;
