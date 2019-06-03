/* eslint-disable no-restricted-globals */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-script-url */
import React, { Fragment } from 'react';
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
  Modal,
  message,
  DatePicker,
  Popconfirm,
  Select,
} from 'antd';
import moment from 'moment';
import round from 'lodash/round';
import router from 'umi/router';
import CancelOrder from '@/components/Modal/CancelOrder';
import MDMCommonality from '@/components/Select';
import StandardTable from '@/components/StandardTable';
import EditableFormTable from '@/components/EditableFormTable';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import UpdateLoad from '../../TI_Z026/components/modal';
import SKUModal from '@/components/Modal/SKU';
import Brand from '@/components/Brand';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import SupplierSelect from '@/components/Select/Supplier';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;
@connect(({ supplierAskDetail, loading, global }) => ({
  supplierAskDetail,
  global,
  updateloading: loading.effects['supplierAskDetail/update'],
}))
@Form.create()
class InquiryEdit extends React.Component {
  skuColumns = [
    {
      title: '行号',
      dataIndex: 'LineID',
      fixed: 'left',
      width: 50,
      align: 'center',
      render: (text, record) => (record.lastIndex ? '合计' : text),
    },
    {
      title: 'SKU',
      dataIndex: 'SKU',
      align: 'center',
      width: 80,
      render: (text, record, index) =>
        record.lastIndex ? null : (
          <Input
            value={record.SKU}
            placeholder="选择SKU"
            onClick={() => {
              this.focusLine(record, index);
            }}
          />
        ),
    },
    {
      title: '产品描述',
      dataIndex: 'SKUName',
      width: 200,
      align: 'center',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '品牌',
      width: 100,
      align: 'center',
      dataIndex: 'BrandName',
      render: (text, record, index) =>
        record.lastIndex ? null : (
          <Brand
            initialValue={record.BrandName}
            keyType="Name"
            onChange={value => {
              this.rowSelectChange(value, record, index, 'BrandName');
            }}
          />
        ),
    },
    {
      title: '名称',
      dataIndex: 'ProductName',
      inputType: 'textArea',
      width: 100,
      editable: true,
      align: 'center',
    },
    {
      title: '型号',
      width: 130,
      dataIndex: 'ManufactureNO',
      inputType: 'textArea',
      editable: true,
      align: 'center',
    },
    {
      title: '参数',
      width: 130,
      dataIndex: 'Parameters',
      inputType: 'textArea',
      editable: true,
      align: 'center',
    },
    {
      title: '包装',
      width: 100,
      dataIndex: 'Package',
      inputType: 'textArea',
      editable: true,
      align: 'center',
    },
    {
      title: '数量',
      width: 80,
      inputType: 'text',
      dataIndex: 'Quantity',
      editable: true,
      align: 'center',
    },
    {
      title: '单位',
      width: 80,
      inputType: 'text',
      dataIndex: 'Unit',
      editable: true,
      align: 'center',
    },
    {
      title: '要求交期',
      width: 120,
      inputType: 'date',
      dataIndex: 'DueDate',
      editable: true,
      align: 'center',
    },
    {
      title: '价格',
      width: 100,
      inputType: 'text',
      dataIndex: 'Price',
      editable: true,
      align: 'center',
    },
    {
      title: '询价交期',
      width: 120,
      inputType: 'date',
      dataIndex: 'InquiryDueDate',
      editable: true,
      align: 'center',
    },
    {
      title: '行备注',
      dataIndex: 'LineComment',
      inputType: 'textArea',
      width: 100,
      editable: true,
      align: 'center',
    },
    {
      title: '采总计',
      width: 120,
      align: 'center',
      dataIndex: 'LineTotal',
    },
    {
      title: '本币总计',
      width: 100,
      align: 'center',
      dataIndex: 'InquiryLineTotalLocal',
    },
    {
      title: '客询价单',
      width: 100,
      align: 'center',
      dataIndex: 'BaseEntry',
    },
    {
      title: '客询价行',
      width: 100,
      align: 'center',
      dataIndex: 'BaseLineID',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 80,
      render: (text, record, index) =>
        record.lastIndex ? null : (
          <Fragment>
            <Icon
              title="预览"
              type="eye"
              onClick={() => this.lookLineAttachment(record, index)}
              style={{ color: '#08c', marginRight: 5 }}
            />
            <Icon
              title="上传附件"
              className="icons"
              style={{ color: '#08c', marginRight: 5, marginLeft: 5 }}
              type="cloud-upload"
              onClick={() => this.skuLineAttachment(record, index)}
            />
            <Popconfirm
              title="确定要删除吗？(更新后有效)"
              onConfirm={() => this.deleteSKULine(record, index)}
              okText="删除"
              cancelText="取消"
            >
              <Icon title="删除行" className="icons" type="delete" theme="twoTone" />
            </Popconfirm>
          </Fragment>
        ),
    },
  ];

