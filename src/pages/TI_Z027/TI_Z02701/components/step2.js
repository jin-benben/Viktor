/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { DatePicker, Select, Input } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import MDMCommonality from '@/components/Select/index';
import { getName } from '@/utils/utils';

const { Option } = Select;
@connect(({ global }) => ({
  global,
}))
class SelectionLine extends Component {
  state = {
    selectedRows: [],
    orderLineList: [],
  };

  columns = [
    {
      title: '供应商',
      width: 200,
      dataIndex: 'CardName',
    },
    {
      title: '总物料数',
      dataIndex: 'LineSum',
      width: 150,
      render: (text, record) => <span>{record.TI_Z02702.length}</span>,
    },
    {
      title: '有效期',
      dataIndex: 'ToDate',
      width: 150,
      render: (text, record, index) => (
        <DatePicker
          onChange={(date, dateString) => this.RowChange(dateString, index, record, 'ToDate')}
          defaultValue={moment(record.ToDate, 'YYYY-MM-DD')}
        />
      ),
    },
    {
      title: '供应商参考号',
      width: 150,
      dataIndex: 'NumAtCard',
      render: (text, record, index) => (
        <Input
          onChange={e => this.RowChange(e.target.value, index, record, 'NumAtCard')}
          value={text}
        />
      ),
    },
    {
      title: '所有者',
      width: 150,
      dataIndex: 'Owner',
      render: (text, record, index) => {
        const {
          global: { Purchaser },
        } = this.props;
        return (
          <MDMCommonality
            onChange={value => {
              this.RowChange(value, index, record, 'Owner');
            }}
            initialValue={text}
            data={Purchaser}
          />
        );
      },
    },
    {
      title: '币种',
      width: 150,
      dataIndex: 'Currency',
      render: (text, record, index) => {
        const {
          global: { Curr },
        } = this.props;
        return (
          <MDMCommonality
            onChange={value => this.currencyChange(value, record, index)}
            initialValue={text}
            data={Curr}
          />
        );
      },
    },
    {
      title: '单据汇率',
      width: 100,
      dataIndex: 'DocRate',
    },
    {
      title: '联系人',
      width: 150,
      dataIndex: 'ContactsID',
      render: (text, record, index) => (
        <Select
          placeholder="请选择联系人"
          value={text}
          onSelect={LineID => this.linkmanChange(LineID, record, index)}
          style={{ width: '100%' }}
        >
          {record.linkmanList.map(option => (
            <Option key={option.LineID} value={option.LineID}>
              {option.Name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: '备注',
      dataIndex: 'Comment',
      width: 150,
      render: (text, record, index) => (
        <Input
          onChange={e => this.RowChange(e.target.value, index, record, 'Comment')}
          value={text}
        />
      ),
    },
  ];

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.orderLineList !== prevState.orderLineList) {
      return {
        orderLineList: nextProps.orderLineList,
        selectedRows: nextProps.orderLineList,
      };
    }
    return null;
  }

  linkmanChange = (id, record, index) => {
    const { orderLineList } = this.state;
    const select = record.linkmanList.find(item => item.LineID === id);
    const { CellphoneNO, Email, PhoneNO, LineID, Name } = select;
    Object.assign(record, { CellphoneNO, Email, PhoneNO, ContactsID: LineID, Contacts: Name });
    orderLineList[index] = record;
    this.setState({ orderLineList });
  };

  // 币种修改
  currencyChange = (currency, record, index) => {
    const { orderLineList } = this.state;
    const { dispatch } = this.props;
    record.Currency = currency;
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Rate'],
          key: currency,
        },
      },
      callback: response => {
        record.DocRate = response.Content.DropdownData.Rate[0]
          ? response.Content.DropdownData.Rate[0].Value
          : '';
        orderLineList[index] = record;
        this.setState({ orderLineList: [...orderLineList] });
      },
    });
  };

  RowChange = (value, index, record, key) => {
    const { orderLineList } = this.state;
    record[key] = value;
    orderLineList[index] = record;
    this.setState({ orderLineList });
  };

  onSelectRow = selectedRows => {
    const { submitStepParent } = this.props;
    this.setState({ selectedRows: [...selectedRows] });
    submitStepParent(selectedRows);
  };

  expandedRowRender = recordF => {
    const columns = [
      {
        title: '物料',
        dataIndex: 'SKU',
        align: 'center',
        width: 300,
        render: (text, record) =>
          record.lastIndex ? (
            ''
          ) : (
            <Ellipsis tooltip lines={1}>
              {text ? (
                <Link target="_blank" to={`/main/product/TI_Z009/TI_Z00903?Code${text}`}>
                  {text}-
                </Link>
              ) : (
                ''
              )}
              {record.SKUName}
            </Ellipsis>
          ),
      },
      {
        title: '数量',
        width: 100,
        dataIndex: 'Quantity',
        align: 'center',
        render: (text, record) => <span>{`${text}(${record.Unit})`}</span>,
      },
      {
        title: '要求交期',
        width: 100,
        inputType: 'date',
        dataIndex: 'DueDate',
        align: 'center',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },

      {
        title: '销售员',
        width: 100,
        dataIndex: 'Owner',
        render: text => {
          const {
            global: { Saler },
          } = this.props;
          return <span>{getName(Saler, text)}</span>;
        },
      },
      {
        title: '采购员',
        width: 100,
        dataIndex: 'Purchaser',
        render: text => {
          const {
            global: { Purchaser },
          } = this.props;
          return <span>{getName(Purchaser, text)}</span>;
        },
      },
      {
        title: '处理人',
        width: 100,
        dataIndex: 'Processor',
        render: val => {
          const {
            global: { TI_Z004 },
          } = this.props;
          return <span>{getName(TI_Z004, val)}</span>;
        },
      },
      {
        title: '转移备注',
        width: 100,
        dataIndex: 'TransferComment',
        render: text => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '仓库',
        width: 120,
        dataIndex: 'WhsCode',
        render: text => {
          const {
            global: { WhsCode },
          } = this.props;
          return <span>{getName(WhsCode, text)}</span>;
        },
      },
      {
        title: '交易公司',
        width: 150,
        dataIndex: 'CompanyCode',
        render: text => {
          const {
            global: { Company },
          } = this.props;
          return (
            <Ellipsis tooltip lines={1}>
              {getName(Company, text)}
            </Ellipsis>
          );
        },
      },
      {
        title: '行备注',
        width: 100,
        dataIndex: 'Comment',
        render: text => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '客户参考号',
        width: 100,
        dataIndex: 'NumAtCard',
        render: text => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
    ];

    return <StandardTable data={{ list: recordF.TI_Z02702 }} columns={columns} />;
  };

  render() {
    const { selectedRows, orderLineList } = this.state;

    return (
      <div>
        <StandardTable
          data={{ list: orderLineList }}
          rowKey="key"
          scroll={{ x: 1500 }}
          columns={this.columns}
          isAll
          selectedRows={selectedRows}
          rowSelection={{
            onSelectRow: this.onSelectRow,
          }}
          expandedRowRender={this.expandedRowRender}
          onChange={this.handleStandardTableChange}
        />
      </div>
    );
  }
}

export default SelectionLine;
