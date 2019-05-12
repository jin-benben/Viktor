import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from './style.less';

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ tableList, loading }) => ({
  tableList,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  columns = [
    {
      title: '单号',
      dataIndex: 'DonEntry',
      width: 80,
    },
    {
      title: '单据日期',
      dataIndex: 'DocDate',
    },
    {
      title: '单据状态',
      dataIndex: 'DocStatus',
    },
    {
      title: '审批对象',
      dataIndex: 'Object',
    },
    {
      title: '原始对象主键',
      dataIndex: 'BaseKey',
    },
    {
      title: '审批实例ID',
      dataIndex: 'Process_instance_id',
    },
    {
      title: '传入参数JSON',
      dataIndex: 'InputJson',
    },
    {
      title: '钉钉表单JSON',
      dataIndex: 'DDJson',
    },
    {
      title: '钉钉审批流代码',
      dataIndex: 'ProcessCode',
    },
    {
      title: '钉钉审批流代码',
      dataIndex: 'ObjType',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      render: val => <span>{val === '1' ? '成功' : '失败'}</span>,
    },
    {
      title: '创建用户',
      dataIndex: 'CreateUser',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableList/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'tableList/fetch',
      payload: params,
    });
  };

  handleOnRow = record => ({
    onClick: () => router.push(`/message/approve/detail?DocEntry=${record.DocEntry}`),
  });

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'tableList/fetch',
        payload: values,
      });
    });
  };

  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      this.handleAdd(fieldsValue);
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      tableList: { data },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              onRow={this.handleOnRow}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default TableList;
