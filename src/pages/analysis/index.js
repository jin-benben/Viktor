import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Icon, Menu, Dropdown } from 'antd';
import moment from 'moment';
import { getTimeDistance } from './utils/utils';

import styles from './style.less';
import PageLoading from './components/PageLoading';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));
const TopSearch = React.lazy(() => import('./components/TopSearch'));

@connect(({ analysis, loading }) => ({
  analysis,
  loading: loading.effects['analysis/fetch'],
}))
class Analysis extends Component {
  state = {
    currentTabKey: '',
    rangePickerValue: getTimeDistance('today'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
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
            FromDate: moment().format('YYYY-MM-DD'),
            ToDate: moment().format('YYYY-MM-DD'),
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

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'analysis/fetchSalesData',
    });
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
    const { rangePickerValue, currentTabKey } = this.state;
    const { analysis, loading } = this.props;
    const { allSaleData, allPurchaseData, customerSaleListData, docProcessData } = analysis;

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
            allPurchaseData={allPurchaseData}
            handleRangePickerChange={this.handleRangePickerChange}
            loading={loading}
            selectDate={this.selectDate}
          />
        </Suspense>
        <Row gutter={24}>
          <Suspense fallback={null}>
            <TopSearch
              loading={loading}
              docProcessData={docProcessData}
              selectDate={this.selectDate}
              searchData={customerSaleListData}
              dropdownGroup={dropdownGroup}
            />
          </Suspense>
        </Row>
      </React.Fragment>
    );
  }
}

export default Analysis;
