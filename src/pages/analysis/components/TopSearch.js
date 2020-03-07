import React, { memo } from 'react';
import { Row, Col, Table, Card, DatePicker } from 'antd';
import { NumberInfo, Charts } from 'ant-design-pro';

const { MiniBar } = Charts;

const columns = [
  {
    title: '序',
    dataIndex: 'key',
  },
  {
    title: '名字',
    dataIndex: 'Name',
  },
  {
    title: '邮',
    dataIndex: 'Count1',
  },
  {
    title: '报',
    dataIndex: 'Count2',
  },
  {
    title: '总',
    dataIndex: 'Total',
  },
];
const columns1 = [
  {
    title: '序',
    dataIndex: 'key',
  },
  {
    title: '名字',
    dataIndex: 'Name',
  },
  {
    title: '询',
    dataIndex: 'Count1',
  },
  {
    title: '报',
    dataIndex: 'Count2',
  },
  {
    title: '合',
    dataIndex: 'Count3',
  },
  {
    title: '总',
    dataIndex: 'Total',
  },
];

const TopSearch = memo(({ loading, docProcessData, defaultValue, selectDate }) => (
  <Card
    loading={loading}
    bordered={false}
    title="已处理单据"
    extra={
      <DatePicker
        defaultValue={defaultValue}
        onChange={(_, dateString) => selectDate(dateString)}
      />
    }
    bodyStyle={{ padding: 24 }}
    style={{ marginTop: 24, height: 500 }}
  >
    <Row gutter={20}>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo
          subTitle="销售已处理"
          gap={8}
          total={docProcessData.SDocCount}
          subTotal={
            <span>{`询:${docProcessData.SCount1} 报:${docProcessData.SCount2} 合:${
              docProcessData.SCount3
            }`}
            </span>
          }
        />
        <MiniBar data={docProcessData.SUserDocInfo} />
      </Col>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo
          subTitle="采购已处理"
          total={docProcessData.PDocCount}
          gap={8}
          subTotal={<span>{`邮:${docProcessData.PCount1} 报:${docProcessData.PCount2}`}</span>}
        />
        <MiniBar data={docProcessData.PUserDocInfo} />
      </Col>
    </Row>
    <Row gutter={20}>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <Table
          size="small"
          columns={columns1}
          dataSource={docProcessData.SUserDocInfo}
          pagination={{
            style: { marginBottom: 0 },
            pageSize: 5,
          }}
        />
      </Col>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <Table
          size="small"
          columns={columns}
          dataSource={docProcessData.PUserDocInfo}
          pagination={{
            style: { marginBottom: 0 },
            pageSize: 5,
          }}
        />
      </Col>
    </Row>
  </Card>
));

export default TopSearch;
