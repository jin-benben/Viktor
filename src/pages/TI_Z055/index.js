/* eslint-disable no-script-url */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Button, message, Icon, DatePicker, Select, Tag } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import StandardTable from '@/components/StandardTable';
import ConfirmModal from './components/confirm';
import { formLayout } from '@/utils/publicData';
import { getName } from '@/utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
/* eslint react/no-multi-comp:0 */
@connect(({ purchaserChange, loading, global }) => ({
  purchaserChange,
  global,
  loading: loading.models.purchaserChange,
  changeLoading: loading.effects['purchaserChange/add'],
}))
@Form.create()
class PurchaserChange extends PureComponent {
  columns = [
    {
      title: '单号',
      width: 100,
      dataIndex: 'BaseEntry',
      render: (text, recond) => (
        <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${text}`}>
          {`${text}-${recond.BaseLineID}`}
        </Link>
      ),
    },
    {
      title: '单据日期',
      width: 100,
      dataIndex: 'DocDate',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '询价状态',
      width: 80,
      dataIndex: 'LineStatus',
      align: 'center',
      render: text => (text === '1' ? <Tag color="green">询价</Tag> : <Tag color="gold">报价</Tag>),
    },
    {
      title: '询价生成状态',
      width: 120,
      dataIndex: 'InquiryStatus',
      align: 'center',
      render: text =>
        text === 'C' ? <Tag color="green">已生成</Tag> : <Tag color="gold">未生成</Tag>,
    },
    {
      title: '物料',
      width: 300,
      dataIndex: 'SKU',
      align: 'center',

      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {text ? (
            <Link target="_blank" to={`/main/product/TI_Z009/TI_Z00903?Code${text}`}>
              {text}-
            </Link>
          ) : (
            ''
          )}
          {record.SKUName}
        </Ellipsis>
      ),
    },
    {
      title: '品牌',
      width: 150,
      dataIndex: 'BrandName',
    },
    {
      title: '数量',
      width: 80,
      dataIndex: 'Quantity',
    },
    {
      title: '单位',
      width: 80,
      dataIndex: 'Unit',
    },
    {
      title: '采购员',
      width: 120,
      dataIndex: 'Purchaser',
      align: 'center',
      render: text => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, text)}</span>;
      },
    },
    {
      title: '销售员',
      width: 120,
      dataIndex: 'Saler',
      align: 'center',
      render: text => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, text)}</span>;
      },
    },
  ];

  state = {
    selectedRows: [],
    expandForm: false,
    modalVisible: false,
  };

  componentDidMount() {
    const {
      dispatch,
      purchaserChange: { queryData },
    } = this.props;
    dispatch({
      type: 'purchaserChange/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Purchaser', 'Saler'],
        },
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      purchaserChange: { queryData },
    } = this.props;
    dispatch({
      type: 'purchaserChange/fetch',
      payload: {
        ...queryData,
        page: pagination.current,
        rows: pagination.pageSize,
      },
    });
  };

  toggleForm = () => {
    // 是否展开
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const {
      dispatch,
      purchaserChange: { queryData },
      form,
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let DocDateFrom;
      let DocDateTo;
      if (fieldsValue.dateArr) {
        DocDateFrom = moment(fieldsValue.dateArr[0]).format('YYYY-MM-DD');
        DocDateTo = moment(fieldsValue.dateArr[1]).format('YYYY-MM-DD');
      }
      dispatch({
        type: 'purchaserChange/fetch',
        payload: {
          Content: {
            ...queryData.Content,
            ...fieldsValue,
            DocDateFrom,
            DocDateTo,
          },
          page: 1,
          rows: 30,
          sidx: 'DocEntry',
          sord: 'Desc',
        },
      });
    });
  };

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  openModal = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length) {
      this.setState({
        modalVisible: true,
      });
    } else {
      message.warning('请先选择');
    }
  };

  submitChange = rows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaserChange/add',
      payload: {
        Content: {
          TI_Z05502: rows,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('修改成功');
          router.go();
        }
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      global: { Purchaser },
    } = this.props;
    const { expandForm } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="日期" {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="PurchaserList" {...formLayout} label="采购员">
              {getFieldDecorator('PurchaserList')(
                <Select
                  showArrow={false}
                  mode="multiple"
                  placeholder="请选择"
                  filterOption={false}
                  style={{ width: '100%' }}
                >
                  {Purchaser.map(option => (
                    <Option key={option.Key} value={option.Key}>
                      {option.Value}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          {expandForm ? (
            <Fragment>
              <Col md={5} sm={24}>
                <FormItem key="LineStatus" {...formLayout} label="询价状态">
                  {getFieldDecorator('LineStatus')(
                    <Select placeholder="请选择">
                      <Option value="1">询价</Option>
                      <Option value="2">报价</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem key="InquiryStatus" {...formLayout} label="询价生成状态">
                  {getFieldDecorator('InquiryStatus')(
                    <Select placeholder="请选择">
                      <Option value="C">已生成</Option>
                      <Option value="O">未生成</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Fragment>
          ) : null}

          <Col md={8} sm={24}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                {expandForm ? (
                  <span>
                    收起 <Icon type="up" />
                  </span>
                ) : (
                  <span>
                    展开 <Icon type="down" />
                  </span>
                )}
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      purchaserChange: { orderList, pagination },
      loading,
      changeLoading,
    } = this.props;
    const { modalVisible, selectedRows } = this.state;
    const needParentMethods = {
      handleSubmit: this.submitChange,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList" style={{ with: 600 }}>
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: orderList }}
              rowKey="key"
              scroll={{ x: 1350 }}
              pagination={pagination}
              columns={this.columns}
              rowSelection={{
                onSelectRow: this.onSelectRow,
              }}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <FooterToolbar>
            <Button type="primary" loading={changeLoading} onClick={this.openModal}>
              修改
            </Button>
          </FooterToolbar>
          <ConfirmModal {...needParentMethods} data={selectedRows} modalVisible={modalVisible} />
        </Card>
      </Fragment>
    );
  }
}

export default PurchaserChange;
