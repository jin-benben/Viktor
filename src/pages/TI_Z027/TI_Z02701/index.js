/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Button, Steps, message } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import StandardTable from '@/components/StandardTable';
import NeedTabl from './components/step1';
import ConfirmTabl from './components/step2';
import OrderModal from './components/orderModal';
import styles from './style.less';
import request from '@/utils/request';

const { Step } = Steps;
/* eslint react/no-multi-comp:0 */
@connect(({ supplierAsk, loading, global }) => ({
  supplierAsk,
  global,
  addloading: loading.effects['supplierAsk/add'],
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
      width: 100,
      render: (text, record) => {
        if (record.Status === '1') {
          return (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`/purchase/TI_Z027/update?DocEntry=${text}`}
            >
              {text}
            </a>
          );
        }
        return <span>{text}</span>;
      },
    },
    {
      title: '供应商',
      width: 300,
      dataIndex: 'CardName',
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'Status',
      render: (text, record) => (
        <span>{text === '1' ? '成功' : `失败（${record.ErrorMessage}）`}</span>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      global: { SupplierList },
    } = this.props;
    if (!SupplierList.length) {
      dispatch({
        type: 'global/getSupplier',
      });
    }
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Saler', 'WhsCode', 'Curr', 'Company', 'Purchaser'],
        },
      },
    });
  }

  getDocRate = async lineList => {
    let isCan = true;
    await Promise.all(
      lineList.map(async item => {
        const newItem = item;
        if (newItem.Currency) {
          const responseCurrency = await request('/MDM/MDMCommonality/MDMCommonality01', {
            method: 'POST',
            data: {
              Content: {
                CodeList: ['Rate'],
                key: newItem.Currency,
              },
            },
          });
          if (responseCurrency && responseCurrency.Status === 200) {
            newItem.DocRate = responseCurrency.Content.DropdownData.Rate[0]
              ? responseCurrency.Content.DropdownData.Rate[0].Value
              : '';
          }
        }

        if (!item.linkmanList.length) {
          const responseSupplier = await request('/MDM/TI_Z007/TI_Z00703', {
            method: 'POST',
            data: {
              Content: {
                Code: item.CardCode,
              },
            },
          });
          if (responseSupplier && responseSupplier.Status === 200) {
            if (!responseSupplier.Content.TI_Z00702List.length) {
              message.warning(`供应商${responseSupplier.Content.Name}下没有维护联系人`);
              isCan = false;
              return false;
            }
            const {
              CellphoneNO,
              Email,
              PhoneNO,
              Name,
              LineID,
            } = responseSupplier.Content.TI_Z00702List[0];
            const responseCurrency = await request('/MDM/MDMCommonality/MDMCommonality01', {
              method: 'POST',
              data: {
                Content: {
                  CodeList: ['Rate'],
                  key: responseSupplier.Content.Currency,
                },
              },
            });
            if (responseCurrency && responseCurrency.Status === 200) {
              newItem.DocRate = responseCurrency.Content.DropdownData.Rate[0]
                ? responseCurrency.Content.DropdownData.Rate[0].Value
                : '';
            }
            Object.assign(newItem, {
              CellphoneNO,
              Email,
              Currency: responseSupplier.Content.Currency,
              PhoneNO,
              Contacts: Name,
              ContactsID: LineID,
              CompanyCode: responseSupplier.Content.CompanyCode,
              linkmanList: [...responseSupplier.Content.TI_Z00702List],
            });
          }
        }
        return newItem;
      })
    );
    if (isCan) {
      this.setState({
        confimSelectedRows: [...lineList],
        lastConfrimList: [...lineList],
        current: 1,
        modalVisible: false,
      });
    }
  };

  submitSelect = select => {
    const lineList = [];
    select.map((item, lineIndex) => {
      const {
        SKU,
        SKUName,
        BrandName,
        ProductName,
        ManufactureNO,
        Parameters,
        ForeignName,
        ManLocation,
        Rweight,
        ForeignFreight,
        Package,
        Quantity,
        Unit,
        Key,
        DueDate,
        LineTotal,
        LineComment,
        DocEntry,
        ForeignParameters,
        LineID,
        Currency,
        Contacts,
        CellphoneNO,
        PhoneNO,
        Email,
        ContactsID,
        linkmanList,
        WhsCode,
        Processor,
        TransferComment,
        CompanyCode,
        Purchaser,
        Owner,
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
          CompanyCode,
          DocDate: new Date(),
          ToDate,
          NumAtCard: '',
          Currency,
          ContactsID,
          Contacts,
          CellphoneNO,
          PhoneNO,
          Email,
          Owner: Purchaser,
          Key,
          CardName: item.SupplierName,
          CardCode: item.SupplierCode,
          linkmanList: linkmanList || [],
          TI_Z02702: [
            {
              LineID: lineIndex + 1,
              BaseEntry: DocEntry,
              BaseLineID: LineID,
              Saler: Owner,
              SKU,
              SKUName,
              ForeignParameters,
              BrandName,
              ProductName,
              ManufactureNO,
              ForeignName,
              ManLocation,
              Rweight,
              ForeignFreight,
              Parameters,
              Package,
              Quantity,
              Unit,
              DueDate,
              Price: 0,
              InquiryDueDate: '',
              LineTotal,
              WhsCode,
              Processor,
              TransferComment,
              CompanyCode,
              Purchaser,
              Owner,
              BaseLineComment: LineComment,
            },
          ],
        });
      } else {
        lineList[hasSupplier].TI_Z02702.push({
          LineID: lineIndex + 1,
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
          Quantity,
          Unit,
          DueDate,
          Price: 0,
          InquiryDueDate: '',
          LineTotal,
          WhsCode,
          Processor,
          TransferComment,
          CompanyCode,
          Purchaser,
          Owner,
          BaseLineComment: LineComment,
        });
      }
    });

    this.getDocRate(lineList);
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
        if (response && response.Status === 200) {
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
    const { addloading } = this.props;
    const secondButton = (
      <Fragment>
        <Button
          style={{ marginRight: 20, marginTop: 20 }}
          onClick={() => this.changeCurrent(0)}
          type="primary"
        >
          上一步
        </Button>
        <Button loading={addloading} onClick={this.submitStepParent} type="primary">
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
