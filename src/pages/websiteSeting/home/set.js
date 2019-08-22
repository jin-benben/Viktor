import React, { Component, Fragment } from 'react';
import {
  Card,
  Table,
  Tabs,
  Button,
  Popconfirm,
  message,
  Divider,
  Icon,
  notification,
  Input,
} from 'antd';
import Link from 'umi/link';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { connect } from 'dva';
import BrandModal from '@/components/Modal/Brand';
import CateModal from '@/components/Modal/Category';
import MyIcon from '@/components/MyIcon';
import SKUModal from '@/components/Modal/SKU';
import OrderAttachUpload from '@/components/Modal/OrderAttachUpload';

const { TabPane } = Tabs;
const { Description } = DescriptionList;

@connect(({ homeSet, loading, global }) => ({
  homeSet,
  global,
  updateloading: loading.effects['homeSet/update'],
}))
class HomePageSet extends Component {
  brandColumns = [
    {
      title: '品牌ID',
      dataIndex: 'BrandCode',
      width: 100,
    },
    {
      title: '品牌名称',
      width: 200,
      dataIndex: 'BrandName',
      render: (text, record) => (
        <Link target="_blank" to={`/main/product/TI_Z005/detail?Code=${record.Brand}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '操作',
      width: 50,
      render: (text, record, index) => (
        <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete('TI_Z01905', index)}>
          <a>
            <MyIcon type="iconshanchu" />
          </a>
        </Popconfirm>
      ),
    },
  ];

  skuColumns = [
    {
      title: '物料代码',
      dataIndex: 'SKU',
      width: 80,
    },
    {
      title: '物料名称',
      width: 200,
      dataIndex: 'ItemName',
    },
    {
      title: '操作',
      width: 50,
      render: (text, record, index) => (
        <Fragment>
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete('TI_Z01906', index)}>
            <a>
              <MyIcon type="iconshanchu" />
            </a>
          </Popconfirm>
          <Divider type="vertical" />
          <a>
            <Icon type="upload" />
          </a>
        </Fragment>
      ),
    },
  ];

  thirdSkuColumns = [
    {
      title: '物料代码',
      dataIndex: 'SKU',
      width: 80,
    },
    {
      title: '物料名称',
      width: 200,
      dataIndex: 'ItemName',
    },
    {
      title: '操作',
      width: 50,
      render: (text, record, index) => (
        <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete('TI_Z01903', index)}>
          <a>
            <MyIcon type="iconshanchu" />
          </a>
        </Popconfirm>
      ),
    },
  ];

  categoryColumns = [
    {
      title: '分类代码',
      dataIndex: 'CategoryCode',
      width: 100,
    },
    {
      title: '分类名称',
      width: 100,
      dataIndex: 'CategoryName',
    },
    {
      title: '显示名称',
      width: 100,
      dataIndex: 'ShowName',
      render: (text, record, index) => (
        <Input value={text} onChange={e => this.showNameChange(e.target.value, record, index)} />
      ),
    },

    {
      title: '图片',
      width: 100,
      dataIndex: 'Picture_PC_Address',
      render: (text, record) =>
        text ? <img style={{ width: 100 }} alt={record.CategoryName} src={text} /> : '',
    },
    {
      title: '操作',
      width: 50,
      render: (text, record, index) => (
        <Fragment>
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete('TI_Z01902', index)}>
            <a>
              <MyIcon type="iconshanchu" />
            </a>
          </Popconfirm>
          <Divider type="vertical" />
          <a title="上传图片" onClick={() => this.openUpload(index)}>
            <Icon type="upload" />
          </a>
        </Fragment>
      ),
    },
  ];

  thirdCategoryColumns = [
    {
      title: '分类代码',
      dataIndex: 'CategoryCode',
      width: 100,
    },
    {
      title: '分类名称',
      width: 100,
      dataIndex: 'CategoryName',
    },
    {
      title: '显示名称',
      width: 100,
      dataIndex: 'ShowName',
      render: (text, record, index) => (
        <Input value={text} onChange={e => this.showNameChange(e.target.value, record, index)} />
      ),
    },
    {
      title: '操作',
      width: 50,
      render: (text, record, index) => (
        <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete('TI_Z01903', index)}>
          <a>
            <MyIcon type="iconshanchu" />
          </a>
        </Popconfirm>
      ),
    },
  ];

  state = {
    categorydteail: {
      Name: '',
      Code: '',
      TI_Z01902: [],
      TI_Z01903: [],
      TI_Z01904: [],
      TI_Z01905: [],
      TI_Z01906: [],
    },
    brandmodalVisible: false,
    catemodalVisible: false,
    PCode: '',
    Level: '2',
    activeKey: 'TI_Z01902', // 当前tab的可以
    currentIndex: 0, // 当前二级分类index
    expandedRowKeys: [],
  };

  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.Code) {
      dispatch({
        type: 'homeSet/singleFetchs',
        payload: {
          Content: {
            Code: query.Code,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            this.setState({
              categorydteail: response.Content,
              PCode: query.Code,
            });
          }
        },
      });
    }
  };

  tabChange = activeKey => {
    this.setState({
      activeKey,
      Level: '2',
    });
  };

  // 上传图片
  openUpload = currentIndex => {
    this.setState({
      currentIndex,
      uploadmodalVisible: true,
    });
  };

  // 显示名称change
  showNameChange = (value, record, index) => {
    const { categorydteail, Level } = this.state;
    if (Level === '2') {
      categorydteail.TI_Z01902[index].ShowName = value;
    }
    if (Level === '3') {
      categorydteail.TI_Z01903[index].ShowName = value;
    }
    this.setState({
      categorydteail,
    });
  };

  addBrandFetch = selectedRows => {
    const { categorydteail } = this.state;
    const length = categorydteail.TI_Z01905.length;
    const OrderId = length ? categorydteail.TI_Z01905[length - 1].OrderId : 1;
    const newArr = selectedRows.map((brand, index) => {
      const { Code, Name } = brand;
      return {
        Code: categorydteail.Code,
        BrandName: Name,
        BrandCode: Code,
        OrderId: OrderId + index + 1,
      };
    });
    Object.assign(categorydteail, { TI_Z01905: [...categorydteail.TI_Z01905, ...newArr] });
    this.setState({
      categorydteail,
      brandmodalVisible: false,
    });
    message.success('添加成功，更新后有效');
  };

  // 删除品牌
  handleDelete = (key, index) => {
    const { categorydteail } = this.state;
    categorydteail[key].splice(index, 1);
    this.setState({
      categorydteail,
    });
    message.success('删除成功，更新后有效');
  };

  // 选择分类
  categorySelect = selectedRows => {
    const { Level, categorydteail, PCode, thirdCategoryList } = this.state;
    if (Level === '2') {
      const length = categorydteail.TI_Z01902.length;
      const OrderId = length ? categorydteail.TI_Z01902[length - 1].OrderId : 1;
      let newArr = [];
      selectedRows.map((cateItem, index) => {
        const { Code, Name } = cateItem;
        const targetIndex = categorydteail.TI_Z01902.findIndex(item => item.CategoryCode === Code);
        if (targetIndex === -1) {
          newArr.push({
            Code: categorydteail.Code,
            ShowName: Name,
            CategoryName: Name,
            CategoryCode: Code,
            OrderId: OrderId + index + 1,
          });
        }
      });
      Object.assign(categorydteail, { TI_Z01902: [...categorydteail.TI_Z01902, ...newArr] });
    }
    if (Level === '3') {
      const length = categorydteail.TI_Z01903.length;
      const OrderId = length ? categorydteail.TI_Z01903[length - 1].OrderId : 1;
      let newArr = [];
      selectedRows.map((cateItem, index) => {
        const { Code, Name } = cateItem;
        const targetIndex = categorydteail.TI_Z01903.findIndex(item => item.CategoryCode === Code);
        if (targetIndex === -1) {
          newArr.push({
            Code: categorydteail.Code,
            ShowName: Name,
            Father: PCode,
            CategoryName: Name,
            CategoryCode: Code,
            OrderId: OrderId + index + 1,
          });
        }
      });
      Object.assign(categorydteail, {
        TI_Z01903: [...categorydteail.TI_Z01903, ...newArr],
        thirdCategoryList: [...thirdCategoryList, ...newArr],
      });
    }
    this.setState({
      categorydteail,
      catemodalVisible: false,
    });
    message.success('添加成功，更新后有效');
  };

  // 添加物料
  addSKU = selectedRows => {
    const { Level, categorydteail, PCode, secondProductList } = this.state;
    if (Level === '2') {
      const length = categorydteail.TI_Z01906.length;
      const OrderId = length ? categorydteail.TI_Z01906[length - 1].OrderId : 1;
      let newArr = [];
      selectedRows.map((skuItem, index) => {
        const { Code, Name } = skuItem;
        const targetIndex = categorydteail.TI_Z01906.findIndex(item => item.SKU === Code);
        if (targetIndex === -1) {
          newArr.push({
            Code: categorydteail.Code,
            ItemName: Name,
            SKU: Code,
            OrderId: OrderId + index + 1,
          });
        }
      });
      Object.assign(categorydteail, { TI_Z01906: [...categorydteail.TI_Z01906, ...newArr] });
    }
    if (Level === '3') {
      const length = categorydteail.TI_Z01904.length;
      const OrderId = length ? categorydteail.TI_Z01904[length - 1].OrderId : 1;
      let newArr = [];
      selectedRows.map((skuItem, index) => {
        const { Code, Name } = skuItem;
        const targetIndex = categorydteail.TI_Z01904.findIndex(item => item.SKU === Code);
        if (targetIndex === -1) {
          newArr.push({
            Code: categorydteail.Code,
            Father: PCode,
            ItemName: Name,
            SKU: Code,
            OrderId: OrderId + index + 1,
          });
        }
      });
      Object.assign(categorydteail, {
        TI_Z01904: [...categorydteail.TI_Z01904, ...newArr],
        secondProductList: [...secondProductList, ...newArr],
      });
    }
    this.setState({
      categorydteail,
      skuModalVisible: false,
    });
    message.success('添加成功，更新后有效');
  };

  handleModalVisible = flag => {
    this.setState({
      catemodalVisible: !!flag,
      brandmodalVisible: !!flag,
      skuModalVisible: !!flag,
      uploadmodalVisible: !!flag,
    });
  };

  //  图片上传
  uploadImg = fileList => {
    const { currentIndex, categorydteail } = this.state;
    fileList.map(file => {
      const { AttachmentPath, AttachmentCode } = file;
      categorydteail.TI_Z01902[currentIndex].Picture_PC_Address = AttachmentPath;
      categorydteail.TI_Z01902[currentIndex].Picture_PC_Code = AttachmentCode;
    });
    this.setState({
      categorydteail,
      uploadmodalVisible: false,
    });
  };

  //  更新
  updateDetailHandle = () => {
    const { categorydteail } = this.state;
    if (categorydteail.TI_Z01906.length > 8) {
      notification.warning({
        message: `提示`,
        description: '排行榜物料不能大于8,请先删除多余项',
      });
      return false;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'homeSet/update',
      payload: {
        Content: {
          ...categorydteail,
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

  // 添加三级分类
  addThirdCate = PCode => {
    this.setState({
      PCode,
      Level: '3',
      catemodalVisible: true,
    });
  };

  // 添加二级级分类产品
  addThirdProduct = PCode => {
    this.setState({
      PCode,
      Level: '3',
      skuModalVisible: true,
    });
  };

  onExpand = (expanded, record) => {
    const { categorydteail } = this.state;
    if (expanded) {
      const secondProductList = categorydteail.TI_Z01904.filter(
        item => item.Father === record.CategoryCode
      );
      const thirdCategoryList = categorydteail.TI_Z01903.filter(
        item => item.Father === record.CategoryCode
      );
      this.setState({
        secondProductList,
        thirdCategoryList,
        expandedRowKeys: [record.CategoryCode],
      });
    }
  };

  expandedRowRender = record => {
    const { thirdCategoryList, secondProductList } = this.state;
    return (
      <Tabs animated={false}>
        <TabPane tab="三级分类" key="category">
          <Table
            rowKey="CategoryCode"
            dataSource={thirdCategoryList}
            columns={this.thirdCategoryColumns}
            pagination={false}
            footer={() => (
              <Button type="primary" onClick={() => this.addThirdCate(record.CategoryCode)}>
                添加三级分类
              </Button>
            )}
          />
        </TabPane>
        <TabPane tab="产品" key="product">
          <Table
            rowKey="SKU"
            dataSource={secondProductList}
            columns={this.thirdSkuColumns}
            pagination={false}
            footer={() => (
              <Button type="primary" onClick={() => this.addThirdProduct(record.CategoryCode)}>
                添加产品
              </Button>
            )}
          />
        </TabPane>
      </Tabs>
    );
  };

  render() {
    const {
      categorydteail,
      brandmodalVisible,
      PCode,
      Level,
      catemodalVisible,
      skuModalVisible,
      uploadmodalVisible,
      expandedRowKeys,
    } = this.state;
    const { updateloading } = this.props;
    const brandParentMethods = {
      handleSubmit: this.addBrandFetch,
      handleModalVisible: this.handleModalVisible,
    };
    const skuParentMethods = {
      handleSubmit: this.addSKU,
      handleModalVisible: this.handleModalVisible,
    };
    const uploadmodalMethods = {
      handleSubmit: this.uploadImg,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Card bordered={false}>
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="分类代码">{categorydteail.Code}</Description>
          <Description term="分类名称">{categorydteail.Name}</Description>
        </DescriptionList>
        <Tabs onChange={this.tabChange}>
          <TabPane tab="二级分类" key="TI_Z01902">
            <Table
              rowKey="CategoryCode"
              dataSource={categorydteail.TI_Z01902}
              columns={this.categoryColumns}
              onExpand={this.onExpand}
              expandedRowKeys={expandedRowKeys}
              expandedRowRender={this.expandedRowRender}
              pagination={false}
              footer={() => (
                <Button type="primary" onClick={() => this.setState({ catemodalVisible: true })}>
                  添加二级分类
                </Button>
              )}
            />
          </TabPane>
          <TabPane tab="排行榜物料" key="TI_Z01906">
            <Table
              rowKey="SKU"
              dataSource={categorydteail.TI_Z01906}
              columns={this.skuColumns}
              pagination={false}
              footer={() => (
                <div>
                  <Button type="primary" onClick={() => this.setState({ skuModalVisible: true })}>
                    添加物料
                  </Button>
                  (最多添加8个)
                </div>
              )}
            />
          </TabPane>

          <TabPane tab="品牌" key="brand">
            <Table
              rowKey="BrandCode"
              dataSource={categorydteail.TI_Z01905}
              columns={this.brandColumns}
              pagination={false}
              footer={() => (
                <Button type="primary" onClick={() => this.setState({ brandmodalVisible: true })}>
                  添加品牌
                </Button>
              )}
            />
          </TabPane>
        </Tabs>
        <BrandModal {...brandParentMethods} modalVisible={brandmodalVisible} />
        <SKUModal
          Category={PCode}
          Type="checkbox"
          {...skuParentMethods}
          modalVisible={skuModalVisible}
        />
        <OrderAttachUpload {...uploadmodalMethods} modalVisible={uploadmodalVisible} />
        <CateModal
          PCode={PCode}
          Level={Level}
          Type="checkbox"
          handleSubmit={this.categorySelect}
          modalVisible={catemodalVisible}
          handleModalVisible={this.handleModalVisible}
        />
        <FooterToolbar>
          <Button loading={updateloading} type="primary" onClick={this.updateDetailHandle}>
            更新
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}

export default HomePageSet;
