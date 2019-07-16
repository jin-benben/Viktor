import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Form, Button, message, Table } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ batchManage, loading, global }) => ({
  batchManage,
  global,
  searchLoading: loading.effects['batchManage/approvefetch'],
  approveLoading: loading.effects['batchManage/approve'],
}))
@Form.create()
class BatchUpload extends PureComponent {
  columns = [
    {
      title: '批次号',
      dataIndex: 'Code',
      width: 200,
    },
    {
      title: '客户',
      dataIndex: 'CardName',
      width: 200,
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '附件数',
      width: 80,
      dataIndex: 'AttachmentCount',
      align: 'center',
    },
    {
      title: '附件',
      width: 300,
      dataIndex: 'Image',
      render: (text, record) =>
        record.TI_Z02502.map(item => (
          <img
            key={item.AttachmentPath}
            style={{ width: 50, height: 50 }}
            src={item.AttachmentPath}
            alt="主图"
          />
        )),
    },
    {
      title: '合同号',
      width: 100,
      dataIndex: 'ContractEntry',
      render: text => (
        <Link target="_blank" to={`/sellabout/TI_Z030/detail?DocEntry=${text}`}>
          {text}
        </Link>
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
      render: val => (
        <Ellipsis tooltip lines={1}>
          <span>{val ? moment(val).format('YYYY-MM-DD hh:mm:ss') : ''}</span>
        </Ellipsis>
      ),
    },
    {
      title: '更新日期',
      dataIndex: 'UpdateDate',
      width: 100,
      render: val => (
        <Ellipsis tooltip lines={1}>
          <span>{val ? moment(val).format('YYYY-MM-DD hh:mm:ss') : ''}</span>
        </Ellipsis>
      ),
    },
  ];

  state = {
    selectedRows: [],
    selectedRowKeys: [],
  };

  componentDidMount() {
    const {
      dispatch,
      global: { currentUser },
      batchManage: { queryData },
    } = this.props;
    Object.assign(queryData.Content, { SlpCode: [currentUser.Owner] });
    dispatch({
      type: 'batchManage/save',
      payload: {
        queryData: {
          ...queryData,
        },
      },
    });
    dispatch({
      type: 'batchManage/approvefetch',
      payload: {
        ...queryData,
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
      type: 'batchManage/approvefetch',
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
        type: 'batchManage/approvefetch',
        payload: {
          Content: {
            SearchText: '',
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

  onSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows: [...selectedRows], selectedRowKeys: [...selectedRowKeys] });
  };

  // eslint-disable-next-line consistent-return
  approveHandle = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows.length) return false;
    const Code = selectedRows.map(item => item.Code);
    dispatch({
      type: 'batchManage/approve',
      payload: {
        Content: {
          Code,
          ApproveSts: 'Y',
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('审批通过');
          dispatch({
            type: 'batchManage/approvefetch',
            payload: {
              Content: {
                SearchText: '',
              },
              page: 1,
              rows: 30,
              sidx: 'Code',
              sord: 'Desc',
            },
          });
          this.setState({
            selectedRows: [],
            selectedRowKeys: [],
          });
        }
      },
    });
  };

  uploadHandle = () => {};

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      batchManage: { queryData },
    } = this.props;
    const { SlpCode } = queryData.Content;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem key="SlpCode" {...formLayout} label="销售员">
              {getFieldDecorator('SlpCode', { initialValue: SlpCode })(
                <SalerPurchaser initialValue={SlpCode} />
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
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
      batchManage: { batchApproveList, pagination },
      searchLoading,
    } = this.props;
    const { selectedRowKeys } = this.state;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <Table
              loading={searchLoading}
              dataSource={batchApproveList}
              pagination={pagination}
              rowKey="Code"
              scroll={{ x: 1200, y: 600 }}
              rowSelection={{
                selectedRowKeys,
                onChange: this.onSelectRow,
              }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <FooterToolbar>
          <Button type="primary" onClick={this.approveHandle}>
            通过
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default BatchUpload;
