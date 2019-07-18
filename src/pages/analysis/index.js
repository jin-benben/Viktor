import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Icon, Menu, Dropdown, Col } from 'antd';
import moment from 'moment';
import { getTimeDistance } from './utils/utils';

import styles from './style.less';
import PageLoading from '@/components/PageLoading';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));
const TopSearch = React.lazy(() => import('./components/TopSearch'));
const TopSearchNo = React.lazy(() => import('./components/TopSearchNo'));
const ProportionSales = React.lazy(() => import('./components/ProportionSales'));

@connect(({ analysis, loading }) => ({
  analysis,
  loading: loading.effects['analysis/fetch'],
}))
class Analysis extends Component {
  state = {
    currentTabKey: 'sales',
    TopCount: '10',
    rangePickerValue: getTimeDistance('month'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { rangePickerValue } = this.state;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'analysis/getHomeData',
        payload: {
          Content: {
            CalcDate: moment().format('YYYY-MM-DD'),
          },
        },
      });
      dispatch({
        type: 'analysis/getAllSaleData',
        payload: {
          Content: {
            FromDate: rangePickerValue[0],
            ToDate: rangePickerValue[1],
          },
        },
      });
      dispatch({
        type: 'analysis/getAllPurchaseData',
        payload: {
          Content: {
            FromDate: rangePickerValue[0],
            ToDate: rangePickerValue[1],
            TopCount: '10',
          },
        },
      });
      dispatch({
        type: 'analysis/getCustomerSaleList',
        payload: {
          Content: {
            FromDate: rangePickerValue[0],
            ToDate: rangePickerValue[1],
            TopCount: '10',
          },
        },
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'analysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });
    dispatch({
      type: 'analysis/fetchSalesData',
    });
  };

  changeGroup = e => {
    const { rangePickerValue } = this.state;
    const { dispatch } = this.props;
    this.setState({
      TopCount: e.target.value,
    });
    dispatch({
      type: 'analysis/getAllPurchaseData',
      payload: {
        Content: {
          FromDate: rangePickerValue[0],
          ToDate: rangePickerValue[1],
          TopCount: e.target.value,
        },
      },
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    const { currentTabKey } = this.state;
    const rangePickerValue = getTimeDistance(type);
    this.setState({
      rangePickerValue,
    });
    if (currentTabKey === 'sales') {
      dispatch({
        type: 'analysis/getAllSaleData',
        payload: {
          Content: {
            FromDate: rangePickerValue[0],
            ToDate: rangePickerValue[1],
          },
        },
      });
    } else {
      dispatch({
        type: 'analysis/getAllPurchaseData',
        payload: {
          Content: {
            FromDate: rangePickerValue[0],
            ToDate: rangePickerValue[1],
            TopCount: '20',
          },
        },
      });
    }
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const { rangePickerValue, TopCount } = this.state;
    const { analysis, loading } = this.props;
    const { allSaleData, allPurchaseData, customerSaleListData, docProcessData,noDocProcessData } = analysis;
    console.log(docProcessData)
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );
    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    return (
      <React.Fragment>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} {...analysis} />
        </Suspense>
        <Suspense fallback={null}>
          <SalesCard
            rangePickerValue={rangePickerValue}
            allSaleData={allSaleData}
            isActive={this.isActive}
            handleTabChange={this.handleTabChange}
            allPurchaseData={allPurchaseData}
            handleRangePickerChange={this.handleRangePickerChange}
            loading={loading}
            TopCount={TopCount}
            changeGroup={this.changeGroup}
            selectDate={this.selectDate}
          />
        </Suspense>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <TopSearch
                loading={loading}
                docProcessData={docProcessData}
                selectDate={this.selectDate}
                dropdownGroup={dropdownGroup}
              />
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <TopSearchNo
                loading={loading}
                docProcessData={noDocProcessData}
                selectDate={this.selectDate}
                dropdownGroup={dropdownGroup}
              />
            </Suspense>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ProportionSales
                dropdownGroup={dropdownGroup}
                loading={loading}
                salesPieData={customerSaleListData}
              />
            </Suspense>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Analysis;
