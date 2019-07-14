import React from 'react';
import { Modal } from 'antd';
import Attachment from './other';

const AttachmentModal = props => {
  const { attachmentVisible, handleModalVisible, prviewList } = props;
  return (
    <Modal
      width={960}
      footer={null}
      maskClosable={false}
      title="物料附件"
      visible={attachmentVisible}
      onCancel={() => handleModalVisible(false)}
    >
      <Attachment dataSource={prviewList} />
    </Modal>
  );
};

export default AttachmentModal;
