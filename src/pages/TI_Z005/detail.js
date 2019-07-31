/* eslint-disable no-script-url */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Tabs, message } from 'antd';
import Link from 'umi/link';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import BrandSku from './components/sku';
import BrandSupplier from './components/supplier';
import ClientAsk from '@/components/Order/TI_Z026';
import SupplierAsk from '@/components/Order/TI_Z027';
import OdlnordnFetch from '@/components/Order/OdlnordnFetch';
import OinvorinFetch from '@/components/Order/OinvorinFetch';
import OrderFetch from '@/components/Order/OrderFetch';
import Attach from '@/components/Attachment/other';
import MyPageHeader from './components/pageHeader';
import { getName } from '@/utils/utils';
import { brandLevel } from '@/utils/publicData';

const { TabPane } = Tabs;

const { Description } = DescriptionList;

@connect(({ brands, loading, global }) => ({
  brands,
  global,
  loading: loading.models.brands,
}))
@Form.create()
class BrandDetail extends PureComponent {
  supplierColumns = [
    {
      title: '供应商ID',
      dataIndex: 'Code',
      align: 'center',
      render: text => (
        <Link target="_blank" to={`/main/TI_Z007/detail?Code=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '供应商名称',
      dataIndex: 'Name',
      align: 'center',
    },
  ];

  skuColumns = [
    {
      title: '物料代码',
      dataIndex: 'Code',
      align: 'center',
      render: text => (
        <Link target="_blank" to={`/main/product/TI_Z009/TI_Z00903?Code=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '物料描述',
      dataIndex: 'Name',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        Code: '',
        Name: '',
        OpeningBank: '',
        BankAccount: '',
        DutyNo: '',
        Laddress: '',
        LPhone: '',
        CreditCode: '',
        Status: '1',
        CardType: '',
        CusSource: '',
        PayMent: '',
        Currency: '',
        CheckCompanyName: '',
        CheckAddreName: '',
        CheckContacts: '',
      },
    };
    this.formLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
  }

  componentDidMount() {
    const {
      dispatch,
      global: { Purchaser, SupplierList },
    } = this.props;
    if (!SupplierList.length) {
      dispatch({
        type: 'global/getSupplier',
      });
    }
    if (!Purchaser.length) {
      dispatch({
        type: 'global/getMDMCommonality',
        payload: {
          Content: {
            CodeList: ['Purchaser'],
          },
        },
      });
    }
    this.getDetail();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'brands/save',
      payload: {
        brandDetail: {},
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.brands.brandDetail.Code && nextProps.brands.brandDetail !== prevState.formVals) {
      return {
        formVals: nextProps.brands.brandDetail,
      };
    }
    return null;
  }

  getDetail = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.Code) {
      dispatch({
        type: 'brands/fetchDetail',
        payload: {
          Content: {
            Code: query.Code,
          },
        },
      });
    }
  };

  addBrandFetch = selectedRows => {
    // 保存品牌
    const { formVals } = this.state;

    const { dispatch } = this.props;
    const last = formVals.TI_Z00703List[formVals.TI_Z00703List.length - 1];
    const TI_Z00703 = selectedRows.map(item => {
      const { Code, Name } = item;
      return {
        Brand: Code,
        BrandName: Name,
        Code: formVals.Code,
        LineID: last ? last.LineID + 1 : 1,
      };
    });

    dispatch({
      type: 'brands/addbrand',
      payload: {
        Content: {
          Code: formVals.Code,
          TI_Z00703,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('添加成功');
          this.handleModalVisible(false);
          this.getDetail();
        }
      },
    });
  };

  // 删除品牌
  handleDelete = Brand => {
    const { formVals } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'brands/deletebrand',
      payload: {
        Content: {
          Code: formVals.Code,
          Brand,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('添加成功');
          this.handleModalVisible(false);
          this.getDetail();
        }
      },
    });
  };

  handleLinkmanSubmit = fields => {
    const { dispatch } = this.props;
    const { formVals } = this.state;
    dispatch({
      type: 'brands/linkman',
      payload: {
        Content: {
          ...fields,
          Code: formVals.Code,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('保存成功');
          this.handleModalVisible(false);
          this.getDetail();
        }
      },
    });
  };

  render() {
    const {
      global: { Purchaser },location
    } = this.props;
    const { formVals } = this.state;
    return (
      <Card bordered={false}>
        <MyPageHeader {...location} />
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="品牌ID">{formVals.Code}</Description>
          <Description term="名称">{formVals.Name}</Description>
          <Description term="采购员">{getName(Purchaser, formVals.Purchaser)}</Description>
          <Description term="默认供应商">{formVals.CardName}</Description>
          <Description term="官网">{formVals.WebSite}</Description>
          <Description term="简写">{formVals.Abbreviate}</Description>
          <Description term="级别">{getName(brandLevel, formVals.BrandLevel)}</Description>
          <Description term="品牌主图">
            {formVals.Picture ? (
              <img style={{ width: 50, height: 50 }} src={formVals.Picture} alt="" />
            ) : (
              ''
            )}
          </Description>
        </DescriptionList>
        <Tabs animated={false}>
          <TabPane tab="品牌介绍" key="1">
            {formVals.Content}
          </TabPane>
          <TabPane tab="附件" key="9">
            {formVals.Name ? <Attach dataSource={formVals.AttachmentList} /> : ''}
          </TabPane>
          <TabPane tab="品牌供应商" key="2">
            {formVals.Name ? <BrandSupplier BrandName={formVals.Name} /> : ''}
          </TabPane>
          <TabPane tab="品牌物料" key="3">
            {formVals.Name ? <BrandSku BrandName={formVals.Name} /> : ''}
          </TabPane>
          <TabPane tab="客户询价单" key="4">
            {formVals.Name ? <ClientAsk QueryType="1" QueryKey={formVals.Code} /> : ''}
          </TabPane>
          <TabPane tab="采购询价单" key="5">
            {formVals.Name ? <SupplierAsk QueryType="1" QueryKey={formVals.Code} /> : ''}
          </TabPane>
          <TabPane tab="销售订单物料查询" key="6">
            {formVals.Name ? <OrderFetch QueryType="2" QueryKey={formVals.Code} /> : ''}
          </TabPane>
          <TabPane tab="交货退货物料查询" key="7">
            {formVals.Name ? <OdlnordnFetch QueryType="2" QueryKey={formVals.Code} /> : ''}
          </TabPane>
          <TabPane tab="发票贷项物料查询" key="8">
            {formVals.Name ? <OinvorinFetch QueryType="2" QueryKey={formVals.Code} /> : ''}
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default BrandDetail;
