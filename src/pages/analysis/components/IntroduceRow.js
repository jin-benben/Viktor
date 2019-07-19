import React, { memo } from 'react';
import { Row, Col, DatePicker } from 'antd';
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
    defaultValue,
    monthlyPayment,
    monthlySales,
    monthlyPurchase,
    monthlyReceipt,
  }) => (
    <Row gutter={24} className={styles.homeCard}>
      <Col className={styles.colParent} {...topColResponsiveProps}>
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
          <Trend flag={monthlySalesData.DayRate > 0 ? 'up' : 'down'} style={{ marginRight: 16 }}>
            销售天同比
            <span className={styles.trendText}>{monthlySalesData.DayRate}</span>
          </Trend>
          <Trend flag={monthlySalesData.MonthRate > 0 ? 'up' : 'down'}>
            销售月同比
            <span className={styles.trendText}>{monthlySalesData.MonthRate}</span>
          </Trend>
        </ChartCard>
        <DatePicker
          defaultValue={defaultValue}
          className={styles.datePosition}
          onChange={(_, dateString) => monthlySales(dateString)}
        />
      </Col>
      <Col className={styles.colParent} {...topColResponsiveProps}>
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
          <Trend flag={monthlyPurchaseData.DayRate > 0 ? 'up' : 'down'} style={{ marginRight: 16 }}>
            采购日同比
            <span className={styles.trendText}>{monthlyPurchaseData.DayRate}</span>
          </Trend>
          <Trend flag={monthlyPurchaseData.MonthRate > 0 ? 'up' : 'down'}>
            采购月同比
            <span className={styles.trendText}>{monthlyPurchaseData.MonthRate}</span>
          </Trend>
        </ChartCard>
        <DatePicker
          defaultValue={defaultValue}
          className={styles.datePosition}
          onChange={(_, dateString) => monthlyPurchase(dateString)}
        />
      </Col>

      <Col className={styles.colParent} {...topColResponsiveProps}>
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
        <DatePicker
          defaultValue={defaultValue}
          className={styles.datePosition}
          onChange={(_, dateString) => monthlyReceipt(dateString)}
        />
      </Col>
      <Col className={styles.colParent} {...topColResponsiveProps}>
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
        <DatePicker
          defaultValue={defaultValue}
          className={styles.datePosition}
          onChange={(_, dateString) => monthlyPayment(dateString)}
        />
      </Col>
    </Row>
  )
);

export default IntroduceRow;
