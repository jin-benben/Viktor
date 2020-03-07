import React from 'react';
import { yuan } from 'ant-design-pro/lib/Charts';
/**
 * 减少使用 dangerouslySetInnerHTML
 */
export default class Yuan extends React.PureComponent {
  componentDidMount() {
    this.rendertoHtml();
  }

  componentDidUpdate() {
    this.rendertoHtml();
  }

  rendertoHtml = () => {
    const { children } = this.props;
    if (this.main) {
      this.main.innerHTML = yuan(children);
    }
  };

  render() {
    const { style } = this.props;
    return (
      <span
        style={style}
        ref={ref => {
          this.main = ref;
        }}
      />
    );
  }
}
