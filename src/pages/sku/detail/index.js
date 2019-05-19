import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
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
import Brand from '@/components/Brand';

const FormItem = Form.Item;
const { TabPane } = Tabs;

/* eslint react/no-multi-comp:0 */
@connect(({ skuDetail, loading }) => ({
  skuDetail,
  loading: loading.models.rule,
}))
@Form.create()
class SKUDetail extends PureComponent {
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
        <Button icon="plus" style={{ marginLeft: 8 }} type="primary">
          添加新附件
        </Button>
      );
    }
    return null;
  };

  render() {
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
        lg: { span: 6 },
      },
    };
    const { tabIndex, formVals } = this.state;
    return (
      <Card>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row gutter={8}>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="SKU" {...this.formLayout} label="SKU">
                {formVals.SKU}
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
                })(<Brand />)}
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
              <FormItem key="Unit" {...this.formLayout} label="采购员">
                {getFieldDecorator('Unit', {
                  initialValue: formVals.Unit,
                })(<Input placeholder="请输入单位" />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="ManLocation" {...this.formLayout} label="分类">
                {getFieldDecorator('ManLocation', {
                  initialValue: formVals.ManLocation,
                })(<Input placeholder="请输入产地" />)}
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
                })(<Input placeholder="请输入名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="FHSCode" {...this.formLayout} label="国外海关编码">
                {getFieldDecorator('FHSCode', {
                  initialValue: formVals.FHSCode,
                })(<Input placeholder="请输入名称" />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="SPUCode" {...this.formLayout} label="SPU代码">
                {getFieldDecorator('SPUCode', {
                  initialValue: formVals.SPUCode,
                })(<Input placeholder="请输入名称" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Tabs tabBarExtraContent={this.rightButton(tabIndex)} onChange={this.tabChange}>
          <TabPane tab="详情页" key="1">
            sss
          </TabPane>
          <TabPane tab="客户物料代码" key="2">
            <StandardTable
              data={{ list: formVals.TI_Z00903List }}
              rowKey="AttachmentCode"
              columns={this.Columns}
            />
          </TabPane>
        </Tabs>

        <FooterToolbar>
          <Button type="primary">保存</Button>
        </FooterToolbar>
      </Card>
    );
  }
}
export default SKUDetail;
