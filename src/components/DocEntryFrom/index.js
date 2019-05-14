import React, { PureComponent } from 'react';
import { Input } from 'antd';

const InputGroup = Input.Group;
class DocEntryInput extends PureComponent {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      DocEntryFrom: value.DocEntryFrom || Number,
      DocEntryTo: value.DocEntryTo || Number,
    };
  }

  handleDocEntryFromChange = e => {
    const DocEntryFrom = parseInt(e.target.value || 0, 10);
    if (Number.isNaN(DocEntryFrom)) {
      return;
    }
    if (!('value' in this.props)) {
      this.setState({ DocEntryFrom });
    }
    this.triggerChange({ DocEntryFrom });
  };

  handleDocEntryToChange = e => {
    const DocEntryTo = parseInt(e.target.value || 0, 10);
    if (Number.isNaN(DocEntryTo)) {
      return;
    }
    if (!('value' in this.props)) {
      this.setState({ DocEntryTo });
    }
    this.triggerChange({ DocEntryTo });
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
