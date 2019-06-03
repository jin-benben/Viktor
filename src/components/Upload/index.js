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
      const { FilePath, FileCode, FilePathX } = info.file.response;
      const { onChange } = this.props;
      if (onChange) {
        onChange({ FilePath, FileCode, FilePathX });
      }
      this.setState({ FilePath });
    } else {
      message.warning(info.file.response.Message);
    }
  };

  render() {
    const { FilePath } = this.state;
    const {
      type,
      global: { currentUser },
      Folder,
      title,
    } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{title || '上传'}</div>
      </div>
    );

    let action = 'http://47.104.65.49:8001/EnclosureUpload/EnclosureUpload';
    if (type === 'MDM') action = 'http://47.104.65.49:8002/MDMPicUpload/PictureUpLoad';
    return (
      <Upload
        action={action}
        listType="picture-card"
        showUploadList={false}
        onChange={this.handleChange}
        data={{ UserCode: currentUser.UserCode, Folder, Tonken: currentUser.Token }}
      >
        {FilePath ? (
          <img style={{ width: 80, height: 80 }} src={FilePath} alt="avatar" />
        ) : (
          uploadButton
        )}
      </Upload>
    );
  }
}

export default MyUpload;
