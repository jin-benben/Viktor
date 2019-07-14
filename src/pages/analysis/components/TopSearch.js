import React, { memo } from 'react';
import { Row, Col, Table, Tooltip, Card, Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { Trend, NumberInfo, Charts } from 'ant-design-pro';
import numeral from 'numeral';
import styles from '../style.less';

const { MiniArea } = Charts;

const columns = [
  {
    title: <FormattedMessage id="analysis.table.rank" defaultMessage="Rank" />,
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: <FormattedMessage id="analysis.table.search-keyword" defaultMessage="Search keyword" />,
    dataIndex: 'keyword',
    key: 'keyword',
    render: text => <a href="/">{text}</a>,
  },
  {
    title: <FormattedMessage id="analysis.table.users" defaultMessage="Users" />,
    dataIndex: 'count',
    key: 'count',
    sorter: (a, b) => a.count - b.count,
    className: styles.alignRight,
  },
  {
    title: <FormattedMessage id="analysis.table.weekly-range" defaultMessage="Weekly Range" />,
    dataIndex: 'range',
    key: 'range',
    sorter: (a, b) => a.range - b.range,
    render: (text, record) => (
      <Trend flag={record.status === 1 ? 'down' : 'up'}>
        <span style={{ marginRight: 4 }}>{text}%</span>
      </Trend>
    ),
    align: 'right',
  },
];

const TopSearch = memo(({ loading, docProcessData, searchData, dropdownGroup }) => (
  <Card
    loading={loading}
    bordered={false}
    title={
      <FormattedMessage
        id="analysis.analysis.online-top-search"
        defaultMessage="Online Top Search"
      />
    }
    extra={dropdownGroup}
    style={{ marginTop: 24 }}
  >
    <Row gutter={68}>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo subTitle="销售未处理" gap={8} total={docProcessData.SDocCount} />
        <MiniArea line height={45} data={docProcessData.SUserDocInfo} />
      </Col>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo subTitle="采购未处理" total={docProcessData.PDocCount} gap={8} />
        <MiniArea line height={45} data={docProcessData.PUserDocInfo} />
      </Col>
    </Row>
    <Table
      rowKey={record => record.index}
      size="small"
      columns={columns}
      dataSource={searchData}
      pagination={{
        style: { marginBottom: 0 },
        pageSize: 5,
      }}
    />
  </Card>
));

export default TopSearch;
