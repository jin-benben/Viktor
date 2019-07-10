import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import Link from 'umi/link';
import StandardTable from '@/components/StandardTable';
import MyPageHeader from '../components/pageHeader';
import { getName } from '@/utils/utils';

const FormItem = Form.Item;
const CusSource = [
  {
    Key: '1',
    Value: '线下',
  },
  {
    Key: '2',
    Value: '网站',
  },
  {
    Key: '3',
    Value: '其他来源',
  },
];

/* eslint react/no-multi-comp:0 */
@connect(({ companySearch, loading, global }) => ({
  companySearch,
  global,
  loading: loading.models.companySearch,
}))
@Form.create()
class companySearch extends PureComponent {
  state = {};

  columns = [
    {
      title: '客户ID',
      width: 80,
      dataIndex: 'Code',
      render: text => (
        <Link target="_blank" to={`/main/TI_Z006/detail?Code=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '客户名称',
      width: 200,
      dataIndex: 'Name',
    },
    {
      title: '开户行',
      width: 200,
      dataIndex: 'OpeningBank',
    },
    {
      title: '账号',
      width: 200,
      dataIndex: 'BankAccount',
    },
    {
      title: '地址',
      width: 200,
      dataIndex: 'Laddress',
    },
    {
      title: '电话',
      width: 200,
      dataIndex: 'LPhone',
    },
    {
      title: '信用代码',
      width: 200,
      dataIndex: 'CreditCode',
    },
    {
      title: '类型',
      dataIndex: 'CardType',
      width: 80,
      render: val => {
        const { global } = this.props;
        const CardList = global.Card;
        return <span>{getName(CardList, val)}</span>;
      },
    },
    {
      title: '来源',
      dataIndex: 'CusSource',
      width: 80,
      render: val => <span>{getName(CusSource, val)}</span>,
    },
    {
      title: '状态',
      dataIndex: 'Status',
      width: 80,
      render: val => <span>{val === '1' ? '开启' : '禁用'}</span>,
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      companySearch: { queryData },
    } = this.props;
    dispatch({
      type: 'companySearch/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Card'],
        },
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      companySearch: { queryData },
    } = this.props;
    dispatch({
      type: 'companySearch/fetch',
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
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'companySearch/fetch',
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

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
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
                onClick={() => router.push('/main/TI_Z006/add')}
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
      companySearch: { companyList, pagination },
      loading,
      location,
    } = this.props;

    return (
      <Fragment>
        <Card bordered={false}>
          <MyPageHeader {...location} />
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: companyList }}
              rowKey="Code"
              scroll={{ x: 1600 }}
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

export default companySearch;
