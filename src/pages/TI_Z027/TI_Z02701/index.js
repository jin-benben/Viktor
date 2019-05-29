/* eslint-disable array-callback-return */
import React, { Component, Fragment } from 'react';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Button, Steps, message } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import NeedTabl from './components/step1';
import ConfirmTabl from './components/step2';
import OrderModal from './components/orderModal';
import styles from './style.less';

const { Step } = Steps;
/* eslint react/no-multi-comp:0 */
@connect(({ supplierAsk, loading }) => ({
  supplierAsk,
  loading: loading.models.supplierAsk,
}))
@Form.create()
class SupplierAsk extends Component {
  state = {
    current: 0,
    selectedRows: [], // 选中列
    responsTable: [], //  提交数据返回列
    confimSelectedRows: [], // 选中列组合列
    lastConfrimList: [], // 最终确认列
    modalVisible: false,
  };

  resultColumns = [
    {
      title: '单号',
      dataIndex: 'DocEntry',
      render: (text, record) => {
        if (record.Status === '1') {
          return <a href={`/purchase/TI_Z027/TI_Z02702?DocEntry=${text}`}>{text}</a>;
        }
        return <span>{text}</span>;
      },
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
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'WhsCode', 'Company', 'Purchaser'],
        },
      },
    });
  }

  submitSelect = select => {
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
        Key,
        DueDate,
        Price,
        LineTotal,
        Comment,
        DocEntry,
        LineID,
      } = item;
      const ToDate = moment()
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
          ToDate,
          NumAtCard: '',
          Currency: '1',
          Owner: '',
          Key,
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
              InquiryDueDate: '',
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
          InquiryDueDate: '',
          LineTotal,
        });
      }
    });
    this.setState({
      confimSelectedRows: [...lineList],
      lastConfrimList: [...lineList],
      current: 1,
      modalVisible: false,
    });
  };

  changeCurrent = current => {
    const { responsTable, confimSelectedRows } = this.state;
    if (current === 1 && !confimSelectedRows.length) {
      message.warning('请先完成上一步');
      return false;
    }
    if (current === 2 && !responsTable.length) {
      message.warning('请先完成上一步');
      return false;
    }
    this.setState({ current });
  };

  submitStepParent = () => {
    const { dispatch } = this.props;
    const { lastConfrimList } = this.state;
    dispatch({
      type: 'supplierAsk/add',
      payload: {
        Content: {
          TI_Z02701List: [...lastConfrimList],
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

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  // 确认需要采购询价
  selectNeed = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length) {
      this.handleModalVisible(true);
    } else {
      message.warning('请先选择');
    }
  };

  // 需询价弹窗
  handleModalVisible = flag => {
    this.setState({ modalVisible: !!flag });
  };

  lastConfrim = lastConfrimList => {
    this.setState({ lastConfrimList: [...lastConfrimList] });
  };

  footerBtn = () => {
    const { current } = this.state;
    const secondButton = (
      <Fragment>
        <Button
          style={{ marginRight: 20, marginTop: 20 }}
          onClick={() => this.changeCurrent(0)}
          type="primary"
        >
          上一步
        </Button>
        <Button onClick={this.submitStepParent} type="primary">
          确认生成
        </Button>
      </Fragment>
    );
    switch (current) {
      case 0:
        return (
          <Button onClick={this.selectNeed} type="primary">
            下一步
          </Button>
        );
      case 1:
        return secondButton;
      case 2:
        return (
          <Button
            style={{ marginRight: 20, marginTop: 20 }}
            onClick={() => this.changeCurrent(1)}
            type="primary"
          >
            上一步
          </Button>
        );
      default:
        return 0;
    }
  };

  render() {
    const { current, selectedRows, modalVisible, responsTable, confimSelectedRows } = this.state;
    const parentMethods = {
      handleSubmit: this.submitSelect,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Card bordered={false}>
        <Steps style={{ marginBottom: 30 }} current={current}>
          <Step onClick={() => this.changeCurrent(0)} title="需询价查询" />
          <Step onClick={() => this.changeCurrent(1)} title="按供应商确认" />
          <Step onClick={() => this.changeCurrent(2)} title="生成结果预览" />
        </Steps>
        <div className={current === 0 ? styles.showcomponent : styles.hidecomponent}>
          <NeedTabl onSelectRow={this.onSelectRow} />
        </div>
        <div className={current === 1 ? styles.showcomponent : styles.hidecomponent}>
          <ConfirmTabl orderLineList={confimSelectedRows} submitStepParent={this.lastConfrim} />
        </div>
        <div className={current === 2 ? styles.showcomponent : styles.hidecomponent}>
          <StandardTable
            data={{ list: responsTable }}
            rowKey="DocEntry"
            columns={this.resultColumns}
          />
        </div>

        <OrderModal data={selectedRows} {...parentMethods} modalVisible={modalVisible} />
        <FooterToolbar>{this.footerBtn()}</FooterToolbar>
      </Card>
    );
  }
}

export default SupplierAsk;
