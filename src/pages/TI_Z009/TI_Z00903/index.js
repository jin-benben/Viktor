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
  DatePicker,
  Select,
  Modal,
  Radio,
} from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import ClientAsk from '@/components/Order/TI_Z026';
import SupplierAsk from '@/components/Order/TI_Z027';
import OdlnordnFetch from '@/components/Order/OdlnordnFetch';
import OinvorinFetch from '@/components/Order/OinvorinFetch';
import OrderFetch from '@/components/Order/OrderFetch';
import MDMCommonality from '@/components/Select';
import Brand from '@/components/Brand';
import HSCode from '@/components/HSCode';
import FHSCode from '@/components/FHSCode';
import SPUCode from '@/components/SPUCode';
import Upload from '@/components/Upload';
import UEditor from '@/components/Ueditor';
import { getName } from '@/utils/utils';

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
      skuDetailInfo: {
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
      activeKey: '',
      DetailCode: '',
      modalVisible: false,
    };
    this.formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
  }

  componentDidMount() {
    const {
      dispatch,
      global: { BrandList, CategoryTree },
    } = this.props;

    if (!BrandList.length) {
      dispatch({
        type: 'global/getBrand',
      });
    }
    if (!CategoryTree.length) {
      dispatch({
        type: 'global/getCategory',
      });
    }
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Purchaser', 'TI_Z042', 'TI_Z01802'],
          Key: '5',
        },
      },
    });
    dispatch({
      type: 'skuDetail/fetchcode',
    });
    this.getDetail();
  }

  changePicture = ({ FilePath, FileCode, FilePathX }) => {
    const { skuDetailInfo } = this.state;
    Object.assign(skuDetailInfo, {
      PicturePath: FilePath,
      PicCode: FileCode,
      ListPiclocation: FilePathX,
    });
  };

  getDetail = () => {
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
        callback: response => {
          if (response && response.Status === 200) {
            this.setState({
              skuDetailInfo: response.Content,
              activeKey: response.Content.TI_Z00903List.length
                ? response.Content.TI_Z00903List[0].DetailCode
                : '',
            });
          }
        },
      });
    }
  };

  detailOnChange = activeKey => {
    this.setState({
      activeKey,
    });
  };

  detailOnEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    this.setState({
      modalVisible: true,
    });
  };

  addTabne = () => {
    const { DetailCode, skuDetailInfo } = this.state;
    const { Code, TI_Z00903List } = skuDetailInfo;
    const OrderById = TI_Z00903List.length
      ? TI_Z00903List[TI_Z00903List.length - 1].OrderById + 1
      : 1;
    this.setState({
      modalVisible: false,
      activeKey: DetailCode,
      skuDetailInfo: {
        ...skuDetailInfo,
        TI_Z00903List: [
          ...TI_Z00903List,
          {
            Code,
            OrderById,
            DetailCode,
            Detail: '',
          },
        ],
      },
    });
  };

  radioOnChange = e => {
    this.setState({
      DetailCode: e.target.value,
    });
  };

  remove = targetKey => {
    const { skuDetailInfo } = this.state;
    const { TI_Z00903List } = skuDetailInfo;
    const newArr = TI_Z00903List.filter(item => item.DetailCode !== targetKey);
    this.setState({
      skuDetailInfo: {
        ...skuDetailInfo,
        TI_Z00903List: newArr,
      },
    });
  };

  detailChange = Detail => {
    const { activeKey, skuDetailInfo } = this.state;
    const { TI_Z00903List } = skuDetailInfo;
    const newArr = TI_Z00903List.map(item => {
      const newItem = item;
      if (item.DetailCode === activeKey) {
        newItem.Detail = Detail;
        return newItem;
      }
      return item;
    });
    this.setState({
      skuDetailInfo: {
        ...skuDetailInfo,
        TI_Z00903List: newArr,
      },
    });
  };

  updateDetailHandle = () => {
    const { dispatch } = this.props;
    const {
      skuDetailInfo: { Code, TI_Z00903List },
    } = this.state;
    dispatch({
      type: 'skuDetail/updateDetail',
      payload: {
        Content: {
          Code,
          TI_Z00903: [...TI_Z00903List],
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('更新成功');
          this.getDetail();
        }
      },
    });
  };

  // 更新主数据
  updateHandle = () => {
    const { form, dispatch } = this.props;
    const { skuDetailInfo } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const sHSCode = fieldsValue.HSCode.Code || skuDetailInfo.HSCode;
      // eslint-disable-next-line no-param-reassign
      delete fieldsValue.HSCode;
      dispatch({
        type: 'skuDetail/update',
        payload: {
          Content: {
            TI_Z00901: [
              {
                ...skuDetailInfo,
                ...fieldsValue,
                HSCode: sHSCode,
                PutawayDateTime: fieldsValue.PutawayDateTime
                  ? fieldsValue.PutawayDateTime.format('YYYY-MM-DD')
                  : '',
              },
            ],
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('更新成功');
            this.getDetail();
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
      const { skuDetailInfo } = this.state;
      skuDetailInfo.PicturePath = FilePath;
      skuDetailInfo.PicCode = FileCode;
      this.setState({
        skuDetailInfo,
      });
    }
  };

  // spu change
  SPUCodeChange = select => {
    const { Code, Cate1Name, Cate2Name, Cate3Name, Category1, Category2, Category3 } = select;
    const { skuDetailInfo } = this.state;
    Object.assign(skuDetailInfo, {
      SPUCode: Code,
      Cate1Name,
      Cate2Name,
      Cate3Name,
      Category1,
      Category2,
      Category3,
    });
    this.setState({ skuDetailInfo: { ...skuDetailInfo } });
  };

  handleListChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.response.Status === 200) {
      message.success('上传成功');
      const { FilePath } = info.file.response;
      const { skuDetailInfo } = this.state;
      skuDetailInfo.ListPiclocation = FilePath;
      this.setState({
        skuDetailInfo,
      });
    }
  };

  colseModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      global: { Purchaser, TI_Z042, TI_Z01802 },
      skuDetail: { spuList, fhscodeList, hscodeList },
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

    const { skuDetailInfo, activeKey, modalVisible, DetailCode } = this.state;

    return (
      <Card bordered={false}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row gutter={8}>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="SKU" {...this.formLayout} label="SKU">
                {skuDetailInfo.Code}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="Name" {...this.formLayout} label="描述">
                {skuDetailInfo.Name}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="BrandName" {...this.formLayout} label="品牌">
                {getFieldDecorator('BrandName', {
                  rules: [{ required: true, message: '请输入品牌名称！' }],
                  initialValue: skuDetailInfo.BrandName,
                })(<Brand keyType="Name" initialValue={skuDetailInfo.BrandName} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="ProductName" {...this.formLayout} label="名称">
                {getFieldDecorator('ProductName', {
                  initialValue: skuDetailInfo.ProductName,
                })(<Input placeholder="请输入名称" />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="Parameters" {...this.formLayout} label="参数">
                {getFieldDecorator('Parameters', {
                  initialValue: skuDetailInfo.Parameters,
                })(<Input placeholder="请输入参数" />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="ManufactureNO" {...this.formLayout} label="型号">
                {getFieldDecorator('ManufactureNO', {
                  initialValue: skuDetailInfo.ManufactureNO,
                })(<Input placeholder="请输入型号" />)}
              </FormItem>
            </Col>

            <Col lg={12} md={12} sm={24}>
              <FormItem key="Package" {...this.formLayout} label="包装 ">
                {getFieldDecorator('Package', {
                  initialValue: skuDetailInfo.Package,
                })(<Input placeholder="请输入包装 " />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="Unit" {...this.formLayout} label="单位">
                {getFieldDecorator('Unit', {
                  initialValue: skuDetailInfo.Unit,
                })(<Input placeholder="请输入单位" />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="ManLocation" {...this.formLayout} label="产地">
                {getFieldDecorator('ManLocation', {
                  initialValue: skuDetailInfo.ManLocation,
                })(<MDMCommonality data={TI_Z042} initialValue={skuDetailInfo.ManLocation} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="Purchaser" {...this.formLayout} label="采购员">
                {getFieldDecorator('Purchaser', {
                  initialValue: skuDetailInfo.Purchaser,
                })(
                  <MDMCommonality
                    initialValue={skuDetailInfo.Purchaser}
                    data={Purchaser}
                    placeholder="请输入单位"
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="category" {...this.formLayout} label="分类">
                <span>{`${skuDetailInfo.Cate1Name}/${skuDetailInfo.Cate2Name}/${
                  skuDetailInfo.Cate3Name
                }`}</span>
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="InvoiceName" {...this.formLayout} label="开票名称">
                {getFieldDecorator('InvoiceName', {
                  initialValue: skuDetailInfo.InvoiceName,
                })(<Input placeholder="请输入开票名称" />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="InvoicePro" {...this.formLayout} label="开票核心规格">
                {getFieldDecorator('InvoicePro', {
                  initialValue: skuDetailInfo.InvoicePro,
                })(<Input placeholder="请输入开票核心规格" />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="InvoiceMenu" {...this.formLayout} label="开票目录分类">
                {getFieldDecorator('InvoiceMenu', {
                  initialValue: skuDetailInfo.InvoiceMenu,
                })(<Input placeholder="请输入开票名称" />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="HSCode" {...this.formLayout} label="国内海关编码">
                {getFieldDecorator('HSCode', {
                  initialValue: skuDetailInfo.HSCode,
                })(<HSCode data={hscodeList} initialValue={skuDetailInfo.HSCode} />)}
              </FormItem>
            </Col>

            <Col lg={12} md={12} sm={24}>
              <FormItem key="FHSCode" {...this.formLayout} label="国外海关编码">
                {getFieldDecorator('FHSCode', {
                  initialValue: skuDetailInfo.FHSCode,
                })(<FHSCode data={fhscodeList} initialValue={skuDetailInfo.FHSCode} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="SPUCode" {...this.formLayout} label="SPU代码">
                {getFieldDecorator('SPUCode', {
                  initialValue: skuDetailInfo.SPUCode,
                })(
                  <SPUCode
                    onChange={this.SPUCodeChange}
                    data={spuList}
                    initialValue={skuDetailInfo.SPUCode}
                  />
                )}
              </FormItem>
            </Col>

            <Col lg={12} md={12} sm={24}>
              <FormItem key="Putaway" {...this.formLayout} label="上架状态">
                {getFieldDecorator('Putaway', {
                  initialValue: skuDetailInfo.Putaway,
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
                  initialValue: skuDetailInfo.PutawayDateTime
                    ? moment(skuDetailInfo.PutawayDateTime, 'YYYY-MM-DD')
                    : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="EnglishName" {...this.formLayout} label="外文名称">
                {getFieldDecorator('EnglishName', {
                  initialValue: skuDetailInfo.EnglishName,
                })(<Input placeholder="请输入外文名称" />)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <FormItem key="ForeignParameters" {...this.formLayout} label="规格(外)">
                {getFieldDecorator('ForeignParameters', {
                  initialValue: skuDetailInfo.ForeignParameters,
                })(<Input placeholder="请输入规格(外)" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Tabs animated={false}>
          <TabPane tab="图片管理" key="1">
            <Row>
              <Col lg={4}>
                <Upload
                  onChange={this.changePicture}
                  type="MDM"
                  Folder="TI_Z009"
                  title="主图"
                  initialValue={skuDetailInfo.PicturePath}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="详情页" key="2">
            <Tabs
              onChange={this.detailOnChange}
              activeKey={activeKey}
              type="editable-card"
              onEdit={this.detailOnEdit}
            >
              {skuDetailInfo.TI_Z00903List.map(pane => (
                <TabPane tab={getName(TI_Z01802, pane.DetailCode)} key={pane.DetailCode}>
                  <UEditor onBlur={this.detailChange} initialValue={pane.Detail} />
                </TabPane>
              ))}
            </Tabs>
          </TabPane>
          {/* <TabPane tab="客户物料代码" key="3">
            <StandardTable
              data={{ list: skuDetailInfo.TI_Z00903List }}
              rowKey="AttachmentCode"
              columns={this.Columns}
            />
          </TabPane> */}
          <TabPane tab="客户询价单" key="4">
            {skuDetailInfo.Name ? <ClientAsk QueryType="2" QueryKey={skuDetailInfo.Code} /> : ''}
          </TabPane>
          <TabPane tab="采购询价单" key="5">
            {skuDetailInfo.Name ? <SupplierAsk QueryType="2" QueryKey={skuDetailInfo.Code} /> : ''}
          </TabPane>
          <TabPane tab="销售订单物料查询" key="6">
            {skuDetailInfo.Name ? <OrderFetch QueryType="3" QueryKey={skuDetailInfo.Code} /> : ''}
          </TabPane>
          <TabPane tab="交货退货物料查询" key="7">
            {skuDetailInfo.Name ? (
              <OdlnordnFetch QueryType="3" QueryKey={skuDetailInfo.Code} />
            ) : (
              ''
            )}
          </TabPane>
          <TabPane tab="发票贷项物料查询" key="8">
            {skuDetailInfo.Name ? (
              <OinvorinFetch QueryType="3" QueryKey={skuDetailInfo.Code} />
            ) : (
              ''
            )}
          </TabPane>
        </Tabs>

        <FooterToolbar>
          <Button type="primary" onClick={this.updateHandle}>
            更新主数据
          </Button>
          <Button type="primary" onClick={this.updateDetailHandle}>
            更新详情
          </Button>
        </FooterToolbar>
        <Modal
          width={960}
          destroyOnClose
          maskClosable={false}
          title="选择类型"
          onCancel={this.colseModal}
          onOk={this.addTabne}
          visible={modalVisible}
        >
          <Radio.Group onChange={this.radioOnChange} value={DetailCode}>
            {TI_Z01802.map(item => (
              <Radio key={item.Key} value={item.Key}>
                {item.Value}
              </Radio>
            ))}
          </Radio.Group>
        </Modal>
      </Card>
    );
  }
}
export default SKUDetail;
