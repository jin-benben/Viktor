import React, { PureComponent } from 'react';
import { Modal, Tabs } from 'antd';
import Attachment from '@/components/Attachment';
import StandardTable from '@/components/StandardTable';
import { otherCostCColumns } from '@/utils/publicData';

const { TabPane } = Tabs;
export default class TargetLine extends PureComponent {
  render() {
    const { attachmentVisible, attachList, otherCostList, handleModalVisible } = this.props;
    return (
      <Modal
        width={960}
        destroyOnClose
        title="行预览"
        visible={attachmentVisible}
        onOk={() => handleModalVisible(false)}
        onCancel={() => handleModalVisible(false)}
      >
        <Tabs>
          <TabPane key="1" tab="行附件">
            <Attachment dataSource={attachList} iscan />
          </TabPane>
          <TabPane key="2" tab="行成本核算">
            <StandardTable
              data={{ list: otherCostList }}
              rowKey="LineID"
              columns={otherCostCColumns}
            />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
