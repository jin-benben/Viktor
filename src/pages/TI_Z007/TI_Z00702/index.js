import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
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
      title: '税号',
      dataIndex: 'DutyNo',
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
      title: '供应商类型',
      width: 100,
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
      render: val => <span>{val === '1' ? '开启' : '禁用'}</span>,
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      supplierSearch: { queryData },
    } = this.props;
    dispatch({
      type: 'supplierSearch/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Supplier'],
        },
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      supplierSearch: { queryData },
    } = this.props;
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
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'staffs/fetch',
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
    onClick: () => router.push(`/main/product/TI_Z007/TI_Z00703?Code=${record.Code}`),
  });

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
                onClick={() => router.push('/main/product/TI_Z007/TI_Z00701')}
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

export default supplierSearch;
