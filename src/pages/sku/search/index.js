import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import styles from './style.less';

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
      dataIndex: 'package',
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
    console.log(queryData);
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
      let DocDateFrom;
      let DocDateTo;
      if (fieldsValue.dateArr) {
        DocDateFrom = moment(fieldsValue.dateArr[0]).format('YYYY-MM-DD');
        DocDateTo = moment(fieldsValue.dateArr[1]).format('YYYY-MM-DD');
      }
      const queryData = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
        ...fieldsValue.orderNo,
      };
      dispatch({
        type: 'skuFetch/fetch',
        payload: {
          Content: {
            SearchText: '',
            SearchKey: 'Name',
            ...queryData,
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
    onClick: () => router.push(`/sku/edit?Code=${record.Code}`),
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
      <Form onSubmit={this.handleSearch} {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem key="SearchText" label="客户名称" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入客户名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="searchBtn" {...searchFormItemLayout}>
              <span className={styles.submitButtons}>
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
              </span>
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
    console.log(this.props);
    return (
      <Fragment>
        <Card title="客户询价单查询" bordered={false}>
          <div className={styles.skuList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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
