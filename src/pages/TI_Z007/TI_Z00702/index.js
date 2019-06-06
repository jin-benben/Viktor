import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Button, Checkbox } from 'antd';
import StandardTable from '@/components/StandardTable';
import Link from 'umi/link';
import { getName } from '@/utils/utils';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ supplierSearch, loading, global }) => ({
  supplierSearch,
  global,
  loading: loading.models.supplierSearch,
}))
@Form.create()
class supplierSearch extends PureComponent {
  state = {};

  columns = [
    {
      title: '供应商ID',
      dataIndex: 'Code',
      render: text => (
        <Link target="_blank" to={`/main/product/TI_Z007/detail?Code=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '供应商名称',
      dataIndex: 'Name',
    },
    {
      title: '开户行',
      dataIndex: 'OpeningBank',
    },
    {
      title: '账号',
      dataIndex: 'BankAccount',
    },
    {
      title: '地址',
      dataIndex: 'Laddress',
    },
    {
      title: '电话',
      dataIndex: 'LPhone',
    },
    {
      title: '信用代码',
      dataIndex: 'CreditCode',
    },
    {
      title: '交易币种',
      width: 100,
      dataIndex: 'Currency',
      render: val => {
        const {
          global: { Curr },
        } = this.props;
        return <span>{getName(Curr, val)}</span>;
      },
    },
    {
      title: '交易主体',
      width: 100,
      dataIndex: 'CompanyCode',
      render: val => {
        const {
          global: { Company },
        } = this.props;
        return <span>{getName(Company, val)}</span>;
      },
    },
    {
      title: '类型',
      width: 80,
      dataIndex: 'CardType',
      render: val => {
        const {
          global: { Supplier },
        } = this.props;
        return <span>{getName(Supplier, val)}</span>;
      },
    },
    {
      title: '状态',
      dataIndex: 'Status',
      width: 80,
      render: val => <span>{val === '1' ? '开启' : '禁用'}</span>,
    },
  ];

  state = {
    queryData: {
      Content: {
        SearchText: '',
        BrandName: '',
        IsCheck: 'N',
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
    const { BrandName } = query;
    const { queryData } = this.state;
    Object.assign(queryData.Content, { BrandName: BrandName || '' });
    this.setState({ queryData: { ...queryData } });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Supplier', 'Curr', 'Company'],
        },
      },
    });
  }

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'supplierSearch/fetch',
      payload: {
        ...queryData,
        page: pagination.current,
        rows: pagination.pageSize,
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { queryData } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'supplierSearch/fetch',
        payload: {
          Content: {
            ...queryData.Content,
            ...fieldsValue,
            IsCheck: fieldsValue.IsCheck ? 'Y' : 'N',
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
        Content: { BrandName },
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
                <Input placeholder="请输入品牌名称" />
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem>
              {getFieldDecorator('IsCheck', { valuePropName: 'checked', initialValue: true })(
                <Checkbox>是否勾选</Checkbox>
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
                onClick={() => router.push('/main/product/TI_Z007/add')}
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
      supplierSearch: { supplierList, pagination },
      loading,
    } = this.props;

    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: supplierList }}
              rowKey="Code"
              pagination={pagination}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default supplierSearch;
