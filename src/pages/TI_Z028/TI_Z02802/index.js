/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import { Card, Table, Button, Icon, List } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import styles from '../style.less';
import { getName } from '@/utils/utils';

const { Description } = DescriptionList;

@connect(({ TI_Z02802, global }) => ({
  global,
  TI_Z02802,
}))
class TI_Z02802 extends PureComponent {
  columns = [
    {
      title: '客询价单',
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
      dataIndex: 'DocDate',
      width: 120,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '创建日期',
      width: 120,
      dataIndex: 'CreateDate',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '销售员',
      width: 100,
      dataIndex: 'Saler',
      render: text => {
        const {
          global: { Saler },
        } = this.props;
        return <span>{getName(Saler, text)}</span>;
      },
    },
    {
      title: '客户参考号',
      width: 120,
      dataIndex: 'NumAtCard',
    },
    {
      title: 'SKU',
      width: 80,
      dataIndex: 'SKU',
    },
    {
      title: '产品描述',
      width: 150,
      dataIndex: 'SKUName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}{' '}
        </Ellipsis>
      ),
    },
    {
      title: '品牌',
      width: 80,
      dataIndex: 'BrandName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}{' '}
        </Ellipsis>
      ),
    },
    {
      title: '名称',
      width: 100,
      dataIndex: 'ProductName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}{' '}
        </Ellipsis>
      ),
    },
    {
      title: '型号',
      width: 100,
      dataIndex: 'ManufactureNO',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}{' '}
        </Ellipsis>
      ),
    },
    {
      title: '参数',
      width: 100,
      dataIndex: 'Parameters',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}{' '}
        </Ellipsis>
      ),
    },
    {
      title: '包装',
      width: 100,
      dataIndex: 'Package',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}{' '}
        </Ellipsis>
      ),
    },
    {
      title: '采购员',
      width: 80,
      dataIndex: 'Purchaser',
      render: text => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, text)}</span>;
      },
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
      title: '行备注',
      width: 100,
      dataIndex: 'SLineComment',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '要求交期',
      dataIndex: 'DueDate',
      width: 120,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '采购价格',
      width: 100,
      dataIndex: 'Price',
    },
    {
      title: '采购交期',
      width: 120,
      dataIndex: 'InquiryDueDate',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '采购备注',
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
      width: 150,
      dataIndex: 'CardName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}{' '}
        </Ellipsis>
      ),
    },
  ];

  childColumns = [
    // {
    //   title: '询价单号',
    //   width: 150,
    //   dataIndex: 'PInquiryEntry',
    // },
    // {
    //   title: '询价单行',
    //   width: 80,
    //   dataIndex: 'PInquiryLineID',
    // },
    {
      title: '询价日期',
      width: 100,
      dataIndex: 'CreateDate',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '供应商',
      width: 80,
      dataIndex: 'CardName',
    },
    {
      title: '价格',
      width: 100,
      dataIndex: 'Price',
    },
    {
      title: '型号',
      width: 100,
      dataIndex: 'ManufactureNO',
    },
    {
      title: '交期',
      width: 100,
      dataIndex: 'InquiryDueDate',
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
      title: '最优',
      width: 80,
      dataIndex: 'IsSelect',
      render: val => <span>{val === 'Y' ? '是' : '否'}</span>,
    },
  ];

  state = {
    purchaseDetail: {},
  };

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.DocEntry) {
      dispatch({
        type: 'TI_Z02802/fetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
          },
        },
      });
    }
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Purchaser', 'Curr'],
        },
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'TI_Z02802/save',
      payload: {
        purchaseDetail: {},
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.TI_Z02802.purchaseDetail !== prevState.purchaseDetail) {
      return {
        purchaseDetail: nextProps.TI_Z02802.purchaseDetail,
      };
    }
    return null;
  }

  expandedRowRender = record => (
    <List
      itemLayout="horizontal"
      style={{ marginLeft: 60 }}
      className={styles.askInfo}
      dataSource={record.TI_Z02803}
      renderItem={item => (
        <List.Item>
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
                  交期：<span>{moment(item.InquiryDueDate).format('YYYY-MM-DD')}</span>
                </li>
                <li>
                  询价返回时间：<span>{moment(item.PriceRDateTime).format('YYYY-MM-DD')}</span>
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

  render() {
    const { purchaseDetail } = this.state;
    const {
      global: { Purchaser, TI_Z004 },
    } = this.props;

    return (
      <Card bordered={false}>
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="单号">{purchaseDetail.DocEntry}</Description>
          <Description term="单据日期">
            {moment(purchaseDetail.DocDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="创建日期">
            {moment(purchaseDetail.CreateDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="有效日期">
            {moment(purchaseDetail.ToDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="询价总计">{purchaseDetail.InquiryDocTotal}</Description>
          <Description term="询价总计(本币)">{purchaseDetail.InquiryDocTotalLocal}</Description>
          <Description term="备注">{purchaseDetail.DocEntry}</Description>
          <Description term="创建人">
            <span>{getName(TI_Z004, purchaseDetail.CreateUser)}</span>
          </Description>
          <Description term="采购员">
            <span>{getName(Purchaser, purchaseDetail.Owner)}</span>
          </Description>
        </DescriptionList>

        <Table
          bordered
          style={{ marginBottom: 20, marginTop: 20 }}
          dataSource={purchaseDetail.TI_Z02802}
          rowKey="LineID"
          pagination={false}
          scroll={{ x: 2500, y: 500 }}
          expandedRowRender={this.expandedRowRender}
          columns={this.columns}
          onChange={this.handleStandardTableChange}
        />
        <FooterToolbar>
          <Button
            icon="plus"
            style={{ marginLeft: 8 }}
            type="primary"
            onClick={() => router.push('/purchase/TI_Z028/TI_Z02801')}
          >
            新建
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}

export default TI_Z02802;
