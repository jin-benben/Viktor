import React, { PureComponent } from 'react';
import { Modal, message, Table, DatePicker } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import request from '@/utils/request';
import Link from 'umi/link';

const { RangePicker } = DatePicker;
class BrandModal extends PureComponent {
  columns = [
    {
      title: '询价日期',
      dataIndex: 'CreateDate',
      width: 150,
    },
   
    {
      title: '报价单号',
      width: 100,
      dataIndex: 'QuoteEntry',
      render:(text)=><Link to={`/sellabout/TI_Z029/detail?DocEntry=${text}`}>{text}</Link>
    },
    {
      title: '报价客户',
      width: 200,
      dataIndex: 'CardName',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '询价价格',
      width: 100,
      dataIndex: 'InquiryPrice',
    },
    {
      title: '询价币种',
      width: 100,
      dataIndex: 'Currency',
     
    },
    {
      title: '询价运费',
      width: 100,
      dataIndex: 'ForeignFreight',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      selectedRows: [],
      queryData: {
        Content: {
          Code: props.Code,
          SearchKey: 'Name',
        },
        page: 1,
        rows: 20,
        sidx: 'Code',
        sord: 'Desc',
      },
      pagination: {
        showSizeChanger: true,
        showTotal: total => `共 ${total} 条`,
        pageSizeOptions: ['20', '40', '60'],
        total: 0,
        pageSize: 20,
        current: 1,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const { queryData } = this.state;
    const { SearchText } = queryData.Content;
    if (SearchText !== nextProps.Code && nextProps.Code) {
      this.setState({
        queryData: {
          Content: {
            Code: nextProps.Code,
            SearchKey: 'Name',
          },
          page: 1,
          rows: 20,
          sidx: 'Code',
          sord: 'Desc',
        },
      });
      this.getHistory({
        Content: {
          Code: nextProps.Code,
          SearchKey: 'Name',
        },
        page: 1,
        rows: 20,
        sidx: 'Code',
        sord: 'Desc',
      });
    }
  }

  okHandle = () => {
    const { selectedRows } = this.state;
    const { handleSubmit } = this.props;
    if (selectedRows.length) {
      handleSubmit(selectedRows);
    } else {
      message.warning('请先选择');
    }
  };

  onSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  handleStandardTableChange = pagination => {
    let { queryData } = this.state;
    queryData = {
      ...queryData,
      page: pagination.current,
      rows: pagination.pageSize,
    };
    this.setState({ queryData });
    this.getHistory(queryData);
  };

  getHistory = async params => {
    const response = await request('/MDM/TI_Z009/TI_Z00910', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    if (response && response.Status === 200) {
      const { pagination } = this.state;
      if (response.Content) {
        const { rows, records, page } = response.Content;
        this.setState({
          dataSource: [...rows],
          queryData: { ...params },
          pagination: { ...pagination, total: records, current: page },
        });
      } else {
        this.setState({
          dataSource: [],
          queryData: { ...params },
          pagination: { ...pagination, total: 0 },
        });
      }
    }
  };

  onChange=(date,dateString)=>{
    const {queryData:{Content}}=this.state
    this.setState({
      queryData:{
        Content:{
          ...Content,
          DateForm:dateString[0],
          ToForm:dateString[1],
        },
        page: 1,
        rows: 20,
        sidx: 'Code',
        sord: 'Desc',
      }
     
    },()=>{
      this.getHistory({
        Content:{
          ...Content,
          DateForm:dateString[0],
          ToForm:dateString[1],
        },
        page: 1,
        rows: 20,
        sidx: 'Code',
        sord: 'Desc',
      })
    })
  }

  render() {
    const { loading, pagination, dataSource } = this.state;
    const { modalVisible, handleModalVisible } = this.props;
    return (
      <Modal
        width={960}
        maskClosable={false}
        destroyOnClose
        title="询价记录"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <div className="tableList">
          <RangePicker onChange={this.onChange} />
          <Table
            loading={loading}
            dataSource={dataSource}
            rowKey="LineID"
            scroll={{ y: 400 }}
            pagination={pagination}
            columns={this.columns}
            rowSelection={{
              type: 'radio',
              onChange: this.onSelectRow,
            }}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Modal>
    );
  }
}

export default BrandModal;
