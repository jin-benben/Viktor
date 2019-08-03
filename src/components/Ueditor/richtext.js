import React from 'react';
import Uid from './uid';

const UEDITOR_LOADED_KEY = '__BEE_UEDITOR_LOADED_STATUS__';

// ueditor 默认值
const initConfig = {
  autoClearinitialContent: false,
  autoFloatEnabled: true, // 是否保持 toolbar 滚动时不动
  focus: false,
  wordCount: true,
  elementPathEnabled: false,
  pasteplain: false, // 是否默认为纯文本粘贴。false为不使用纯文本粘贴，true为使用纯文本粘贴
  initialFrameWidth: 640, // 初始化编辑器宽度
  initialFrameHeight: 200,
  maximumWords: 10000,
};

export default class RichText extends React.Component {
  static defaultProps = {
    value: '',
    onChange: () => {},
    ueditorUrl: '',
    ueditorConfigUrl: '',
    ueditorHomeUrl: '',
    ueditorIframeUrl: '',
    editorConfig: {}, // ueditor 默认值
    className: '',
    prefix: 'bee',
  };

  constructor(props) {
    super(props);

    this.uuid = `bee-${Uid()}`;
  }

  componentDidMount() {
    let timer = null;

    if (window.UE && window.UE.ui) {
      this.initRichText();
    } else {
      timer = setInterval(() => {
        const status = window[UEDITOR_LOADED_KEY];
        if (status === 2) {
          clearInterval(timer);
          this.initRichText();
        } else if (status !== 1) {
          this.loadUEditorScript();
        }
      }, 0);
    }
  }

  componentWillReceiveProps({ value }) {
    if (value !== this.props.value && this.editor) {
      this.editor.setContent(value);
    }
  }

  componentWillUnmount() {
    if (!this.editor) return;
    this.editor.destroy();
  }

  onChange = () => {
    const value = this.editor.getContent();
    const { onChange } = this.props;
    onChange && onChange(value);
  };

  onBlur = () => {
    const value = this.editor.getContent();
    const { onBlur } = this.props;
    onBlur && onBlur(value);
  };

  initRichText = () => {
    const { UE } = window;
    const target = document.getElementById(this.uuid);

    if (!UE || !target) {
      return false;
    }

    const { value, editorConfig } = this.props;
    const conf = { ...initConfig, ...editorConfig };
    console.log(UE, UE.ui);
    const editor = new UE.ui.Editor(conf);
    this.editor = editor;

    editor.addListener('contentChange', () => {
      this.onChange();
    });

    editor.addListener('blur', () => {
      this.onBlur();
    });

    editor.render(target);
    editor.ready(() => {
      editor.setContent(value);
    });
  };

  createScriptDom = (url, callback) => {
    const scriptDom = document.createElement('script');
    scriptDom.type = 'text/javascript';
    scriptDom.async = true;
    scriptDom.src = url;
    scriptDom.onload = function() {
      callback();
    };
    document.body.appendChild(scriptDom);
  };

  loadUEditorScript() {
    if (window[UEDITOR_LOADED_KEY] !== undefined) {
      return;
    }
    window[UEDITOR_LOADED_KEY] = 1; // 加载中
    const { ueditorHomeUrl, ueditorIframeUrl, ueditorUrl, ueditorConfigUrl } = this.props;

    window.UEDITOR_HOME_URL = ueditorHomeUrl;
    window.UEDITOR_IFRAME_URL = ueditorIframeUrl;

    this.createScriptDom(ueditorConfigUrl, () => {
      this.createScriptDom(ueditorUrl, () => {
        window[UEDITOR_LOADED_KEY] = 2; // 加载完成
      });
    });
  }

  render() {
    const { prefix, className } = this.props;
    return (
      <div className={`${prefix}-richtext ${className}`}>
        <div id={this.uuid} />
      </div>
    );
  }
}
