import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import { getName } from '@/utils/utils';
import { templateType } from '@/utils/publicData';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ templateSearch, loading, global }) => ({
  templateSearch,
  global,
  loading: loading.models.templateSearch,
}))
@Form.create()
class TemplateSearch extends PureComponent {
  state = {
    expandForm: false,
  };

  columns = [
    {
      title: '代码',
      width: 80,
      dataIndex: 'Code',
      render: text => (
        <Link target="_blank" to={`/base/TI_Z049/detail?Code=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '名称',
      width: 200,
      dataIndex: 'Name',
    },
    {
      title: '模板类型',
      dataIndex: 'PrintType',
      width: 100,
      render: text => <span>{getName(templateType, text)}</span>,
    },
    {
      title: '备注',
      width: 100,
      dataIndex: 'Comment',
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      templateSearch: { queryData },
    } = this.props;
    dispatch({
      type: 'templateSearch/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      templateSearch: { queryData },
    } = this.props;
    dispatch({
      type: 'templateSearch/fetch',
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
        type: 'templateSearch/fetch',
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
          <Col md={4} sm={24}>
            <FormItem key="SearchText" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>

          <Col md={5} sm={24}>
            <FormItem key="searchBtn">
              <span className="submitButtons">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                  icon="plus"
                  style={{ marginLeft: 8 }}
                  type="primary"
                  onClick={() => router.push('/base/TI_Z049/add')}
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
      templateSearch: { templateList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: templateList }}
              pagination={pagination}
              rowKey="Code"
              scroll={{ y: 600 }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default TemplateSearch;
