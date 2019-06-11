import React, { PureComponent } from 'react';

class UEditor extends PureComponent {
  state = {
    editor: {},
    isContent: true,
  };

  componentDidMount() {
    let script = document.createElement('script');
    script.setAttribute('src', '/ueditor/ueditor.config.js');
    document.getElementsByTagName('head')[0].appendChild(script);
    script = document.createElement('script');
    script.setAttribute('src', '/ueditor/ueditor.all.min.js');
    document.getElementsByTagName('head')[0].appendChild(script);

    script.onload = () => {
      const { UE } = window;
      const ue = UE.getEditor('container', {
        UEDITOR_HOME_URL: '/ueditor/',
        serverUrl: 'http://47.104.65.49:8089/controller.ashx',
        initialFrameHeight: 300,
        toolbars: [
          [
            'source', // html
            'undo', // 撤销
            'redo', // 重做
            'bold', // 加粗
            'italic', // 斜体
            'underline', // 下划线
            'strikethrough', // 删除线
            'subscript', // 下标
            'superscript', // 上标
            'pasteplain', // 纯文本粘贴模式
            'horizontal', // 分隔线
            'removeformat', // 清除格式
            'inserttitle', // 插入标题
            'simpleupload', // 单图上传
            'insertimage', // 多图上传
            'link', // 超链接
            'emotion', // 表情
            'spechars', // 特殊字符
            'searchreplace', // 查询替换
            'justifyleft', // 居左对齐
            'justifyright', // 居右对齐
            'justifycenter', // 居中对齐
            'justifyjustify', // 两端对齐
            'fullscreen', // 全屏
            'imagecenter', // 居中
            'edittip ', // 编辑提示
            'customstyle', // 自定义标题

            'inserttable', // 插入表格
            'print', // 打印
            'fontsize', // 字号
            'insertorderedlist', // 有序列表
            'insertunorderedlist', // 无序列表
            'lineheight', // 行间距
            'rowspacingtop', // 段前距
            'rowspacingbottom', // 段后距
            'forecolor', // 字体颜色
            'backcolor', // 背景色
            'preview', // 预览
          ],
        ],
      });

      this.setState({ editor: ue });

      const { onChange, initialValue } = this.props;
      ue.addListener('contentChange', () => {
        onChange(ue.getContent());
      });
      if (initialValue) {
        ue.ready(() => {
          ue.setContent(initialValue);
        });
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    const { initialValue } = nextProps;
    const { editor, isContent } = this.state;
    if (initialValue && editor.ready && isContent) {
      this.setState({ isContent: false });
      editor.ready(() => {
        editor.setContent(initialValue);
      });
    }
  }

  componentWillUnmount() {
    const { editor } = this.state;
    if (editor.destroy) editor.destroy();
    const child = document.getElementById('edui_fixedlayer');
    child.parentNode.removeChild(child);
  }

  render() {
    const { initialValue } = this.props;
    return (
      <div>
        <textarea
          id="container"
          defaultValue={initialValue}
          name="blog"
          type="text/plain"
          style={{ margin: '15px 0' }}
        />
      </div>
    );
  }
}

export default UEditor;
