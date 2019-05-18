import React from 'react';
import { Icon, Upload } from 'antd';

class MyUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FilePath: props.initialValue,
    };
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.response.Status === 200) {
      const { FilePath } = info.file.response;
      const { onChange } = this.props;
      if (onChange) {
        onChange(FilePath);
      }
      this.setState({ FilePath });
    }
  };

  render() {
    const { FilePath } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <Upload
        action="http://117.149.160.231:9301/MDMPicUpload/PictureUpLoad"
        listType="picture-card"
        showUploadList={false}
        onChange={this.handleChange}
        data={{ UserCode: 'jinwentao', Folder: 'TI_Z026', Tonken: '22233' }}
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
