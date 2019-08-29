import React, { memo, Fragment } from 'react';
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
    <Row gutter={12} className={styles.homeCard}>
      <Col className={styles.colParent} {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          style={{ width: '100%' }}
          title="月销总计"
          loading={loading}
          total={() => (
            <Row>
              <Col span={12}>
                <Yuan style={{ fontSize: '20px' }}>{monthlySalesData.DocTotal}</Yuan>
              </Col>
              <Col span={12}>
                <Yuan style={{ fontSize: '20px' }}>{monthlySalesData.QuoteDocTotal}</Yuan>
              </Col>
            </Row>
          )}
          footer={
            <Row>
              <Col span={12}>
                <Field
                  label="日销售"
                  value={`￥${numeral(monthlySalesData.DayDocTotal).format('0,0')}`}
                />
              </Col>
              <Col span={12}>
                <Field
                  label="日合同"
                  value={`￥${numeral(monthlySalesData.QuoteDayDocTotal).format('0,0')}`}
                />
              </Col>
            </Row>
          }
          contentHeight={46}
        >
          <Row>
            <Col span={12}>
              <Trend
                flag={monthlySalesData.DayRate > 0 ? 'up' : 'down'}
                style={{ marginRight: 16 }}
              >
                销日同比
                <span className={styles.trendText}>{monthlySalesData.DayRate}</span>
              </Trend>
            </Col>
            <Col span={12}>
              <Trend flag={monthlySalesData.MonthRate > 0 ? 'up' : 'down'}>
                销月同比
                <span className={styles.trendText}>{monthlySalesData.MonthRate}</span>
              </Trend>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Trend
                flag={monthlySalesData.QuoteDayRate > 0 ? 'up' : 'down'}
                style={{ marginRight: 16 }}
              >
                合日同比
                <span className={styles.trendText}>{monthlySalesData.QuoteDayRate}</span>
              </Trend>
            </Col>
            <Col span={12}>
              <Trend flag={monthlySalesData.QuoteMonthRate > 0 ? 'up' : 'down'}>
                合月同比
                <span className={styles.trendText}>{monthlySalesData.QuoteMonthRate}</span>
              </Trend>
            </Col>
          </Row>
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
            日同比
            <span className={styles.trendText}>{monthlyPurchaseData.DayRate}</span>
          </Trend>
          <Trend flag={monthlyPurchaseData.MonthRate > 0 ? 'up' : 'down'}>
            月同比
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