  attachmentColumns = [
    {
      title: '序号',
      width: 80,
      align: 'center',
      dataIndex: 'LineID',
    },
    {
      title: '来源类型',
      align: 'center',
      dataIndex: 'BaseType',
      render: text => <span>{text === '1' ? '正常订单' : '未知'}</span>,
    },
    {
      title: '来源单号',
      align: 'center',
      dataIndex: 'BaseEntry',
    },
    {
      title: '附件代码',
      align: 'center',
      dataIndex: 'AttachmentCode',
    },
    {
      title: '附件描述',
      align: 'center',
      dataIndex: 'AttachmentName',
    },
    {
      title: '附件路径',
      align: 'center',
      dataIndex: 'AttachmentPath',
      render: text => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>,
    },

    {
      title: '操作',
      align: 'center',
      render: (text, record, index) => (
        <Fragment>
          <a target="_blnk" href={record.AttachmentPath}>
            <Icon title="预览" type="eye" style={{ color: '#08c', marginRight: 5 }} />
          </a>
          <Icon
            title="删除行"
            type="delete"
            theme="twoTone"
            onClick={() => this.deleteLine(record, index)}
          />
        </Fragment>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      formVals: {}, // 单据信息
      tabIndex: '1', // tab
      uploadmodalVisible: false, // 上传Modal
      attachmentVisible: false, // 附件Modal
      skuModalVisible: false, // 物料选择 Modal
      LineID: Number, // 当前选中行index
      linkmanList: [], // 联系人list
      thisLine: {
        // 当前行
        TI_Z02704: [],
      },
    };
    this.formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.DocEntry) {
      dispatch({
        type: 'supplierAskDetail/fetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
          },
        },
      });
    }
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Company', 'Purchaser', 'Curr', 'WhsCode'],
        },
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAskDetail/save',
      payload: {
        supplierAskDetailInfo: {
          Comment: '',
          SourceType: '',
          OrderType: '',
          DocDate: null,
          CreateDate: null,
          CardCode: '',
          CardName: '',
          UserID: '1',
          Contacts: '',
          CellphoneNO: '',
          PhoneNO: '',
          Email: '',
          CompanyCode: '',
          ToDate: null,
          InquiryDocTotal: '',
          DocTotal: '',
          NumAtCard: '',
          Owner: '',
          IsInquiry: '',
          TI_Z02702: [],
          TI_Z02703: [],
        },
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.supplierAskDetail.supplierAskDetailInfo !== prevState.formVals ||
      nextProps.supplierAskDetail.linkmanList !== prevState.linkmanList
    ) {
      return {
        formVals: nextProps.supplierAskDetail.supplierAskDetailInfo,
        linkmanList: nextProps.supplierAskDetail.linkmanList,
      };
    }
    return null;
  }

  //  行内容改变
  rowChange = record => {
    const { formVals } = this.state;
    formVals.TI_Z02702.map(item => {
      if (item.key === record.key) {
        return record;
      }
      return item;
    });
    this.setState({ formVals }, () => {
      this.getTotal();
    });
  };

  //  计算总计
  getTotal = () => {
    const { formVals } = this.state;
    let InquiryDocTotalLocal = 0;
    let InquiryDocTotal = 0;
    // eslint-disable-next-line array-callback-return
    formVals.TI_Z02702.map(record => {
      record.LineTotal = isNaN(record.Quantity * record.Price) ? 0 : record.Quantity * record.Price;
      record.LineTotal = round(record.LineTotal, 2);
      record.InquiryLineTotalLocal = isNaN(record.Quantity * record.Price * formVals.DocRate)
        ? 0
        : record.Quantity * record.Price * formVals.DocRate;
      record.InquiryLineTotalLocal = round(record.InquiryLineTotalLocal, 2);
      InquiryDocTotalLocal += record.InquiryLineTotalLocal;
      InquiryDocTotal += record.LineTotal;
    });

    formVals.InquiryDocTotalLocal = round(InquiryDocTotalLocal, 2);
    formVals.InquiryDocTotal = round(InquiryDocTotal, 2);
    this.setState({ formVals });
  };

  // 品牌,仓库改变

  rowSelectChange = (value, record, index, key) => {
    const { formVals } = this.state;
    record[key] = value;
    formVals.TI_Z02702[index] = record;
    this.setState({ formVals: { ...formVals } });
  };

  // sku输入框获取焦点
  focusLine = (record, LineID) => {
    this.setState({ thisLine: { ...record }, LineID, skuModalVisible: true });
  };

  // 物料弹出返回
  changeLineSKU = selection => {
    const [select] = selection;
    const { BrandName, ManufactureNO, Name, Package, Parameters, ProductName, Unit, Code } = select;
    const { thisLine, LineID, formVals } = this.state;
    formVals.TI_Z02702[LineID] = {
      ...thisLine,
      SKU: Code,
      SKUName: Name,
      BrandName,
      ManufactureNO,
      Package,
      Parameters,
      ProductName,
      Unit,
    };
    this.setState({ formVals: { ...formVals } });
    this.handleModalVisible(false);
  };

  // 删除附件
  deleteLine = (record, index) => {
    const { formVals, LineID } = this.state;
    if (LineID >= 0) {
      formVals.TI_Z02702[LineID].TI_Z02704.splice(index, 1);
    } else {
      formVals.TI_Z02703.splice(index, 1);
    }
    this.setState({ formVals: { ...formVals } });
  };

  // 行物料附件弹窗显隐
  skuLineAttachment = (record, index) => {
    this.setState({ LineID: index, uploadmodalVisible: true });
  };

  // 查看行物料

  lookLineAttachment = (record, index) => {
    this.setState({ LineID: index, attachmentVisible: true, thisLine: { ...record } });
  };

  // 删除行物料
  deleteSKULine = (record, index) => {
    const { formVals } = this.state;
    formVals.TI_Z02702.splice(index, 1);
    this.setState({ formVals }, () => {
      this.getTotal();
    });
  };

  // 获取上传成功附件，插入到对应数组
  handleSubmit = fieldsValue => {
    const { AttachmentPath, AttachmentCode, AttachmentName } = fieldsValue;
    const { formVals, LineID } = this.state;
    const lastsku = formVals.TI_Z02703[formVals.TI_Z02703.length - 1];
    if (fieldsValue.AttachmentPath) {
      if (LineID >= 0) {
        const thisLine = formVals.TI_Z02702[LineID].TI_Z02704;
        const last = thisLine[thisLine.length - 1];
        const ID = last ? last.LineID + 1 : 1;
        formVals.TI_Z02702[LineID].TI_Z02704.push({
          LineID: ID,
          BaseType: formVals.OrderType,
          BaseEntry: formVals.BaseEntry ? formVals.BaseEntry : 1,
          BaseLineID: last ? last.BaseLineID + 1 : 1,
          AttachmentPath,
          AttachmentCode,
          AttachmentName,
        });
      } else {
        formVals.TI_Z02703.push({
          LineID: lastsku ? lastsku.LineID + 1 : 1,
          BaseType: formVals.OrderType,
          BaseEntry: formVals.BaseEntry ? formVals.BaseEntry : 1,
          BaseLineID: lastsku ? lastsku.BaseLineID + 1 : 1,
          AttachmentPath,
          AttachmentCode,
          AttachmentName,
        });
      }
      this.setState({ formVals: { ...formVals } });
    }
    this.handleModalVisible(false);
  };

  // 弹窗隐藏
  handleModalVisible = flag => {
    this.setState({
      uploadmodalVisible: !!flag,
      attachmentVisible: !!flag,
      skuModalVisible: !!flag,
      LineID: Number,
    });
  };

  // change tab
  tabChange = tabIndex => {
    this.setState({ tabIndex });
  };

  rightButton = tabIndex => {
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

  // change 供应商
  changeCompany = company => {
    const { TI_Z00602List } = company;
    const { formVals } = this.state;
    formVals.CardCode = company.Code || company.key;
    formVals.CardName = company.Name || company.label;
    this.setState({ formVals, linkmanList: TI_Z00602List || [] });
  };

  // 联系人change
  linkmanChange = value => {
    const { formVals, linkmanList } = this.state;
    const select = linkmanList.find(item => {
      return item.LineID === value;
    });
    const { CellphoneNO, Email, PhoneNO, UserID, Name } = select;
    Object.assign(formVals, { CellphoneNO, Email, PhoneNO, UserID, Contacts: Name });
    this.setState({ formVals });
  };

  // 更新主数据
  updateHandle = () => {
    const { form, dispatch } = this.props;
    const { formVals } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      delete fieldsValue.CardCode;
      delete fieldsValue.CardName;
      dispatch({
        type: 'supplierAskDetail/update',
        payload: {
          Content: {
            ...formVals,
            ...fieldsValue,
            ToDate: fieldsValue.ToDate ? fieldsValue.ToDate.format('YYYY-MM-DD') : '',
            DocDate: fieldsValue.DocDate ? fieldsValue.DocDate.format('YYYY-MM-DD') : '',
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('更新成功');
            dispatch({
              type: 'supplierAskDetail/fetch',
              payload: {
                Content: {
                  DocEntry: formVals.DocEntry,
                },
              },
            });
          }
        },
      });
    });
  };

  // 取消单据

  cancelSubmit = ClosedComment => {
    const { dispatch } = this.props;
    const {
      formVals: { DocEntry },
    } = this.state;
    dispatch({
      type: 'supplierAskDetail/cancel',
      payload: {
        Content: {
          DocEntry,
          ClosedComment,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('取消成功');
        }
      },
    });
  };

  // 币种修改
  currencyChange = Currency => {
    const { formVals } = this.state;
    const { dispatch } = this.props;
    formVals.Currency = Currency;
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Rate'],
          key: Currency,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          formVals.DocRate = response.Content.DropdownData.Rate[0]
            ? response.Content.DropdownData.Rate[0].Value
            : '';
          this.setState({ formVals: { ...formVals } }, () => {
            this.getTotal();
          });
        }
      },
    });
    this.setState({ formVals });
  };

  render() {
    const {
      form: { getFieldDecorator },
      global: { Purchaser, Curr, Company },
    } = this.props;
    const {
      formVals,
      tabIndex,
      thisLine,
      linkmanList,
      uploadmodalVisible,
      skuModalVisible,
      attachmentVisible,
    } = this.state;
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

    const parentMethods = {
      handleSubmit: this.changeLineSKU,
      handleModalVisible: this.handleModalVisible,
    };
    const newdata = [...formVals.TI_Z02702];
    if (newdata.length > 0) {
      newdata.push({
        LineID: newdata[newdata.length - 1].LineID + 1,
        lastIndex: true,
        LineTotal: formVals.InquiryDocTotal,
        InquiryLineTotalLocal: formVals.InquiryDocTotalLocal,
      });
    }
    return (
      <Card bordered={false}>
        <Form {...formItemLayout}>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="CardCode" {...this.formLayout} label="供应商ID">
                {getFieldDecorator('CardCode', {
                  rules: [{ required: true, message: '请选择供应商！' }],
                  initialValue: { key: formVals.CardName, label: formVals.CardCode },
                })(
                  <SupplierSelect
                    initialValue={{ key: formVals.CardName, label: formVals.CardCode }}
                    onChange={this.changeCompany}
                    keyType="Code"
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="DocEntry" {...this.formLayout} label="单号">
                {getFieldDecorator('DocEntry', {
                  initialValue: formVals.DocEntry,
                })(<Input disabled placeholder="单号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="CardName" {...this.formLayout} label="供应商名称">
                {getFieldDecorator('CardName', {
                  rules: [{ required: true, message: '请输入供应商名称！' }],
                  initialValue: formVals.CardCode,
                })(
                  <SupplierSelect
                    initialValue={{ key: formVals.CardCode, label: formVals.CardName }}
                    onChange={this.changeCompany}
                    keyType="Name"
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="DocDate" {...this.formLayout} label="单据日期">
                {getFieldDecorator('DocDate', {
                  rules: [{ required: true, message: '请选择单据日期！' }],
                  initialValue: formVals.DocDate ? moment(formVals.DocDate, 'YYYY-MM-DD') : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="ContactsID" {...this.formLayout} label="联系人">
                {getFieldDecorator('ContactsID', {
                  rules: [{ required: true, message: '请输入联系人！' }],
                  initialValue: formVals.ContactsID,
                })(
                  <Select
                    placeholder="请选择联系人"
                    onSelect={this.linkmanChange}
                    style={{ width: '100%' }}
                  >
                    {linkmanList.map(option => (
                      <Option key={option.LineID} value={option.LineID}>
                        {option.Name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="Currency" {...this.formLayout} label="币种">
                {getFieldDecorator('Currency', {
                  initialValue: formVals.Currency,
                  rules: [{ required: true, message: '请选择币种！' }],
                })(
                  <MDMCommonality
                    onChange={this.currencyChange}
                    initialValue={formVals.Currency}
                    data={Curr}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="NumAtCard" {...this.formLayout} label="参考号">
                {getFieldDecorator('NumAtCard', {
                  initialValue: formVals.NumAtCard,
                })(<Input placeholder="请输入供应商参考号" />)}
              </FormItem>
            </Col>
            <Col lg={10} md={12} sm={24}>
              <FormItem key="DocRate" {...this.formLayout} label="汇率">
                <span>{formVals.DocRate}</span>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Tabs tabBarExtraContent={this.rightButton(tabIndex)} onChange={this.tabChange}>
          <TabPane tab="物料" key="1">
            <EditableFormTable
              rowChange={this.rowChange}
              rowKey="LineID"
              scroll={{ x: 2100 }}
              columns={this.skuColumns}
              data={newdata}
            />
            <Row style={{ marginTop: 20 }} gutter={8}>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="Owner" {...this.formLayout} label="采购员">
                  {getFieldDecorator('Owner', {
                    initialValue: formVals.Owner,
                    rules: [{ required: true, message: '请选择采购员！' }],
                  })(<MDMCommonality initialValue={formVals.Owner} data={Purchaser} />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="CreateDate" {...this.formLayout} label="创建日期">
                  <span>{moment(formVals.CreateDate).format('YYYY-MM-DD')}</span>
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="常规" key="2">
            <Row className="rowFlex" gutter={8}>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="CellphoneNO" {...this.formLayout} label="手机号码">
                  {getFieldDecorator('CellphoneNO', {
                    initialValue: formVals.CellphoneNO,
                  })(<Input placeholder="联系人手机号码" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem key="PhoneNO" {...this.formLayout} label="联系人电话">
                  {getFieldDecorator('PhoneNO', {
                    initialValue: formVals.PhoneNO,
                  })(<Input placeholder="电话号码" />)}
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
                <FormItem key="CompanyCode" {...this.formLayout} label="交易公司">
                  {getFieldDecorator('CompanyCode', {
                    initialValue: formVals.CompanyCode,
                    rules: [{ required: true, message: '请选择交易公司！' }],
                  })(<MDMCommonality initialValue={formVals.CompanyCode} data={Company} />)}
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
                    initialValue: formVals.ToDate ? moment(formVals.ToDate, 'YYYY-MM-DD') : null,
                  })(<DatePicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="附件" key="3">
            <StandardTable
              data={{ list: formVals.TI_Z02703 }}
              rowKey="LineID"
              columns={this.attachmentColumns}
            />
          </TabPane>
        </Tabs>

        <FooterToolbar>
          <CancelOrder cancelSubmit={this.cancelSubmit} />
          <Button
            icon="plus"
            style={{ marginLeft: 8 }}
            type="primary"
            onClick={() => router.push('/purchase/TI_Z027/edit')}
          >
            新建
          </Button>
          <Button
            style={{ marginLeft: 10, marginRight: 10 }}
            onClick={this.updateHandle}
            type="primary"
          >
            更新
          </Button>
        </FooterToolbar>
        <UpdateLoad {...uploadmodalMethods} modalVisible={uploadmodalVisible} />
        <SKUModal {...parentMethods} modalVisible={skuModalVisible} />
        <Modal
          width={640}
          destroyOnClose
          title="物料行附件"
          visible={attachmentVisible}
          onOk={() => this.handleModalVisible(false)}
          onCancel={() => this.handleModalVisible(false)}
        >
          <StandardTable
            data={{ list: thisLine.TI_Z02704 }}
            rowKey="LineID"
            columns={this.attachmentColumns}
          />
        </Modal>
      </Card>
    );
  }
}

export default InquiryEdit;
