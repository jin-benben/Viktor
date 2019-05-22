import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Icon } from 'antd';
import StandardTable from '@/components/StandardTable';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ authorityGroup, loading }) => ({
  authorityGroup,
  loading: loading.models.rule,
}))
@Form.create()
class inquiryList extends PureComponent {
  columns = [
    {
      title: '角色代码',
      align: 'center',
      dataIndex: 'Code',
    },
    {
      title: '角色名称',
      align: 'center',
      dataIndex: 'Name',
    },
    {
      title: '权限设置',
      align: 'center',
      dataIndex: 'set',
      render: (text, record) => (
        // eslint-disable-next-line no-script-url
        <a
          onClick={e => {
            e.preventDefault();
            router.push(`/TI_Z014/set?Code=${record.Code}`);
          }}
          href="javascript:;"
        >
          <Icon type="setting" theme="twoTone" />
        </a>
      ),
    },
    {
      title: '角色修改',
      align: 'center',
      dataIndex: 'change',
      render: (text, record) => (
        // eslint-disable-next-line no-script-url
        <a
          onClick={e => {
            e.preventDefault();
            router.push(`/TI_Z014/edit?Code=${record.Code}`);
          }}
          href="javascript:;"
        >
          <Icon type="edit" theme="twoTone" />
        </a>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      authorityGroup: { queryData },
    } = this.props;
    console.log(queryData);
    dispatch({
      type: 'authorityGroup/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      authorityGroup: { queryData },
    } = this.props;
    dispatch({
      type: 'authorityGroup/fetch',
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
        type: 'authorityGroup/fetch',
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} className="submitButtons">
          <Col md={6} sm={24}>
            <FormItem key="SearchText" label="角色名称" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入角色名称" />)}
            </FormItem>
            <FormItem key="searchBtn" {...searchFormItemLayout}>
              <span>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                  icon="plus"
                  style={{ marginLeft: 8 }}
                  type="primary"
                  onClick={() => router.push('/TI_Z014/edit')}
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
      authorityGroup: { authorityGroupList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card title="角色查询" bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: authorityGroupList }}
              pagination={pagination}
              rowKey="Code"
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default inquiryList;
