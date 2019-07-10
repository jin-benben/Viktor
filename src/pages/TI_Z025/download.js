import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Tag, Select, Table, Modal, Badge } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { getName } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { Meta } = Card;
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
      title: '物料描述',
      width: 100,
      dataIndex: 'ItemName',
      render: (text, record) => (
        <Link target="_blank" to={`/main/product/TI_Z009/TI_Z00903?Code=${record.ItemCode}`}>
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        </Link>
      ),
    },
    {
      title: '审核日期',
      dataIndex: 'ApproveDate',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
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
      render: text => {
        if (!text) return '';
        if (text === 'Y') return <Tag color="green">已通过</Tag>;
        return <Tag color="gold">未通过</Tag>;
      },
    },
    {
      title: '批次附件数',
      width: 100,
      dataIndex: 'AttachmentCount',
      render: (text, record) => (
        <Badge
          onClick={() => this.previewHandle(record)}
          count={text}
          style={{ backgroundColor: '#52c41a', cursor: 'pointer' }}
        />
      ),
    },
    {
      title: '创建日期',
      dataIndex: 'CreateDate',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '更新日期',
      dataIndex: 'UpdateDate',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
  ];

  state = {
    selectedRows: [],
    selectedRowKeys: [],
    attchList: [],
    modalVisible: false,
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
    const Code = selectedRows.map(item => item.Code);
    dispatch({
      type: 'batchManage/upload',
      payload: {
        Content: {
          Code,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          window.open(response.Content.Url);
        }
      },
    });
  };

  previewHandle = ({ Code }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'batchManage/detail',
      payload: {
        Content: {
          Code,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          this.setState({
            modalVisible: true,
            attchList: response.Content.TI_Z02502,
          });
        }
      },
    });
  };

  handleModalVisible = () => {
    this.setState({
      modalVisible: false,
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
            <FormItem key="ApproveBy" {...formLayout} label="审批人">
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
    const { selectedRowKeys, modalVisible, attchList } = this.state;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <Table
              loading={searchLoading}
              dataSource={batchUploadList}
              pagination={pagination}
              rowKey="key"
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
        <Modal
          width={960}
          footer={null}
          title="附件预览"
          visible={modalVisible}
          onCancel={() => this.handleModalVisible()}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {attchList.map(item => (
              <Card
                key={item.OrderID}
                hoverable
                style={{
                  width: 300,
                  height: 300,
                }}
                cover={
                  <img
                    style={{ width: 'auto', height: 200, margin: '0 auto 20px' }}
                    alt="example"
                    src={item.AttachmentPath}
                  />
                }
              >
                <Meta description={item.AttachmentName} />
              </Card>
            ))}
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default BatchUpload;
