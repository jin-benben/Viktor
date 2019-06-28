import React, { PureComponent } from 'react';
import { Modal, message } from 'antd';
import StandardTable from '@/components/StandardTable';

class PushModal extends PureComponent {
  state = {
    linkmanList: [],
    selectedRows: [],
  };

  linkmanColumns = [
    {
      title: '用户ID',
      align: 'center',
      width: 80,
      dataIndex: 'UserID',
    },
    {
      title: '联系人',
      align: 'center',
      width: 100,
      dataIndex: 'Name',
    },
    {
      title: '手机号',
      align: 'center',
      width: 100,
      dataIndex: 'CellphoneNO',
    },
  ];

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.linkmanList.length) {
      return {
        linkmanList: nextProps.data,
      };
    }
    return null;
  }

  okHandle = () => {
    let { selectedRows } = this.state;
    const { handleSubmit } = this.props;
    if (selectedRows.length) {
      selectedRows = selectedRows.map(item => {
        const { UserID, CellphoneNO, Name } = item;
        return {
          UserID,
          CellphoneNO,
          Contacts: Name,
        };
      });
      handleSubmit(selectedRows);
    } else {
      message.warning('请先选择');
    }
  };

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  render() {
    const { linkmanList } = this.state;
    const { modalVisible, handleModalVisible } = this.props;
    return (
      <Modal
        width={640}
        destroyOnClose
        title="选择推送人"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <div className="tableList">
          <StandardTable
            data={{ list: linkmanList }}
            rowKey="UserID"
            pagination={false}
            columns={this.linkmanColumns}
            rowSelection={{
              onSelectRow: this.onSelectRow,
            }}
          />
        </div>
      </Modal>
    );
  }
}

export default PushModal;
