import React, { memo } from 'react';
import { Row, Col } from 'antd';
import { Charts, Trend } from 'ant-design-pro';
import numeral from 'numeral';
import styles from '../style.less';
import Yuan from '../utils/Yuan';

const { ChartCard, MiniArea, MiniBar, Field } = Charts;

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = memo(
  ({
    loading,
    monthlySalesData,
    monthlyPurchaseData,
    monthlyPaymentRuleData,
    monthlyReceiptData,
  }) => (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="月销售总计"
          loading={loading}
          total={() => <Yuan>{monthlySalesData.DocTotal}</Yuan>}
          footer={
            <Field
              label="日销售额"
              value={`￥${numeral(monthlySalesData.DayDocTotal).format('0,0')}`}
            />
          }
          contentHeight={46}
        >
          <Trend flag="up" style={{ marginRight: 16 }}>
            销售天同比
            <span className={styles.trendText}>{monthlySalesData.DayRate}</span>
          </Trend>
          <Trend flag="down">
            销售月同比
            <span className={styles.trendText}>{monthlySalesData.MonthRate}</span>
          </Trend>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="月采购总计"
          loading={loading}
          total={() => <Yuan>{monthlyPurchaseData.DocTotal}</Yuan>}
          footer={
            <Field
              label="日采购额"
              value={`￥${numeral(monthlyPurchaseData.DayDocTotal).format('0,0')}`}
            />
          }
          contentHeight={46}
        >
          <Trend flag="up" style={{ marginRight: 16 }}>
            采购日同比
            <span className={styles.trendText}>{monthlyPurchaseData.DayRate}</span>
          </Trend>
          <Trend flag="down">
            采购月同比
            <span className={styles.trendText}>{monthlyPurchaseData.MonthRate}</span>
          </Trend>
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="月收款额"
          total={numeral(monthlyReceiptData.DocTotal).format('0,0')}
          footer={
            <Field label="日收款额" value={numeral(monthlyReceiptData.DayDocTotal).format('0,0')} />
          }
          contentHeight={46}
        >
          <MiniArea color="#975FE4" data={monthlyReceiptData.DayReceiptList} />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="月付款额"
          total={numeral(monthlyPaymentRuleData.DocTotal).format('0,0')}
          footer={<Field label="日付款额" value={monthlyPaymentRuleData.DayDocTotal} />}
          contentHeight={46}
        >
          <MiniBar data={monthlyPaymentRuleData.DayPaymentList} />
        </ChartCard>
      </Col>
    </Row>
  )
);

export default IntroduceRow;
