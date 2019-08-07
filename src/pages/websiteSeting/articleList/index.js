import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Tag } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import MDMCommonality from '@/components/Select';
import MyIcon from '@/components/MyIcon';
import { formLayout, articleType } from '@/utils/publicData';
import { getName } from '@/utils/utils';

const FormItem = Form.Item;

function onFieldsChange(props, changedFields) {
  const { dispatch } = props;
  const { Type } = changedFields;
  if (Type && Type.name === 'Type') {
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['TI_Z01802'],
          Key: Type.value,
        },
      },
    });
  }
}
@connect(({ articleList, loading, global }) => ({
  articleList,
  global,
  loading: loading.models.articleList,
}))
@Form.create({ onFieldsChange })
class ArticleListPage extends PureComponent {
  columns = [
    {
      title: '单号',
      width: 80,
      dataIndex: 'DocEntry',
    },
    {
      title: '创建人',
      dataIndex: 'CreateUser',
      width: 120,
      render: val => {
        const {
          global: { TI_Z004 },
        } = this.props;
        return <span>{getName(TI_Z004, val)}</span>;
      },
    },
    {
      title: '创建日期',
      width: 100,
      dataIndex: 'CreateDate',
      render: val => (
        <Ellipsis tooltip lines={1}>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '标题',
      width: 200,
      dataIndex: 'Title',
      render: val => (
        <Ellipsis tooltip lines={1}>
          {val}
        </Ellipsis>
      ),
    },

    {
      title: '类型',
      width: 100,
      dataIndex: 'Type',
      align: 'center',
      render: text => <span>{getName(articleType, text)}</span>,
    },

    {
      title: '分类',
      width: 100,
      dataIndex: 'Category',
    },
    {
      title: '是否显示',
      width: 80,
      dataIndex: 'IsShow',
      render: text =>
        text === 'Y' ? <Tag color="green">显示</Tag> : <Tag color="gold">不显示</Tag>,
    },
    {
      title: '操作',
      width: 80,
      align: 'center',
      render: (text, record) => (
        <a href={`/websiteSeting/articleEdit?DocEntry=${record.DocEntry}`}>
          <MyIcon type="iconedit" />
        </a>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      articleList: { queryData },
    } = this.props;

    dispatch({
      type: 'articleList/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['TI_Z004'],
        },
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      articleList: { queryData },
    } = this.props;
    dispatch({
      type: 'articleList/fetch',
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
        type: 'articleList/fetch',
        payload: {
          Content: {
            SearchText: '',
            SearchKey: 'Name',
            ...fieldsValue,
          },
          page: 1,
          rows: 30,
          sidx: 'DocEntry',
          sord: 'Desc',
        },
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      global: { TI_Z01802 },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem key="SearchText" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="Type" {...formLayout} label="类型">
              {getFieldDecorator('Type')(<MDMCommonality data={articleType} />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="Category" {...formLayout} label="分类">
              {getFieldDecorator('Category')(<MDMCommonality data={TI_Z01802} />)}
            </FormItem>
          </Col>
          <Col md={2} sm={24}>
            <FormItem key="searchBtn">
              <span className="submitButtons">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="primary"
                  href="/websiteSeting/articleEdit"
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
      articleList: { dataList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: dataList }}
              pagination={pagination}
              rowKey="DocEntry"
              scroll={{ x: 1000 }}
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

export default ArticleListPage;
