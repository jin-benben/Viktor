import React, { Component } from 'react';
import { Modal, Button, Input, message } from 'antd';

const { confirm } = Modal;
const { TextArea } = Input;

class CancelOrder extends Component {
  state = {
    reason: '',
  };

  reasonChange = e => {
    this.setState({ reason: e.target.value });
  };

  showConfirm = () => {
    const { cancelSubmit } = this.props;

    confirm({
      title: '确认要取消此单据吗?',
      content: (
        <TextArea
          style={{ marginTop: 20 }}
          onChange={this.reasonChange}
          placeholder="请输入取消原因"
        />
      ),
      okText: '确认',
      onOk: () => {
        const { reason } = this.state;
        if (!reason) {
          message.warning('原因不能为空');
          return this.showConfirm;
        }
        cancelSubmit(reason);
      },
      onCancel() {},
    });
  };

  render() {
    return <Button onClick={this.showConfirm}>取消单据</Button>;
  }
}

export default CancelOrder;
