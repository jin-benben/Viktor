import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Form, Row, Col, Input, message, Switch } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import UEditor from '@/components/Ueditor';
import MDMCommonality from '@/components/Select';
import Upload from '@/components/Upload';
import { articleType } from '@/utils/publicData';

const FormItem = Form.Item;
const { TextArea } = Input;
function getCategory(dispatch, Key) {
  dispatch({
    type: 'global/getMDMCommonality',
    payload: {
      Content: {
        CodeList: ['TI_Z01802'],
        Key,
      },
    },
  });
}

function onFieldsChange(props, changedFields) {
  const { dispatch } = props;
  const { Type } = changedFields;
  if (Type && Type.name === 'Type') {
    getCategory(dispatch, Type.value);
  }
}
@connect(({ articleEdit, loading, global }) => ({
  articleEdit,
  global,
  addLoding: loading.effects['articleEdit/add'],
  fetchLoading: loading.effects['articleEdit/fetch'],
  updateLoading: loading.effects['articleEdit/update'],
}))
@Form.create({ onFieldsChange })
class ArticleEditPage extends PureComponent {
  state = {
    articleDetail: {
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
    this.getDetail();
  }

  getDetail = () => {
    const {
      location: { query },
      dispatch,
    } = this.props;
    if (query.DocEntry) {
      dispatch({
        type: 'articleEdit/fetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            this.setState({
              articleDetail: {
                ...response.Content,
              },
              isEdit: false,
            });
            getCategory(dispatch, response.Content.Type);
          }
        },
      });
    }
  };

  updataHandle = e => {
    // 搜索
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { articleDetail } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        articleDetail: {
          ...articleDetail,
          ...fieldsValue,
          IsShow: fieldsValue.IsShow ? 'Y' : 'N',
        },
      });
      dispatch({
        type: 'articleEdit/update',
        payload: {
          Content: {
            ...articleDetail,
            ...fieldsValue,
            IsShow: fieldsValue.IsShow ? 'Y' : 'N',
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('保存成功');
            this.getDetail();
          }
        },
      });
    });
  };

  addHandle = e => {
    // 搜索
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { articleDetail } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        articleDetail: {
          ...articleDetail,
          ...fieldsValue,
          IsShow: fieldsValue.IsShow ? 'Y' : 'N',
        },
      });
      dispatch({
        type: 'articleEdit/add',
        payload: {
          Content: {
            ...articleDetail,
            ...fieldsValue,
            IsShow: fieldsValue.IsShow ? 'Y' : 'N',
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('添加成功');
            router.push(`/websiteSeting/articleEdit?DocEntry=${response.Content.DocEntry}`);
          }
        },
      });
    });
  };

  changePicture = ({ FilePath, FileCode }) => {
    const { articleDetail } = this.state;
    Object.assign(articleDetail, {
      PicturePath: FilePath,
      PicCode: FileCode,
    });
    this.setState({
      articleDetail,
    });
  };

  render() {
    const { articleDetail, isEdit } = this.state;
    const {
      form: { getFieldDecorator },
      global: { TI_Z01802 },
      addLoding,
      updateLoading,
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
            <Col md={12}>
              <FormItem key="PicturePath" {...formLayout} label="列表图片">
                <Upload
                  onChange={this.changePicture}
                  type="MDM"
                  Folder="TI_Z009"
                  title="主图"
                  initialValue={articleDetail.PicturePath}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12}>
              <FormItem key="Title" {...formLayout} label="标题">
                {getFieldDecorator('Title', {
                  initialValue: articleDetail.Title,
                  rules: [{ required: true, message: '请输入标题' }],
                })(<Input placeholder="请输入标题" />)}
              </FormItem>
            </Col>
            <Col md={12}>
              <FormItem key="Type" {...formLayout} label="类型">
                {getFieldDecorator('Type', {
                  initialValue: articleDetail.Type,
                  rules: [{ required: true, message: '请选择类型' }],
                })(<MDMCommonality initialValue={articleDetail.Type} data={articleType} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormItem key="Category" {...formLayout} label="分类">
                {getFieldDecorator('Category', {
                  initialValue: articleDetail.Category,
                  rules: [{ required: true, message: '请选择分类' }],
                })(<MDMCommonality initialValue={articleDetail.Category} data={TI_Z01802} />)}
              </FormItem>
            </Col>
            <Col md={12}>
              <FormItem key="IsShow" {...formLayout} label="是否开启">
                {getFieldDecorator('IsShow', {
                  initialValue: articleDetail.IsShow === 'Y',
                  valuePropName: 'checked',
                })(<Switch />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormItem key="Presentation" {...formLayout} label="简介">
                {getFieldDecorator('Presentation', {
                  initialValue: articleDetail.Presentation,
                  rules: [{ required: true, message: '请输入简介' }],
                })(<TextArea placeholder="请输入简介" />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <div style={{ display: isEdit ? 'block' : 'none' }}>
              <FormItem key="Content" {...formContentLayout} label="内容">
                {getFieldDecorator('Content', {
                  rules: [{ required: true, message: '请输入内容！' }],
                })(<UEditor initialValue={articleDetail.Content} />)}
              </FormItem>
            </div>
            <div style={{ display: !isEdit ? 'block' : 'none' }}>
              <FormItem key="Content" {...formContentLayout} label="内容">
                <div dangerouslySetInnerHTML={{ __html: articleDetail.Content }} />
              </FormItem>
            </div>
          </Row>
        </Form>
        <FooterToolbar>
          {articleDetail.DocEntry ? (
            <Fragment>
              <Button type="primary" onClick={this.updataHandle} loading={updateLoading}>
                更新
              </Button>
              <Button onClick={() => this.setState({ isEdit: true })} type="primary">
                编辑内容
              </Button>
            </Fragment>
          ) : (
            <Button onClick={this.addHandle} type="primary" loading={addLoding}>
              保存
            </Button>
          )}
        </FooterToolbar>
      </Card>
    );
  }
}
export default ArticleEditPage;
