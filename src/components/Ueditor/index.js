import React, { PureComponent } from 'react';
import RcUeditor from './richtext';

const configUeditor = {
  UEDITOR_HOME_URL: '/ueditor/',
  serverUrl: 'http://47.104.65.49:8089/controller.ashx',
  initialFrameWidth: '100%',
  initialFrameHeight: 500,
  autoHeightEnabled: false,
  zIndex: 9,
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
};

class UEditor extends PureComponent {
  render() {
    const { initialValue, onChange, onBlur } = this.props;
    return (
      <RcUeditor
        value={initialValue}
        editorConfig={configUeditor}
        ueditorUrl="/ueditor/ueditor.all.js"
        ueditorConfigUrl="/ueditor/ueditor.config.js"
        onChange={onChange}
        onBlur={onBlur}
      />
    );
  }
}

export default UEditor;
