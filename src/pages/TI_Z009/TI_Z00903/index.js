import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Form,
  Input,
  Card,
  Tabs,
  Button,
  message,
  Upload,
  Icon,
  DatePicker,
  Select,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import MDMCommonality from '@/components/Select';
import Brand from '@/components/Brand';
import HSCode from '@/components/HSCode';
import FHSCode from '@/components/FHSCode';
import SPUCode from '@/components/SPUCode';
import Category from '@/components/Category';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ skuDetail, loading, global }) => ({
  skuDetail,
  global,
  loading: loading.models.skuDetail,
}))
@Form.create()
class SKUDetail extends Component {
  Columns = [
    {
      title: '客户代码',
      dataIndex: 'CardCode',
    },
    {
      title: '客户物料代码',
      dataIndex: 'CardItemCode',
    },
    {
      title: '客户物料名称',
      dataIndex: 'CardItemName',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      tabIndex: '1',
      formVals: {
        Code: '',
        Name: '',
        CreateDate: '',
        UpdateDate: '',
        CreateUser: '',
        UpdateUser: '',
        BrandName: '',
        ProductName: '',
        ManufactureNO: '',
        Parameters: '',
        Package: '',
        Purchaser: '',
        PurchaserName: '',
        Unit: '',
        ManLocation: '',
        Category1: '',
        Category2: '',
        Category3: '',
        Cate1Name: '',
        Cate2Name: '',
        Cate3Name: '',
        Putaway: '',
        PutawayDateTime: '',
        InvoiceName: '',
        InvoicePro: '',
        InvoiceMenu: '',
        PicCode: '',
        PicturePath: '',
        ListPiclocation: '',
        HSCode: '',
        FHSCode: '',
        SPUCode: '',
        TI_Z00902List: [],
        TI_Z00903List: [],
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
    if (query.Code) {
      dispatch({
        type: 'skuDetail/fetch',
        payload: {
          Content: {
            Code: query.Code,
          },
        },
      });
    }
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Purchaser'],
        },
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.skuDetail.skuDetailInfo !== prevState.formVals) {
      return {
        formVals: nextProps.skuDetail.skuDetailInfo,
      };
    }
    return null;
  }

  tabChange = tabIndex => {
    this.setState({ tabIndex });
  };

  addSkuDetail = () => {};

  addCompanySKU = () => {};

  rightButton = tabIndex => {
    if (tabIndex === '2') {
      return (
        <Button icon="plus" style={{ marginLeft: 8 }} type="primary" onClick={this.addSkuDetail}>
          添加物料详情
        </Button>
      );
    }
    if (tabIndex === '3') {
      return (
        <Button icon="plus" style={{ marginLeft: 8 }} type="primary" onClick={this.addCompanySKU}>
          添加客户物料代码
        </Button>
      );
    }
    return null;
  };

