import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Tooltip, Select, Table } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ batchManage, loading, global }) => ({
  batchManage,
  global,
  searchLoading: loading.effects['batchManage/uploadfetch'],
  uploadLoading: loading.effects['batchManage/upload'],
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
      title: '附件描述',
      width: 200,
      dataIndex: 'AttachmentName',
      align: 'center',
    },
    {
      title: '附件',
      width: 100,
      dataIndex: 'AttachmentPath',
      render: val => (val ? <img style={{ width: 50, height: 50 }} src={val} alt="主图" /> : ''),
    },
    {
      title: '物料代码',
      width: 100,
      dataIndex: 'ItemCode',
      render: (text, record) => (
        <Tooltip
          title={
            <Fragment>
              {record.CellphoneNO}
              <br />
              {record.Email}
              <br />
              {record.PhoneNO}
            </Fragment>
          }
        >
          {text}
        </Tooltip>
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

  state = {
    selectedRows: [],
    selectedRowKeys: [],
  };

  componentDidMount() {
    const {
      dispatch,
      batchManage: { queryData },
    } = this.props;
    dispatch({
      type: 'batchManage/uploadfetch',
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
      batchManage: { queryData },
    } = this.props;
    dispatch({
      type: 'batchManage/uploadfetch',
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
        type: 'batchManage/uploadfetch',
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
  uploadHandle = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    if (!selectedRows.length) return false;
    const AttachmentCode = selectedRows.map(item => item.Code);
    dispatch({
      type: 'batchManage/upload',
      payload: {
        Content: {
          AttachmentCode,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          window.open(response.Content.Url);
        }
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      global: { TI_Z004 },
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem key="Code" {...formLayout}>
              {getFieldDecorator('Code')(<Input placeholder="请输入批次号" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem key="ItemCode" {...formLayout}>
              {getFieldDecorator('ItemCode')(<Input placeholder="请输入物料代码" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="ApproveBy" {...formLayout} label="销售员">
              {getFieldDecorator('ApproveBy')(
                <Select
                  showArrow={false}
                  mode="multiple"
                  placeholder="选择名称"
                  filterOption={false}
                  style={{ width: '100%' }}
                >
                  {TI_Z004.map(option => (
                    <Option key={option.Key} value={option.Key}>
                      {option.Value}
                    </Option>
                  ))}
                </Select>
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
      batchManage: { batchUploadList, pagination },
      searchLoading,
      uploadLoading,
    } = this.props;
    const { selectedRowKeys } = this.state;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <Table
              loading={searchLoading}
              dataSource={batchUploadList}
              pagination={pagination}
              rowKey="Code"
              scroll={{ x: 1000, y: 600 }}
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
          <Button type="primary" loading={uploadLoading} onClick={this.uploadHandle}>
            下载
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default BatchUpload;
