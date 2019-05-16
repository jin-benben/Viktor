/* eslint-disable no-script-url */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Card,
  Tabs,
  Button,
  Icon,
  Switch,
  Popconfirm,
  message,
  DatePicker,
  Select,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import EditableFormTable from '@/components/EditableFormTable';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import UpdateLoad from '../components/modal';
import Staffs from '@/components/Staffs';
import { checkPhone, chechEmail } from '@/utils/utils';

const { TabPane } = Tabs;
const { Search } = Input;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ inquiryEdit, loading }) => ({
  inquiryEdit,
  loading: loading.models.rule,
}))
@Form.create()
class InquiryEdit extends PureComponent {
  skuColumns = [
    {
      title: '行号',
      dataIndex: 'LineID',
      fixed: 'left',
      width: 50,
    },
    {
      title: 'SKU',
      dataIndex: 'SKU',
      width: 100,
      inputType: 'text',
    },
    {
      title: '产品描述',
      dataIndex: 'SKUName',
      inputType: 'textArea',
      width: 100,
      editable: true,
    },
    {
      title: '品牌',
      width: 100,
      dataIndex: 'BrandName',
      inputType: 'text',
      editable: true,
    },
    {
      title: '名称',
      dataIndex: 'ProductName',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '型号',
      width: 100,
      dataIndex: 'ManufactureNO',
      inputType: 'text',
      editable: true,
    },
    {
      title: '参数',
      width: 100,
      dataIndex: 'Parameters',
      inputType: 'text',
      editable: true,
    },
    {
      title: '包装',
      width: 100,
      dataIndex: 'Package',
      inputType: 'text',
      editable: true,
    },
    {
      title: '采购员',
      width: 100,
      dataIndex: 'Purchaser',
      editable: true,
    },
    {
      title: '数量',
      width: 100,
      inputType: 'text',
      dataIndex: 'Quantity',
      editable: true,
    },
    {
      title: '单位',
      width: 80,
      inputType: 'text',
      dataIndex: 'Unit',
      editable: true,
    },
    {
      title: '要求交期',
      width: 150,
      inputType: 'date',
      dataIndex: 'DueDate',
      editable: true,
    },
    {
      title: '询价最终价格',
      width: 100,
      inputType: 'text',
      dataIndex: 'InquiryPrice',
      editable: true,
    },
    {
      title: '销售建议价格',
      width: 100,
      inputType: 'text',
      dataIndex: 'Price',
      editable: true,
    },
    {
      title: '询价最终交期',
      width: 150,
      inputType: 'date',
      dataIndex: 'InquiryDueDate',
      editable: true,
    },
    {
      title: '询价备注',
      width: 100,
      inputType: 'textArea',
      dataIndex: 'InquiryComment',
      editable: true,
    },
    {
      title: '询价行总计',
      width: 100,
      dataIndex: 'InquiryLineTotal',
    },
    {
      title: '销售行总计',
      width: 100,
      dataIndex: 'LineTotal',
    },
    {
      title: '操作',
      fixed: 'right',
      width: 80,
      render: (text, record) => (
        <Fragment>
          <Icon title="预览" type="eye" style={{ color: '#08c', marginRight: 5 }} />
          <Icon
            title="上传附件"
            className="icons"
            style={{ color: '#08c', marginRight: 5, marginLeft: 5 }}
            type="cloud-upload"
          />
          <Icon
            title="删除行"
            className="icons"
            type="delete"
            theme="twoTone"
            onClick={() => this.deleteLine(record)}
          />
        </Fragment>
      ),
    },
  ];

