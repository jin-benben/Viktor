import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Tag } from 'antd';

import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import { getName } from '@/utils/utils';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ batchManage, loading, global }) => ({
  batchManage,
  global,
  loading: loading.models.batchManage,
}))
@Form.create()
class batchManage extends PureComponent {
  columns = [
    {
      title: '批次号',
      dataIndex: 'Code',
      width: 200,
    },
    {
      title: '审核日期',
      dataIndex: 'ApproveDate',
      width: 100,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '审核人',
      width: 100,
      dataIndex: 'ApproveBy',
      render: text => {
        const {
          global: { TI_Z004 },
        } = this.props;
        return <span>{getName(TI_Z004, text)}</span>;
      },
    },
    {
      title: '审核状态',
      width: 100,
      dataIndex: 'ApproveSts',
      align: 'center',
      render: text =>
        text === 'Y' ? <Tag color="green">已通过</Tag> : <Tag color="gold">未通过</Tag>,
    },
    {
      title: '批次附件数',
      width: 100,
      dataIndex: 'AttachmentCount',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '物料代码',
      width: 100,
      dataIndex: 'ItemCode',
      render: text => (
        <Link target="_blank" to={`/main/product/TI_Z009/TI_Z00903?Code=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '创建日期',
      dataIndex: 'CreateDate',
      width: 100,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '更新日期',
      dataIndex: 'UpdateDate',
      width: 100,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      batchManage: { queryData },
    } = this.props;
    dispatch({
      type: 'batchManage/fetch',
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
    dispatch({
      type: 'global/getAuthority',
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      batchManage: { queryData },
    } = this.props;
    dispatch({
      type: 'batchManage/fetch',
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
        type: 'batchManage/fetch',
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
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
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
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      batchManage: { batchList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: batchList }}
              pagination={pagination}
              rowKey="Code"
              scroll={{ x: 1000 }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default batchManage;
