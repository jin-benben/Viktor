import React, { PureComponent, Fragment } from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Divider,
  Steps,
  Select,
  Badge,
  DatePicker,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import NeedTabl from './components/step1';

const FormItem = Form.Item;
const { Option } = Select;
const { Step } = Steps;
/* eslint react/no-multi-comp:0 */
@connect(({ supplierAsk, loading }) => ({
  supplierAsk,
  loading: loading.models.supplierAsk,
}))
@Form.create()
class SupplierAsk extends PureComponent {
  state = {
    current: 1,
  };

  componentDidMount() {
    const {
      dispatch,
      supplierAsk: { queryData },
    } = this.props;
    dispatch({
      type: 'supplierAsk/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      supplierAsk: { queryData },
    } = this.props;
    dispatch({
      type: 'supplierAsk/fetch',
      payload: {
        ...queryData,
        page: pagination.current,
        rows: pagination.pageSize,
      },
    });
  };

  handleSearch = queryData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAsk/fetch',
      payload: {
        Content: {
          SearchText: '',
          SearchKey: 'Name',
          ...queryData,
        },
        page: 1,
        rows: 30,
        sidx: 'Code',
        sord: 'Desc',
      },
    });
  };

  childrenComponent = () => {
    const { current } = this.state;
    const {
      supplierAsk: { orderLineList, pagination },
      loading,
    } = this.props;
    switch (current) {
      case 0:
        return (
          <NeedTabl
            tabChange={this.handleStandardTableChange}
            seachHandle={this.handleSearch}
            orderLineList={orderLineList}
            pagination={pagination}
            loading={loading}
          />
        );
      case 1:
        return 1;
      case 2:
        return 2;
      default:
        return 0;
    }
  };

  render() {
    const { current } = this.state;
    return (
      <Card title="供应商询价单添加">
        <Steps current={current}>
          <Step title="需询价查询" />
          <Step title="按供应商确认" />
          <Step title="询价单预览" />
        </Steps>
        {this.childrenComponent()}
      </Card>
    );
  }
}

export default SupplierAsk;