  // 更新主数据
  updateHandle = () => {
    const { form, dispatch } = this.props;
    const { formVals } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let category;
      if (fieldsValue.address) {
        category = { ...fieldsValue.address };
      }
      delete fieldsValue.category;
      dispatch({
        type: 'skuDetail/update',
        payload: {
          Content: {
            TI_Z00901: [
              {
                ...formVals,
                ...fieldsValue,
                ...category,
                PutawayDateTime: fieldsValue.PutawayDateTime
                  ? fieldsValue.PutawayDateTime.format('YYYY-MM-DD')
                  : '',
              },
            ],
          },
        },
        callback: response => {
          if (response.Status === 200) {
            message.success('更新成功');
          }
        },
      });
    });
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.response.Status === 200) {
      message.success('上传成功');
      const { FilePath, FileCode } = info.file.response;
      const { formVals } = this.state;
      formVals.PicturePath = FilePath;
      formVals.PicCode = FileCode;
      this.setState({
        formVals,
      });
    }
  };

  handleListChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.response.Status === 200) {
      message.success('上传成功');
      const { FilePath } = info.file.response;
      const { formVals } = this.state;
      formVals.ListPiclocation = FilePath;
      this.setState({
        formVals,
      });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      global: { Purchaser },
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
        lg: { span: 6 },
      },
    };
    const UploadButton = props => (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{props.title}</div>
      </div>
    );
    const { tabIndex, formVals } = this.state;
    console.log(formVals);
    return (
      <Card>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row gutter={8}>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="SKU" {...this.formLayout} label="SKU">
                {formVals.Code}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="Name" {...this.formLayout} label="描述">
                {formVals.Name}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="BrandName" {...this.formLayout} label="品牌">
                {getFieldDecorator('BrandName', {
                  rules: [{ required: true, message: '请输入品牌名称！' }],
                  initialValue: formVals.BrandName,
                })(<Brand keyType="Name" initialValue={formVals.BrandName} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="ProductName" {...this.formLayout} label="名称">
                {getFieldDecorator('ProductName', {
                  initialValue: formVals.ProductName,
                })(<Input placeholder="请输入名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="Parameters" {...this.formLayout} label="参数">
                {getFieldDecorator('Parameters', {
                  initialValue: formVals.Parameters,
                })(<Input placeholder="请输入参数" />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="Package" {...this.formLayout} label="包装 ">
                {getFieldDecorator('Package', {
                  initialValue: formVals.Package,
                })(<Input placeholder="请输入包装 " />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="Unit" {...this.formLayout} label="单位">
                {getFieldDecorator('Unit', {
                  initialValue: formVals.Unit,
                })(<Input placeholder="请输入单位" />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="ManLocation" {...this.formLayout} label="产地">
                {getFieldDecorator('ManLocation', {
                  initialValue: formVals.ManLocation,
                })(<Input placeholder="请输入产地" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="Purchaser" {...this.formLayout} label="采购员">
                {getFieldDecorator('Purchaser', {
                  initialValue: formVals.Purchaser,
                })(
                  <MDMCommonality
                    initialValue={formVals.Purchaser}
                    data={Purchaser}
                    placeholder="请输入单位"
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="category" {...this.formLayout} label="分类">
                {getFieldDecorator('category', {
                  initialValue: [formVals.Category1, formVals.Category2, formVals.Category3],
                })(
                  <Category
                    initialValue={[formVals.Category1, formVals.Category2, formVals.Category3]}
                    placeholder="请选择分类"
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="InvoiceName" {...this.formLayout} label="开票名称">
                {getFieldDecorator('InvoiceName', {
                  initialValue: formVals.InvoiceName,
                })(<Input placeholder="请输入开票名称" />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="InvoicePro" {...this.formLayout} label="开票核心规格">
                {getFieldDecorator('InvoicePro', {
                  initialValue: formVals.InvoicePro,
                })(<Input placeholder="请输入开票核心规格" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="InvoiceMenu" {...this.formLayout} label="开票目录分类">
                {getFieldDecorator('InvoiceMenu', {
                  initialValue: formVals.InvoiceMenu,
                })(<Input placeholder="请输入开票名称" />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="HSCode" {...this.formLayout} label="国内海关编码">
                {getFieldDecorator('HSCode', {
                  initialValue: formVals.HSCode,
                })(<HSCode initialValue={formVals.HSCode} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="FHSCode" {...this.formLayout} label="国外海关编码">
                {getFieldDecorator('FHSCode', {
                  initialValue: formVals.FHSCode,
                })(<FHSCode initialValue={formVals.FHSCode} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="SPUCode" {...this.formLayout} label="SPU代码">
                {getFieldDecorator('SPUCode', {
                  initialValue: formVals.SPUCode,
                })(<SPUCode initialValue={formVals.SPUCode} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="Putaway" {...this.formLayout} label="上架状态">
                {getFieldDecorator('Putaway', {
                  initialValue: formVals.Putaway,
                })(
                  <Select style={{ width: '100%' }}>
                    <Option value="1">是</Option>
                    <Option value="2">否</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="PutawayDateTime" {...this.formLayout} label="上架时间">
                {getFieldDecorator('PutawayDateTime', {
                  initialValue: formVals.PutawayDateTime
                    ? moment(formVals.PutawayDateTime, 'YYYY-MM-DD')
                    : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Tabs tabBarExtraContent={this.rightButton(tabIndex)} onChange={this.tabChange}>
          <TabPane tab="图片管理" key="1">
            <Row>
              <Col lg={4}>
                <Upload
                  action="http://117.149.160.231:9301/MDMPicUpload/PictureUpLoad"
                  listType="picture-card"
                  showUploadList={false}
                  onChange={this.handleChange}
                  data={{ UserCode: 'jinwentao', Folder: 'TI_Z026', Tonken: '22233' }}
                >
                  {formVals.PicturePath ? (
                    <img
                      style={{ width: 80, height: 80 }}
                      src={formVals.PicturePath}
                      alt="avatar"
                    />
                  ) : (
                    <UploadButton title="主图" />
                  )}
                </Upload>
              </Col>
              <Col lg={4}>
                <Upload
                  action="http://117.149.160.231:9301/MDMPicUpload/PictureUpLoad"
                  listType="picture-card"
                  showUploadList={false}
                  onChange={this.handleListChange}
                  data={{ UserCode: 'jinwentao', Folder: 'TI_Z026', Tonken: '22233' }}
                >
                  {formVals.ListPiclocation ? (
                    <img
                      style={{ width: 80, height: 80 }}
                      src={formVals.ListPiclocation}
                      alt="avatar"
                    />
                  ) : (
                    <UploadButton title="列表图" />
                  )}
                </Upload>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="详情页" key="2">
            sss
          </TabPane>
          <TabPane tab="客户物料代码" key="3">
            <StandardTable
              data={{ list: formVals.TI_Z00903List }}
              rowKey="AttachmentCode"
              columns={this.Columns}
            />
          </TabPane>
        </Tabs>

        <FooterToolbar>
          <Button type="primary" onClick={this.updateHandle}>
            保存
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}
export default SKUDetail;
