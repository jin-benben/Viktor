import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import StandardTable from '@/components/StandardTable';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ skuFetch, loading }) => ({
  skuFetch,
  loading: loading.models.rule,
}))
@Form.create()
class SkuFetchComponent extends PureComponent {
  state = {
    expandForm: false,
  };

  columns = [
    {
      title: '物料代码',
      dataIndex: 'Code',
    },
    {
      title: '物料名称',
      dataIndex: 'CardName',
    },
    {
      title: '品牌',
      dataIndex: 'BrandName',
    },

    {
      title: '型号',
      dataIndex: 'ManufactureNO',
    },
    {
      title: '参数',
      dataIndex: 'Parameters',
    },
    {
      title: '包装',
      dataIndex: 'Package',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (text, record) => (
        <span>{`${record.Cate1Name}/${record.Cate2Name}/${record.Cate3Name}`}</span>
      ),
    },
    {
      title: '单位',
      dataIndex: 'Unit',
    },
    {
      title: '上架状态',
      dataIndex: 'Putaway',
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      skuFetch: { queryData },
    } = this.props;
    dispatch({
      type: 'skuFetch/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      skuFetch: { queryData },
    } = this.props;
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
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'skuFetch/fetch',
        payload: {
          Content: {
            SearchText: '',
            SearchKey: 'Name',
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

  toggleForm = () => {
    // 是否展开
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleOnRow = record => ({
    // 详情or修改
    onClick: () => router.push(`/sku/detail?Code=${record.Code}`),
  });

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col className="submitButtons">
            <FormItem key="SearchText" label="SKU名称" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入SKU名称" />)}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                icon="plus"
                style={{ marginLeft: 8 }}
                type="primary"
                onClick={() => router.push('/sku/add')}
              >
                新建
              </Button>
            </FormItem>
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
        <Card title="SKU查询" bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: skuList }}
              pagination={pagination}
              rowKey="DocEntry"
              columns={this.columns}
              onRow={this.handleOnRow}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default SkuFetchComponent;
