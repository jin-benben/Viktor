import React, { memo } from 'react';
import { Row, Col, Card, Tabs, DatePicker, Radio } from 'antd';
import numeral from 'numeral';
import Link from 'umi/link';
import { Scrollbars } from 'react-custom-scrollbars';
import { Charts } from 'ant-design-pro';
import styles from '../style.less';

const { Bar } = Charts;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const SalesCard = memo(
  ({
    rangePickerValue,
    allPurchaseData,
    allSaleData,
    isActive,
    handleRangePickerChange,
    loading,
    TopCount,
    selectDate,
    handleTabChange,
    changeGroup,
  }) => (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs
          onChange={handleTabChange}
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <a className={isActive('today')} onClick={() => selectDate('today')}>
                  今日
                </a>
                <a className={isActive('week')} onClick={() => selectDate('week')}>
                  本周
                </a>
                <a className={isActive('month')} onClick={() => selectDate('month')}>
                  本月
                </a>
                <a className={isActive('quarter')} onClick={() => selectDate('quarter')}>
                  本季度
                </a>
                <a className={isActive('year')} onClick={() => selectDate('year')}>
                  本年
                </a>
              </div>
              <RangePicker
                value={rangePickerValue}
                onChange={handleRangePickerChange}
                style={{ width: 256 }}
              />
            </div>
          }
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane tab="销售额" key="sales">
            <Row>
              <Col xl={14} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Bar height={440} title="销售趋势" data={allSaleData.MonthSalesTotalList} />
                </div>
              </Col>
              <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>销售员排行</h4>
                  <Scrollbars style={{ minHeight: 380 }}>
                    <ul className={styles.rankingList}>
                      {allSaleData.SalesPersonTotalList.map((item, i) => (
                        <li key={item.x}>
                          <span
                            className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                          >
                            {i + 1}
                          </span>
                          <span className={styles.rankingItemTitle} title={item.x}>
                            {item.x}
                          </span>
                          <span className={styles.rankingItemValue}>
                            {numeral(item.y).format('0,0')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Scrollbars>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="采购额" key="purchase">
            <Row>
              <Col xl={14} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Bar
                    height={292}
                    title="采购趋势"
                    data={allPurchaseData.MonthPurchaseTotalList}
                  />
                </div>
              </Col>
              <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={`${styles.rankingTitle} ${styles.topGroup}`}>
                    供应商排行
                    <Radio.Group onChange={changeGroup} value={TopCount} defaultValue="10">
                      <Radio.Button value="10">Top10</Radio.Button>
                      <Radio.Button value="50">Top50</Radio.Button>
                      <Radio.Button value="100">Top100</Radio.Button>
                    </Radio.Group>
                  </h4>
                  <Scrollbars style={{ minHeight: 380 }}>
                    <ul className={styles.rankingList}>
                      {allPurchaseData.BrandTotalList.map((item, i) => (
                        <li key={item.x}>
                          <span
                            className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                          >
                            {i + 1}
                          </span>
                          <span className={styles.rankingItemTitle} title={item.x}>
                            <Link target="_blank" to={`/main/TI_Z007/detail?Code=${item.code}`}> {item.x}</Link>
                          </span>
                          <span>{numeral(item.y).format('0,0')}</span>
                        </li>
                      ))}
                    </ul>
                  </Scrollbars>
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  )
);

export default SalesCard;
