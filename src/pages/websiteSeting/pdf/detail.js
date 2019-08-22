import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Form, Row, Col, Input, message, Switch } from 'antd';
import { connect } from 'dva';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import UEditor from '@/components/Ueditor';
import MDMCommonality from '@/components/Select';
import Upload from '../components/upload';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ pdfData, loading, global }) => ({
  pdfData,
  global,
  addLoding: loading.effects['pdfData/add'],
  fetchLoading: loading.effects['pdfData/singleFetchs'],
}))
@Form.create()
class PafEditPage extends PureComponent {
  state = {
    pdfDetail: {
      Title: '',
      Type: '',
      Category: '',
      DocEntry: '',
      Content: '',
      IsShow: 'Y',
      Presentation: '',
    },
    isEdit: true, // 是否可编辑
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.getDetail();
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['TI_Z01802'],
          Key: '7',
        },
      },
    });
  }

  getDetail = () => {
    const {
      location: { query },
      dispatch,
    } = this.props;
    if (query.Code) {
      dispatch({
        type: 'pdfData/singleFetchs',
        payload: {
          Content: {
            Code: query.Code,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            this.setState({
              pdfDetail: {
                ...response.Content,
              },
              isEdit: false,
            });
          }
        },
      });
    }
  };

  updataHandle = e => {
    // 搜索
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { pdfDetail } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      Object.assign(pdfDetail, {
        ...fieldsValue,
        IsShow: fieldsValue.IsShow ? 'Y' : 'N',
      });
      dispatch({
        type: 'pdfData/add',
        payload: {
          Content: {
            ...pdfDetail,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('保存成功');
          }
        },
      });
    });
  };

  // 文件上传成功后回调
  uploadSuccess = fileList => {
    const { pdfDetail } = this.state;
    if (fileList.length) {
      const { FilePath, FileCode, Extension, FileName } = fileList[0].response;
      Object.assign(pdfDetail, {
        AttachmentPath: FilePath,
        Code: FileCode,
        AttachmentName: FileName,
        AttachmentExtension: Extension,
      });
      this.setState({ pdfDetail });
    }
  };

  render() {
    const { pdfDetail, isEdit } = this.state;
    const {
      form: { getFieldDecorator },
      global: { TI_Z01802 },
      addLoding,
      fetchLoading,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 10 },
      },
    };
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const formContentLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };

    return (
      <Card bordered={false} loading={fetchLoading}>
        <Form {...formItemLayout}>
          <Row gutter={8}>
            <Col md={24}>
              <FormItem key="AttachmentPath" {...formContentLayout} label="上传附件">
                <Upload onChange={this.uploadSuccess} Folder="TI_Z054" />
                附件地址：{pdfDetail.AttachmentPath}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12}>
              <FormItem key="Type" {...formLayout} label="分类">
                {getFieldDecorator('Type', {
                  initialValue: pdfDetail.Type,
                  rules: [{ required: true, message: '请选择分类' }],
                })(<MDMCommonality initialValue={pdfDetail.Type} data={TI_Z01802} />)}
              </FormItem>
            </Col>
            <Col md={12}>
              <FormItem key="IsShow" {...formLayout} label="是否开启">
                {getFieldDecorator('IsShow', {
                  initialValue: pdfDetail.IsShow === 'Y',
                  rules: [{ required: true, message: '请选择是否开启！' }],
                  valuePropName: 'checked',
                })(<Switch />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col md={12}>
              <FormItem key="AttachmentName" {...formLayout} label="附件描述">
                {getFieldDecorator('AttachmentName', {
                  initialValue: pdfDetail.AttachmentName,
                  rules: [{ required: true, message: '请输入附件描述！' }],
                })(<TextArea placeholder="请输入附件描" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <div style={{ display: isEdit ? 'block' : 'none' }}>
              <FormItem key="Content" {...formContentLayout} label="内容">
                {getFieldDecorator('Content', {
                  rules: [{ required: true, message: '请输入内容！' }],
                })(<UEditor initialValue={pdfDetail.Content} />)}
              </FormItem>
            </div>
            <div style={{ display: !isEdit ? 'block' : 'none' }}>
              <FormItem key="Content" {...formContentLayout} label="内容">
                <div dangerouslySetInnerHTML={{ __html: pdfDetail.Content }} />
              </FormItem>
            </div>
          </Row>
        </Form>
        <FooterToolbar>
          {pdfDetail.Code ? (
            <Fragment>
              <Button type="primary" onClick={this.updataHandle} loading={addLoding}>
                更新
              </Button>
              <Button onClick={() => this.setState({ isEdit: true })} type="primary">
                编辑内容
              </Button>
            </Fragment>
          ) : (
            <Button onClick={this.updataHandle} type="primary" loading={addLoding}>
              保存
            </Button>
          )}
        </FooterToolbar>
      </Card>
    );
  }
}
export default PafEditPage;
