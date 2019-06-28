/* eslint-disable no-return-assign */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Icon,
  message,
  Modal,
  Tag,
} from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import MDMCommonality from '@/components/Select';
import Transfer from '@/components/Transfer';
import { getName } from '@/utils/utils';
import { transferBaseType } from '@/utils/publicData';

const { RangePicker } = DatePicker;
const { confirm } = Modal;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

/* eslint react/no-multi-comp:0 */
@connect(({ inquiryFetchtrack, loading, global }) => ({
  inquiryFetchtrack,
  global,
  loading: loading.models.inquiryFetchtrack,
}))
@Form.create()
class inquiryFetchtrackPage extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    transferModalVisible: false,
    transferLine: {},
  };

  columns = [
    {
      title: '处理人',
      fixed: 'left',
      width: 80,
      dataIndex: 'NewProcessor',
      render: (val, record) => {
        const {
          global: { TI_Z004 },
        } = this.props;
        return record.lastIndex ? '' : <span>{getName(TI_Z004, val)}</span>;
      },
    },
    {
      title: '处理角色',
      width: 80,
      dataIndex: 'NewRole',
      render: text => <span>{text === 'P' ? '采购' : '销售'}</span>,
    },
    {
      title: '客询价单',
      width: 80,
      dataIndex: 'BaseEntry',
    },

    {
      title: 'SKU',
      width: 80,
      dataIndex: 'SKU',
    },
    {
      title: '物料描述',
      dataIndex: 'SKUName',
    },
    {
      title: '数量',
      width: 80,
      dataIndex: 'Quantity',
    },
    {
      title: '单位',
      width: 50,
      dataIndex: 'Unit',
    },
    {
      title: '原处理人',
      width: 80,
      dataIndex: 'OldProcessor',
      render: val => {
        const {
          global: { TI_Z004 },
        } = this.props;
        return <span>{getName(TI_Z004, val)}</span>;
      },
    },
    {
      title: '备注',
      width: 120,
      dataIndex: 'Comment',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '关闭',
      width: 80,
      dataIndex: 'Closed',
      render: val => (val === 'Y' ? <Tag color="red">已关闭</Tag> : ''),
    },
    {
      title: '确认',
      width: 80,
      dataIndex: 'IsConfirm',
      render: val => (val === 'Y' ? <Tag color="blue">已确认</Tag> : ''),
    },
    {
      title: '单据类型',
      width: 100,
      dataIndex: 'SourceType',
      render: val => <span>{getName(transferBaseType, val)}</span>,
    },
    {
      title: '单号',
      width: 80,
      dataIndex: 'SourceEntry',
    },
    {
      title: '行号',
      width: 50,
      dataIndex: 'SourceLineID',
    },
    {
      title: '采购员',
      width: 100,
      dataIndex: 'Purchaser',
      align: 'center',
      render: val => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, val)}</span>;
      },
    },
    {
      title: '销售员',
      width: 100,
      dataIndex: 'Salesperson',
      align: 'center',
      render: val => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, val)}</span>;
      },
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      inquiryFetchtrack: { queryData },
    } = this.props;
    dispatch({
      type: 'inquiryFetchtrack/fetch',
      payload: {
        ...queryData,
      },
    });

    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Purchaser', 'TI_Z004'],
        },
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      inquiryFetchtrack: { queryData },
    } = this.props;
    dispatch({
      type: 'inquiryFetchtrack/fetch',
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
        type: 'inquiryFetchtrack/fetch',
        payload: {
          Content: {
            SearchText: '',
            QueryType: '1',
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

  toggleForm = () => {
    // 是否展开
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  handleModalVisible = flag => {
    this.setState({ transferModalVisible: !!flag });
  };

  // 转移
  toTransfer = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length) {
      this.setState({
        transferLine: selectedRows[0],
        transferModalVisible: true,
      });
    } else {
      message.warning('请先选择转移的行');
    }
  };

  // 确认
  confrimTransfer = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    if (selectedRows.length) {
      let ConfirmComment = '';
      confirm({
        icon: null,
        content: (
          <TextArea placeholder="请输入备注" onChange={e => (ConfirmComment = e.target.value)} />
        ),
        onOk() {
          // eslint-disable-next-line camelcase
          const TI_Z04304RequestItemList = selectedRows.map(item => ({
            DocEntry: item.DocEntry,
            ConfirmComment,
          }));
          dispatch({
            type: 'inquiryFetchtrack/confrim',
            payload: {
              Content: {
                TI_Z04304RequestItemList,
              },
            },
          });
        },
        onCancel() {},
      });
    } else {
      message.warning('请先选择需确认的行');
    }
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      global: { TI_Z004 },
    } = this.props;
    const { expandForm } = this.state;
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
            <FormItem label="日期" {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="SourceType" {...formLayout} label="来源类型">
              {getFieldDecorator('SourceType')(<MDMCommonality data={transferBaseType} />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="Processor" {...formLayout} label="处理人">
              {getFieldDecorator('Processor')(<MDMCommonality data={TI_Z004} />)}
            </FormItem>
          </Col>
          {expandForm ? (
            <Fragment>
              <Col md={4} sm={24}>
                <FormItem key="Closed" {...formLayout}>
                  {getFieldDecorator('Closed')(
                    <Select placeholder="请选择关闭状态">
                      <Option value="Y">已关闭</Option>
                      <Option value="N">未关闭</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={24}>
                <FormItem key="ConfirmStatus" {...formLayout}>
                  {getFieldDecorator('ConfirmStatus')(
                    <Select placeholder="请选择确认状态">
                      <Option value="Y">已确认</Option>
                      <Option value="N">未确认</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Fragment>
          ) : null}
          <Col md={5} sm={24}>
            <FormItem key="searchBtn">
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
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      inquiryFetchtrack: { trackList, pagination },
      loading,
    } = this.props;

    const transferParentMethods = {
      handleModalVisible: this.handleModalVisible,
    };

    const { transferLine, transferModalVisible } = this.state;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: trackList }}
              pagination={pagination}
              rowKey="DocEntry"
              columns={this.columns}
              scroll={{ x: 1500, y: 800 }}
              rowSelection={{
                onSelectRow: this.onSelectRow,
              }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <FooterToolbar>
          <Button
            icon="plus"
            type="primary"
            onClick={() => router.push('/sellabout/TI_Z026/TI_Z02601')}
          >
            新建
          </Button>
          <Button type="primary" onClick={this.confrimTransfer}>
            确认
          </Button>
          <Button type="primary" onClick={this.toTransfer}>
            转移
          </Button>
        </FooterToolbar>
        <Transfer
          SourceEntry={transferLine.DocEntry}
          SourceType="TI_Z043"
          modalVisible={transferModalVisible}
          {...transferParentMethods}
        />
      </Fragment>
    );
  }
}

export default inquiryFetchtrackPage;
