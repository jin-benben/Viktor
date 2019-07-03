import React, { PureComponent } from 'react';
import { Input } from 'antd';

const InputGroup = Input.Group;
class DocEntryInput extends PureComponent {
  state = {
    DocEntryFrom: '',
    DocEntryTo: '',
  };

  handleDocEntryFromChange = e => {
    this.setState({ DocEntryFrom: e.target.value });
    this.triggerChange({ DocEntryFrom: e.target.value });
  };

  handleDocEntryToChange = e => {
    this.setState({ DocEntryTo: e.target.value });
    this.triggerChange({ DocEntryTo: e.target.value });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { size } = this.props;
    const { state } = this;
    return (
      <InputGroup compact style={{ width: '100%' }}>
        <Input
          value={state.DocEntryFrom}
          onChange={this.handleDocEntryFromChange}
          style={{ width: '40%', textAlign: 'center' }}
          placeholder="开始"
        />
        <Input
          style={{
            size,
            width: '20%',
            borderLeft: 0,
            pointerEvents: 'none',
            backgroundColor: '#fff',
          }}
          placeholder="~"
          disabled
        />
        <Input
          value={state.DocEntryTo}
          onChange={this.handleDocEntryToChange}
          style={{ width: '40%', textAlign: 'center', borderLeft: 0 }}
          placeholder="结束"
        />
      </InputGroup>
    );
  }
}

export default DocEntryInput;
