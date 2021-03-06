import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Icon } from 'antd';
import StandardTable from '@/components/StandardTable';
import { formItemLayout } from '@/utils/publicData';

const FormItem = Form.Item;

@connect(({ authorityGroup, loading }) => ({
  authorityGroup,
  loading: loading.models.authorityGroup,
}))
@Form.create()
class inquiryList extends PureComponent {
  columns = [
    {
      title: '角色代码',
      align: 'center',
      width: 100,
      dataIndex: 'Code',
    },
    {
      title: '角色名称',
      align: 'center',
      width: 100,
      dataIndex: 'Name',
    },
    {
      title: '权限设置',
      align: 'center',
      dataIndex: 'set',
      width: 100,
      render: (text, record) => (
        <Link to={`/base/TI_Z014/set?Code=${record.Code}&Name=${record.Name}`}>
          <Icon type="setting" theme="twoTone" />
        </Link>
      ),
    },
    {
      title: '角色修改',
      align: 'center',
      width: 100,
      dataIndex: 'change',
      render: (text, record) => (
        <Link to={`/base/TI_Z014/edit?Code=${record.Code}&Name=${record.Name}`}>
          <Icon type="edit" theme="twoTone" />
        </Link>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      authorityGroup: { queryData },
    } = this.props;
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['TI_Z042'],
        },
      },
    });
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
    return (
      <Form onSubmit={this.handleSearch} {...formItemLayout} layout="inline">
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
                onClick={() => router.push('/base/TI_Z014/edit')}
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
      authorityGroup: { authorityGroupList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
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
