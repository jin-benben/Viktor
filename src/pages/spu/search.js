import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import StandardTable from '@/components/StandardTable';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ spu, loading }) => ({
  spu,
  loading: loading.models.rule,
}))
@Form.create()
class SkuFetchComponent extends PureComponent {
  state = {
    expandForm: false,
  };

  columns = [
    {
      title: 'SPU代码',
      dataIndex: 'Code',
    },
    {
      title: '名称',
      dataIndex: 'CardName',
    },
    {
      title: '品牌',
      dataIndex: 'BrandName',
    },
    {
      title: '单位',
      dataIndex: 'Unit',
    },
    {
      title: '产地',
      dataIndex: 'ManLocation',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (text, record) => (
        <span>{`${record.Cate1Name}/${record.Cate2Name}/${record.Cate3Name}`}</span>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      spu: { queryData },
    } = this.props;
    dispatch({
      type: 'spu/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      spu: { queryData },
    } = this.props;
    dispatch({
      type: 'spu/fetch',
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
        type: 'spu/fetch',
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

  handleOnRow = record => ({
    // 详情or修改
    onClick: () => router.push(`/spu/edit?Code=${record.Code}`),
  });

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 10 },
      },
    };
    const searchFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <Form onSubmit={this.handleSearch} {...formItemLayout} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col lg={5} md={8} sm={24}>
            <FormItem key="SearchText" label="SPU名称" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入SPU名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="searchBtn" {...searchFormItemLayout}>
              <span className="submitButtons">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                  icon="plus"
                  style={{ marginLeft: 8 }}
                  type="primary"
                  onClick={() => router.push('/spu/add')}
                >
                  新建
                </Button>
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      spu: { spuList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card title="SPU查询" bordered={false}>
          <div className="tableLis">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: spuList }}
              pagination={pagination}
              rowKey="Code"
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
