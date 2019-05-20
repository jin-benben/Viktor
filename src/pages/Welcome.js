import React from 'react';

import { Input, Modal } from 'antd';

class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = { skuModalVisible: false };
  }

  handleCancel = () => {
    this.setState({ skuModalVisible: false });
  };

  onFocusHandele = () => {
    this.setState({ skuModalVisible: true });
  };

  render() {
    const { skuModalVisible } = this.state;
    return (
      <div>
        <Input
          onFocus={() => {
            this.onFocusHandele();
          }}
        />
        <Modal
          title="Basic Modal"
          visible={skuModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}

export default Welcome;
