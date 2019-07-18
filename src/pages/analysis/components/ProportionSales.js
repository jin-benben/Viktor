import React, { memo } from 'react';
import { Card } from 'antd';
import { Charts } from 'ant-design-pro';
import styles from '../style.less';
import Yuan from '../utils/Yuan';

const { Pie } = Charts;

const ProportionSales = memo(({ loading, salesPieData }) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title="客户占比"
    bodyStyle={{ padding: 24 }}
    style={{ marginTop: 24, height: 500 }}
  >
    <div
      style={{
        minHeight: 380,
      }}
    >
      <Pie
        hasLegend
        subTitle="销售额"
        total={() => <Yuan>{salesPieData.reduce((pre, now) => Number(now.y) + pre, 0)}</Yuan>}
        data={salesPieData}
        valueFormat={value => <Yuan>{value}</Yuan>}
      />
    </div>
  </Card>
));

export default ProportionSales;
