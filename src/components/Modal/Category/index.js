import React, { PureComponent } from 'react';
import { Modal, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import request from '@/utils/request';

class CateModal extends PureComponent {
  state = {
    cateList: [],
    selectedRows: [],
    queryData: {
      Content: {
        PCode: '',
        Level: '1',
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

  columns = [
    {
      title: '代码',
      dataIndex: 'Code',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'Name',
      width: 100,
    },
  ];

  componentDidMount() {
    const { queryData } = this.state;
    this.getCategory(queryData);
  }

  componentWillReceiveProps(nextProps) {
    const { PCode, Level } = nextProps;
    const { queryData } = this.state;
    if (
      (PCode && PCode !== queryData.Content.PCode) ||
      (Level && Level !== queryData.Content.Level)
    ) {
      Object.assign(queryData.Content, {
        PCode: PCode || '',
        Level: Level || '1',
      });
      this.setState({
        queryData,
      });
      this.getCategory(queryData);
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

  onSelectRow = selectedRows => {
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
    this.getCategory(queryData);
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const queryData = {
        Content: {
          SearchText: '',
          SearchKey: 'Name',
          ...fieldsValue,
        },
        page: 1,
        rows: 20,
        sidx: 'Code',
        sord: 'Desc',
      };
      this.getCategory(queryData);
    });
  };

  getCategory = async params => {
    const { pagination } = this.state;
    const response = await request('/MDM/TI_Z010/TI_Z01005', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    if (response && response.Status === 200) {
      if (response.Content) {
        const { rows, records, page } = response.Content;
        this.setState({
          cateList: [...rows],
          queryData: { ...params },
          pagination: { ...pagination, total: records, current: page },
        });
      } else {
        this.setState({
          cateList: [],
          queryData: { ...params },
          pagination: { ...pagination, total: 0 },
        });
      }
    }
  };

  render() {
    const { loading, pagination, cateList } = this.state;
    const { modalVisible, handleModalVisible, Type } = this.props;
    return (
      <Modal
        width={960}
        title="分类选择"
        maskClosable={false}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false)}
      >
        <div className="tableList">
          <StandardTable
            loading={loading}
            data={{ list: cateList }}
            rowKey="Code"
            pagination={pagination}
            columns={this.columns}
            rowSelection={{
              type: Type || 'radio',
              onSelectRow: this.onSelectRow,
            }}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Modal>
    );
  }
}

export default CateModal;
