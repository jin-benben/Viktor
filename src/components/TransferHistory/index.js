import React, { PureComponent } from 'react';
import { Empty, Modal, Timeline, Spin } from 'antd';
import { connect } from 'dva';

@connect(({ global, loading }) => ({
  global,
  loading: loading.effects['global/transferHistroy'],
}))
class TransferHistory extends PureComponent {
  state = {
    timelineList: [],
  };

  componentWillReceiveProps(nextProps) {
    const { dispatch, BaseEntry, BaseLineID } = nextProps;
    if (
      (BaseEntry && BaseLineID && this.props.BaseEntry !== BaseEntry) ||
      this.props.BaseLineID !== BaseLineID
    ) {
      dispatch({
        type: 'global/transferHistroy',
        payload: {
          Content: {
            BaseEntry,
            BaseLineID,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            this.setState({
              timelineList: response.Content.Rows,
            });
          }
        },
      });
    }
  }

  render() {
    const { timelineList } = this.state;
    const { loading, modalVisible, handleModalVisible } = this.props;
    return (
      <Modal
        width={960}
        maskClosable={false}
        title="转移记录"
        visible={modalVisible}
        footer={null}
        onCancel={() => handleModalVisible(false)}
      >
        <Spin spinning={loading}>
          {timelineList.length ? (
            <Timeline>
              {timelineList.map(item => (
                <Timeline.Item key={item}>{item}</Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Empty />
          )}
        </Spin>
      </Modal>
    );
  }
}

export default TransferHistory;
