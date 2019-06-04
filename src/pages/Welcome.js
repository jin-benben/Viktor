import React, { Component } from 'react';
import UEditor from '@/components/Ueditor';

export default class AddMessage extends Component {
  state = {
    content: '',
  };

  handleChange = content => {
    this.state.content = content;
    console.log(content);
  };

  render() {
    const { content } = this.state;

    return (
      <div style={{ width: 800, textAlign: 50, marginLeft: 50 }}>
        <UEditor
          content={content}
          onChange={this.handleChange}
          editorHandle={this.editorHandle}
          ue={this.ue}
        />
      </div>
    );
  }
}
