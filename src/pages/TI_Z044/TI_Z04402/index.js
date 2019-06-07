import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import Link from 'umi/link';
import { getName } from '@/utils/utils';
import { printType, printOrderType } from '@/utils/publicData';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ printTemplateSearch, loading, global }) => ({
  printTemplateSearch,
  global,
  loading: loading.models.printTemplateSearch,
}))
@Form.create()
class printTemplateListPage extends PureComponent {
  state = {
    expandForm: false,
  };

  columns = [
    {
      title: '代码',
      width: 80,
      dataIndex: 'Code',
      render: text => (
        <Link target="_blank" to={`/base/print/TI_Z044/detail?Code=${text}`}>
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
      title: '打印类型',
      dataIndex: 'PrintType',
      width: 100,
      render: text => <span>{getName(printType, text)}</span>,
    },
    {
      title: '单据类型',
      dataIndex: 'BaseType',
      width: 100,
      render: text => <span>{getName(printOrderType, text)}</span>,
    },
    {
      title: '内容模板',
      dataIndex: 'HtmlTemplateCode ',
      render: text => (
        <Ellipsis tooltip lines={5}>
          {text}
        </Ellipsis>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      printTemplateSearch: { queryData },
    } = this.props;
    dispatch({
      type: 'printTemplateSearch/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      printTemplateSearch: { queryData },
    } = this.props;
    dispatch({
      type: 'printTemplateSearch/fetch',
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
        type: 'printTemplateSearch/fetch',
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
                  onClick={() => router.push('/base/print/TI_Z044/add')}
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
      printTemplateSearch: { printTemplateList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: printTemplateList }}
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

export default printTemplateListPage;