  attachmentColumns = [
    {
      title: '序号',
      width: 80,
      dataIndex: 'OrderID',
    },
    {
      title: '来源类型',
      dataIndex: 'BaseType',
    },
    {
      title: '来源单号',
      dataIndex: 'BaseEntry',
    },
    {
      title: '附件代码',
      dataIndex: 'AttachmentCode',
    },
    {
      title: '附件描述',
      dataIndex: 'AttachmentName',
    },
    {
      title: '附件路径',
      dataIndex: 'AttachmentPath',
      render: text => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>,
    },

    {
      title: '操作',
      render: (text, record) => (
        <Button size="small" style={{ border: 'none' }} onClick={() => this.deleteLine(record)}>
          <a target="_blnk" href={record.AttachmentPath}>
            <Icon title="预览" type="eye" style={{ color: '#08c', marginRight: 5 }} />
          </a>
          <Icon title="删除行" type="delete" theme="twoTone" />
        </Button>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      formVals: {},
      tabIndex: '1',
      uploadmodalVisible: false,
      attachmentVisible: false,
    };
    this.formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.inquiryEdit.inquiryDetail !== prevState.formVals) {
      return {
        formVals: nextProps.inquiryEdit.inquiryDetail,
      };
    }
    return null;
  }

  rowChange = record => {
    const { data } = this.state;
    data.map(item => {
      if (item.key === record.key) {
        return record;
      }
      return item;
    });
    // console.log(data)
    this.setState({ data }, () => {
      console.log(data);
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableList/add',
      payload: {
        desc: fields.desc,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  handleSubmit = fieldsValue => {
    const { AttachmentPath, AttachmentCode, AttachmentName } = fieldsValue;
    const { formVals } = this.state;
    if (fieldsValue.AttachmentPath) {
      formVals.Content.TI_Z02603.push({
        AttachmentPath,
        AttachmentCode,
        AttachmentName,
      });
      this.setState({ formVals });
    }
    this.handleModalVisible(false);
  };

  handleModalVisible = flag => {
    this.setState({
      uploadmodalVisible: !!flag,
      attachmentVisible: !!flag,
    });
  };

  tabChange = tabIndex => {
    this.setState({ tabIndex });
  };

  rightButton = tabIndex => {
    if (tabIndex === '1') {
      return (
        <Button icon="plus" style={{ marginLeft: 8 }} type="primary" onClick={this.addLineSku}>
          添加新物料
        </Button>
      );
    }
    if (tabIndex === '3') {
      return (
        <Button
          icon="plus"
          style={{ marginLeft: 8 }}
          type="primary"
          onClick={() => {
            this.setState({ uploadmodalVisible: true });
          }}
        >
          添加新附件
        </Button>
      );
    }
    return null;
  };

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

  addLineSku = () => {
    // 添加物料
    const { formVals } = this.state;
    formVals.Content.TI_Z02602.push({});
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { formVals, tabIndex, uploadmodalVisible, attachmentVisible } = this.state;
    console.log(uploadmodalVisible);
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 10 },
        lg: { span: 6 },
      },
    };
    const uploadmodalMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };
    console.log(this.state);
    const attachmentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Card>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row gutter={8}>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CardCode" {...this.formLayout} label="客户ID">
                {getFieldDecorator('CardCode', {
                  rules: [{ required: true, message: '请输入客户名称！' }],
                  initialValue: formVals.CardCode,
                })(
                  <Search
                    placeholder="input search text"
                    onSearch={value => console.log(value)}
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="DocEntry" {...this.formLayout} label="单号">
                {getFieldDecorator('DocEntry', {
                  initialValue: formVals.DocEntry,
                })(<Input disabled placeholder="单号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="CardName" {...this.formLayout} label="客户名称">
                {getFieldDecorator('CardName', {
                  rules: [{ required: true, message: '请输入客户名称！' }],
                  initialValue: formVals.CardName,
                })(
                  <Search
                    placeholder="input search text"
                    onSearch={value => console.log(value)}
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="DocDate" {...this.formLayout} label="单据日期">
                {getFieldDecorator('date-time-picker', { rules: [{ type: 'object' }] })(
                  <DatePicker style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="BankAccount" {...this.formLayout} label="联系人">
                {getFieldDecorator('BankAccount', {
                  rules: [{ required: true, message: '请输入联系人！' }],
                  initialValue: formVals.BankAccount,
                })(
                  <Search
                    placeholder="input search text"
                    onSearch={value => console.log(value)}
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="OrderType" {...this.formLayout} label="订单类型">
                {getFieldDecorator('OrderType', {
                  initialValue: formVals.OrderType,
                })(
                  <Select placeholder="请选择">
                    <Option value="1">正常订单</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="NumAtCard" {...this.formLayout} label="客户参考号">
                {getFieldDecorator('NumAtCard', {
                  initialValue: formVals.NumAtCard,
                })(<Input placeholder="请输入客户参考号" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem key="DocStatus" {...this.formLayout} label="状态">
                <span>{formVals.DocStatus === 'O' ? '未清' : '已清'}</span>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Tabs tabBarExtraContent={this.rightButton(tabIndex)} onChange={this.tabChange}>
          <TabPane tab="物料" key="1">
            <EditableFormTable
              rowChange={this.rowChange}
              rowKey="LineID"
              scroll={{ x: 1800 }}
              columns={this.skuColumns}
              data={formVals.Content.TI_Z02602}
            />
            <Row style={{ marginTop: 20 }} gutter={8}>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="Owner" {...this.formLayout} label="所有人">
                  {getFieldDecorator('Owner', {
                    initialValue: formVals.Owner,
                  })(<Staffs />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="CreateDate" {...this.formLayout} label="创建日期">
                  {getFieldDecorator('CreateDate', {
                    initialValue: formVals.CreateDate,
                  })(<DatePicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="DocTotal" {...this.formLayout} label="销售总计">
                  {getFieldDecorator('DocTotal', {
                    initialValue: formVals.DocTotal,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="InquiryDocTotal" {...this.formLayout} label="询价总计">
                  {getFieldDecorator('InquiryDocTotal', {
                    initialValue: formVals.InquiryDocTotal,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="常规" key="2">
            <Row gutter={8}>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="CellphoneNO" {...this.formLayout} label="联系人手机号码">
                  {getFieldDecorator('CellphoneNO', {
                    initialValue: formVals.CellphoneNO,
                  })(<Input placeholder="手机号码" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="PhoneNO" {...this.formLayout} label="联系人电话">
                  {getFieldDecorator(
                    'PhoneNO',

                    {
                      initialValue: formVals.PhoneNO,
                    }
                  )(<Input placeholder="电话号码" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="Email " {...this.formLayout} label="联系人邮箱">
                  {getFieldDecorator('Email', {
                    rules: [{ validator: this.validatorEmail }],
                    initialValue: formVals.Email,
                  })(<Input placeholder="请输入邮箱" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="DocTotal" {...this.formLayout} label="收货地址">
                  {getFieldDecorator('DocTotal', {
                    initialValue: formVals.DocTotal,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="CompanyCode" {...this.formLayout} label="交易公司">
                  {getFieldDecorator('CompanyCode', {
                    initialValue: formVals.CompanyCode,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="SourceType" {...this.formLayout} label="来源类型">
                  {getFieldDecorator('SourceType', {
                    initialValue: formVals.SourceType,
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      <Option value="1">销售下单</Option>
                      <Option value="2">网站下单</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="Comment" {...this.formLayout} label="备注">
                  {getFieldDecorator('Comment', {
                    initialValue: formVals.Comment,
                  })(<Input placeholder="请输入备注" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="ToDate" {...this.formLayout} label="有效期至">
                  {getFieldDecorator('ToDate', {
                    initialValue: formVals.InquiryDocTotal,
                  })(<DatePicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="CreateUser" {...this.formLayout} label="创建人">
                  <span>创建人</span>
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="InquiryDocTotal" {...this.formLayout} label="主单状态">
                  <span>主单状态</span>
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="Closed" {...this.formLayout} label="关闭状态">
                  <Switch
                    checkedChildren="开"
                    disabled
                    unCheckedChildren="关"
                    checked={formVals.Closed === 'Y'}
                  />
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="ClosedBy " {...this.formLayout} label="关闭人">
                  <span>关闭人</span>
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="附件" key="3">
            <StandardTable
              data={{ list: formVals.Content.TI_Z02603 }}
              rowKey="AttachmentCode"
              columns={this.attachmentColumns}
            />
          </TabPane>
        </Tabs>

        <FooterToolbar>
          <Button type="primary">保存</Button>
        </FooterToolbar>
        <UpdateLoad {...uploadmodalMethods} modalVisible={uploadmodalVisible} />
      </Card>
    );
  }
}

export default InquiryEdit;
