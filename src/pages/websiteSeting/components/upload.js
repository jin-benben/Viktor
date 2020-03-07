import React from 'react';
import { Icon, Upload, message } from 'antd';
import { connect } from 'dva';

@connect(({ global, loading }) => ({
  global,
  loading: loading.models.global,
}))
class MyUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FilePath: '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.FilePath && nextProps.initialValue !== prevState.FilePath) {
      return {
        FilePath: nextProps.initialValue,
      };
    }
    return null;
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.response.Status === 200) {
      message.success('上传成功');
      const { onChange } = this.props;
      console.log(info);
      if (onChange) {
        onChange(info.fileList);
      }
    } else {
      message.warning(info.file.response.Message);
    }
  };

  render() {
    const {
      global: { currentUser },
      Folder,
    } = this.props;

    return (
      <Upload
        action="http://47.104.65.49:8002/MDMEnclosure/EnclosureUpload"
        listType="picture-card"
        onChange={this.handleChange}
        data={{ UserCode: currentUser.UserCode, Folder, Tonken: currentUser.Token }}
      >
        <Icon type="plus" />
      </Upload>
    );
  }
}

export default MyUpload;
