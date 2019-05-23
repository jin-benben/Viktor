/* eslint-disable array-callback-return */
import React, { PureComponent, Fragment } from 'react';
import StandardTable from '@/components/StandardTable';
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
  message,
} from 'antd';

import NeedTabl from './components/step1';
import ConfirmTabl from './components/step2';

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
    current: 0,
    selectRos: [],
    responsTable: [],
  };

  resultColumns = [
    {
      title: '单号',
      dataIndex: 'DocEntry',
    },
    {
      title: '供应商',
      dataIndex: 'CardName',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      render: (text, record) => (
        <span>{text === '1' ? '成功' : `失败（${record.ErrorMessage}）`}</span>
      ),
    },
  ];

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
        rows: 10,
        sidx: 'Code',
        sord: 'Desc',
      },
    });
  };

  submitSelect = (select, current) => {
    const lineList = [];
    select.map((item, lineIndex) => {
      const {
        SKU,
        Owner,
        SKUName,
        BrandName,
        ProductName,
        ManufactureNO,
        Parameters,
        Package,
        Purchaser,
        Quantity,
        Unit,
        DueDate,
        Price,
        LineTotal,
        Comment,
        DocEntry,
        LineID,
      } = item;
      const InquiryDueDate = moment()
        .add('30', 'day')
        .format('YYYY/MM/DD'); // 询价日期当前时间后30天

      let hasSupplier; // 数组中是否已有此供应商
      lineList.findIndex((line, index) => {
        if (line.CardCode === item.SupplierCode) {
          hasSupplier = index;
        }
      });

      if (hasSupplier === undefined) {
        lineList.push({
          Comment: '',
          Contacts: '1',
          CellphoneNO: '1',
          PhoneNO: '1',
          Email: '1',
          CompanyCode: '1',
          ToDate: new Date(),
          NumAtCard: '',
          Currency: '1',
          Owner: '',
          DocRate: '1',
          CardName: item.SupplierName,
          CardCode: item.SupplierCode,
          TI_Z02702: [
            {
              LineID: lineIndex + 1,
              LineComment: Comment,
              BaseEntry: DocEntry,
              BaseLineID: LineID,
              Saler: Owner,
              SKU,
              SKUName,
              BrandName,
              ProductName,
              ManufactureNO,
              Parameters,
              Package,
              Purchaser,
              Quantity,
              Unit,
              DueDate,
              Price,
              InquiryDueDate,
              LineTotal,
            },
          ],
        });
      } else {
        lineList[hasSupplier].TI_Z02702.push({
          LineID: lineIndex + 1,
          LineComment: Comment,
          BaseEntry: DocEntry,
          BaseLineID: LineID,
          Saler: Owner,
          SKU,
          SKUName,
          BrandName,
          ProductName,
          ManufactureNO,
          Parameters,
          Package,
          Purchaser,
          Quantity,
          Unit,
          DueDate,
          Price,
          InquiryDueDate,
          LineTotal,
        });
      }
    });

    this.setState({ selectRos: [...lineList], current });
  };

  changeCurrent = current => {
    this.setState({ current });
  };

  submitStepParent = lineList => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAsk/add',
      payload: {
        Content: {
          TI_Z02701List: [...lineList],
        },
      },
      callback: response => {
        if (response.Status === 200) {
          message.success('添加成功');
          this.setState({ current: 2, responsTable: response.Content.loTI_Z02701ResponseR });
        }
      },
    });
  };

  childrenComponent = () => {
    const { current, responsTable } = this.state;
    const {
      supplierAsk: { orderLineList, pagination },
      loading,
    } = this.props;
    const { selectRos } = this.state;
    switch (current) {
      case 0:
        return (
          <NeedTabl
            tabChange={this.handleStandardTableChange}
            nextStep={this.submitSelect}
            seachHandle={this.handleSearch}
            orderLineList={orderLineList}
            pagination={pagination}
            loading={loading}
          />
        );
      case 1:
        return (
          <ConfirmTabl
            orderLineList={selectRos}
            changeStep={this.changeCurrent}
            submitStepParent={this.submitStepParent}
          />
        );
      case 2:
        return (
          <StandardTable
            data={{ list: responsTable }}
            rowKey="DocEntry"
            columns={this.resultColumns}
          />
        );
      default:
        return 0;
    }
  };

  render() {
    const { current } = this.state;
    return (
      <Card title="供应商询价单添加">
        <Steps style={{ marginBottom: 30 }} current={current}>
          <Step title="需询价查询" />
          <Step title="按供应商确认" />
          <Step title="生成结果预览" />
        </Steps>
        {this.childrenComponent()}
      </Card>
    );
  }
}

export default SupplierAsk;
