import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import Link from 'umi/link';
import StandardTable from '@/components/StandardTable';
import { getName } from '@/utils/utils';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ skuFetch, global, loading }) => ({
  skuFetch,
  global,
  loading: loading.models.rule,
}))
@Form.create()
class SkuFetchComponent extends PureComponent {
  columns = [
    {
      title: '物料代码',
      width: 80,
      dataIndex: 'Code',
      render: text => (
        <Link target="_blank" to={`/main/product/TI_Z009/TI_Z00903?Code=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '物料描述',
      dataIndex: 'Name',
      width: 200,
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '物料名称',
      width: 100,
      dataIndex: 'ProductName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },

    {
      title: '品牌',
      width: 100,
      dataIndex: 'BrandName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },

    {
      title: '型号',
      width: 100,
      dataIndex: 'ManufactureNO',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '参数',
      width: 100,
      dataIndex: 'Parameters',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '包装',
      width: 100,
      dataIndex: 'Package',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 200,
      render: (text, record) => (
        <span>{`${record.Cate1Name}/${record.Cate2Name}/${record.Cate3Name}`}</span>
      ),
    },
    {
      title: '单位',
      width: 80,
      dataIndex: 'Unit',
    },
    {
      title: '销售价格',
      width: 80,
      dataIndex: 'SPrice',
    },
    {
      title: '采购价格',
      width: 80,
      dataIndex: 'PPrice',
    },
    {
      title: '产地',
      width: 80,
      dataIndex: 'ManLocation',
      render: text => {
        const {
          global: { TI_Z042 },
        } = this.props;
        return <span>{getName(TI_Z042, text)}</span>;
      },
    },
    {
      title: '外文名称',
      width: 100,
      dataIndex: 'EnglishName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '规格(外)',
      width: 100,
      dataIndex: 'ForeignParameters',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '上架状态',
      width: 80,
      dataIndex: 'Putaway',
      render: text => <span>{text === '1' ? '已上架' : '未上架'}</span>,
    },
  ];

  state = {
    queryData: {
      Content: {
        BrandName: '',
        Category: '',
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
      sidx: 'Code',
      sord: 'Desc',
    },
  };

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { BrandName, Category } = query;
    const { queryData } = this.state;
    Object.assign(queryData.Content, { BrandName: BrandName || '', Category: Category || '' });
    this.setState({ queryData: { ...queryData } });
    dispatch({
      type: 'skuFetch/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['TI_Z042'],
        },
      },
    });
  }

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'skuFetch/fetch',
      payload: {
        ...queryData,
        page: pagination.current,
        rows: pagination.pageSize,
      },
    });
  };

  handleSearch = e => {
    // 搜索
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { queryData } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'skuFetch/fetch',
        payload: {
          Content: {
            SearchText: '',
            SearchKey: 'Name',
            ...queryData.Content,
            ...fieldsValue,
          },
          page: 1,
          rows: 30,
          sidx: 'Code',
          sord: 'Desc',
        },
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      queryData: {
        Content: { BrandName, Category },
      },
    } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="BrandName" label="品牌">
              {getFieldDecorator('BrandName', { initialValue: BrandName })(
                <Input placeholder="请输入品牌" />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="Category" label="分类">
              {getFieldDecorator('Category', { initialValue: Category })(
                <Input placeholder="请输入分类" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                icon="plus"
                style={{ marginLeft: 8 }}
                type="primary"
                onClick={() => router.push('/main/product/TI_Z009/TI_Z00901')}
              >
                新建
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      skuFetch: { skuList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: skuList }}
              pagination={pagination}
              rowKey="Code"
              scroll={{ x: 2000, y: 600 }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default SkuFetchComponent;
