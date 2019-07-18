import React, { memo } from 'react';
import { Row, Col, Table, Card } from 'antd';
import { NumberInfo, Charts } from 'ant-design-pro';

const { MiniArea } = Charts;

const columns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '名字',
    dataIndex: 'x',
  },
  {
    title: '数量',
    dataIndex: 'y',
  },
];



const TopSearch = memo(({ loading, docProcessData, dropdownGroup }) => (
  <Card
    loading={loading}
    bordered={false}
    title="未处理单据"
    extra={dropdownGroup}
    bodyStyle={{ padding: 24 }}
    style={{ marginTop: 24, height: 500 }}
  >
    <Row gutter={34}>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo subTitle="销售未处理" gap={8} total={docProcessData.SDocCount} />
        <MiniArea line height={45} data={docProcessData.SUserDocInfo} />
      </Col>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo subTitle="采购未处理" total={docProcessData.PDocCount} gap={8} />
        <MiniArea line height={45} data={docProcessData.PUserDocInfo} />
      </Col>
    </Row>
    <Row gutter={34}>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <Table
          size="small"
          columns={columns}
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
