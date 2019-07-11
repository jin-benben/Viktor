/* eslint-disable react/destructuring-assignment */
/* eslint-disable array-callback-return */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, DatePicker, Icon, List } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import Link from 'umi/link';
import StandardTable from '@/components/StandardTable';
import MDMCommonality from '@/components/Select';
import SalerPurchaser from '@/components/Select/SalerPurchaser/other';
import MyPageHeader from '../components/pageHeader';
import { getName } from '@/utils/utils';
import styles from '../style.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ TI_Z02804, loading, global }) => ({
  TI_Z02804,
  global,
  loading: loading.models.TI_Z02804,
}))
@Form.create()
class TI_Z02804 extends PureComponent {
  columns = [
    {
      title: '单号',
      width: 80,
      dataIndex: 'DocEntry',
      render: (text, recond) => (
        <Link target="_blank" to={`/purchase/TI_Z028/TI_Z02802?DocEntry=${text}`}>
          {`${text}-${recond.LineID}`}
        </Link>
      ),
    },
    {
      title: '单据日期',
      dataIndex: 'CreateDate',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '客询价单',
      width: 80,
      dataIndex: 'BaseEntry',
      render: (val, record) => (
        <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${record.BaseEntry}`}>
          {`${val}-${record.BaseLineID}`}
        </Link>
      ),
    },
    {
      title: '物料',
      dataIndex: 'SKU',
      align: 'center',
      width: 300,
      render: (text, record) =>
        record.lastIndex ? (
          ''
        ) : (
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
      title: '名称(外)',
      width: 100,
      dataIndex: 'ForeignName',
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {text}-{record.ForeignParameters}
        </Ellipsis>
      ),
    },
    {
      title: '数量',
      width: 100,
      dataIndex: 'Quantity',
      align: 'center',
      render: (text, record) => <span>{`${text}(${record.Unit})`}</span>,
    },
    {
      title: '价格',
      width: 120,
      dataIndex: 'Price',
      align: 'center',
      render: (text, record) =>
        record.lastIndex ? '' : <span>{`${text}-${record.Currency || ''}-${record.DocRate}`}</span>,
    },

    {
      title: '总/确认',
      width: 80,
      dataIndex: 'SubRowCount',
      render: (val, record) => (
        <span
          style={{ color: `${record.SubRowCount !== record.PriceRStatusCount ? 'red' : '#666'}` }}
        >
          {`${record.SubRowCount}/${record.PriceRStatusCount}`}
        </span>
      ),
    },
    {
      title: '运费',
      width: 80,
      dataIndex: 'ForeignFreight',
    },
    {
      title: '采购交期',
      width: 100,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '备注',
      width: 100,
      dataIndex: 'LineComment',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '供应商',
      dataIndex: 'CardName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },

    {
      title: '采购员',
      width: 120,
      dataIndex: 'Purchaser',
      render: text => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, text)}</span>;
      },
    },
  ];

  state = {
    expandForm: false,
  };

  componentDidMount() {
    const {
      dispatch,
      TI_Z02804: { queryData },
    } = this.props;
    dispatch({
      type: 'TI_Z02804/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'Company', 'Purchaser'],
        },
      },
    });
    dispatch({
      type: 'global/getAuthority',
    });
  }

  expandedRowRender = record => (
    <List
      itemLayout="horizontal"
      style={{ marginLeft: 60 }}
      className={styles.askInfo}
      dataSource={record.TI_Z02803}
      renderItem={item => (
        <List.Item key={item.Key}>
          <List.Item.Meta
            title={`${item.CardName}(${item.CardCode})`}
            description={
              <ul className={styles.itemInfo}>
                <li>
                  联系人：<span>{item.Contacts}</span>
                </li>
                <li>
                  手机：<span>{item.CellphoneNO}</span>
                </li>
                <li>
                  邮箱：<span>{item.Email}</span>
                </li>
                <li>
                  备注：<span>{item.LineComment}</span>
                </li>
                <li>
                  价格：<span>{item.Price}</span>
                </li>
                <li>
                  交期：
                  <span>{item.InquiryDueDate}</span>
                </li>
                <li>
                  询价返回时间：
                  <span>
                    {item.PriceRDateTime ? moment(item.PriceRDateTime).format('YYYY-MM-DD') : ''}
                  </span>
                </li>
                <li>
                  询价单号：
                  <Link
                    target="_blank"
                    style={{ marginLeft: 10 }}
                    to={`/purchase/TI_Z027/update?DocEntry=${item.PInquiryEntry}`}
                  >
                    {item.PInquiryEntry}
                  </Link>
                </li>
                <li>
                  最优：
                  <span>
                    {item.IsSelect === 'Y' ? (
                      <Icon type="smile" theme="twoTone" />
                    ) : (
                      <Icon type="frown" theme="twoTone" />
                    )}
                  </span>
                </li>
                <li>
                  币种：
                  <span>{getName(this.props.global.Curr, item.Currency)}</span>
                </li>
                <li>
                  汇率：
                  <span>{item.DocRate}</span>
                </li>
              </ul>
            }
          />
        </List.Item>
      )}
    />
  );

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      TI_Z02804: { queryData },
    } = this.props;
    dispatch({
      type: 'TI_Z02804/fetch',
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
      delete fieldsValue.dateArr;
      const queryData = {
        ...fieldsValue,
        DocDateFrom,
        DocDateTo,
      };
      dispatch({
        type: 'TI_Z02804/fetch',
        payload: {
          Content: {
            SearchText: '',
            SearchKey: 'Name',
            ...queryData,
          },
          page: 1,
          rows: 30,
          sidx: 'DocEntry',
          sord: 'Desc',
        },
      });
    });
  };

  // form表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      global: { Saler },
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
          <Col md={6} sm={24}>
            <FormItem label="日期" {...formLayout}>
              {getFieldDecorator('dateArr', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="Owner" {...formLayout} label="采购员">
              {getFieldDecorator('Owner')(<SalerPurchaser />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem {...formLayout} label="销售员">
              {getFieldDecorator('Saler')(<MDMCommonality placeholder="销售员" data={Saler} />)}
            </FormItem>
          </Col>
          {expandForm ? (
            <Fragment>
              <Col md={5} sm={24}>
                <FormItem {...formLayout} label="单号">
                  <FormItem className="lineFormItem" key="DocEntryFrom">
                    {getFieldDecorator('DocEntryFrom')(<Input placeholder="开始单号" />)}
                  </FormItem>
                  <span className="lineFormItemCenter">-</span>
                  <FormItem className="lineFormItem" key="DocEntryTo">
                    {getFieldDecorator('DocEntryTo')(<Input placeholder="结束单号" />)}
                  </FormItem>
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem {...formLayout} label="询价单号">
                  <FormItem className="lineFormItem" key="DocEntryFrom">
                    {getFieldDecorator('BaseEntryFrom')(<Input placeholder="开始单号" />)}
                  </FormItem>
                  <span className="lineFormItemCenter">-</span>
                  <FormItem className="lineFormItem" key="DocEntryTo">
                    {getFieldDecorator('BaseEntryTo')(<Input placeholder="结束单号" />)}
                  </FormItem>
                </FormItem>
              </Col>
            </Fragment>
          ) : (
            ''
          )}

          <Col md={4} sm={24}>
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
      TI_Z02804: { orderList, pagination },
      loading,
      location,
    } = this.props;
    return (
      <Card bordered={false}>
        <MyPageHeader {...location} />
        <div className="tableList">
          <div className="tableListForm">{this.renderSimpleForm()}</div>
          <StandardTable
            loading={loading}
            data={{ list: orderList }}
            pagination={pagination}
            rowKey="Key"
            scroll={{ x: 1500 }}
            expandedRowRender={this.expandedRowRender}
            columns={this.columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card>
    );
  }
}

export default TI_Z02804;
