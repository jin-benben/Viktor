import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
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
      width: 120,
      dataIndex: 'Code',
    },
    {
      title: '客户名称',
      width: 200,
      dataIndex: 'Name',
    },
    {
      title: '开户行',
      width: 150,
      dataIndex: 'OpeningBank',
    },
    {
      title: '账号',
      width: 150,
      dataIndex: 'BankAccount',
    },
    {
      title: '税号',
      width: 150,
      dataIndex: 'DutyNo',
    },
    {
      title: '地址',
      dataIndex: 'Laddress',
    },
    {
      title: '电话',
      width: 150,
      dataIndex: 'LPhone',
    },
    {
      title: '信用代码',
      width: 150,
      dataIndex: 'CreditCode',
    },
    {
      title: '客户类型',
      width: 100,
      dataIndex: 'CardType',
      render: val => {
        const { global } = this.props;
        const CardList = global.Card;
        return <span>{getName(CardList, val)}</span>;
      },
    },
    {
      title: '客户来源',
      width: 100,
      dataIndex: 'CusSource',
      render: val => <span>{getName(CusSource, val)}</span>,
    },
    {
      title: '状态',
      dataIndex: 'Status',
      width: 100,
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

  handleOnRow = record => ({
    // 详情or修改
    onClick: () => router.push(`/TI_Z006/TI_Z00603?Code=${record.Code}`),
  });

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('SearchText')(<Input placeholder="请输入客户名称" />)}
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
                onClick={() => router.push('/company/edit')}
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
    } = this.props;

    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: companyList }}
              scroll={{ x: 1800 }}
              rowKey="Code"
              pagination={pagination}
              onRow={this.handleOnRow}
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
