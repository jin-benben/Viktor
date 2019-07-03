/* eslint-disable no-script-url */
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { Row, Col, Card, Form, Input, Button, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import EditTemplate from './components';
import { getName } from '@/utils/utils';
import { emailSendType } from '@/utils/publicData';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ emailSendTemplate, loading, global }) => ({
  emailSendTemplate,
  global,
  loading: loading.models.emailSendTemplate,
}))
@Form.create()
class EmailSendTemplate extends PureComponent {
  state = {
    modalVisible: false,
    isadd: true,
    templatdetail: {
      Code: '',
      Name: '',
      Comment: '',
      BaseType: '',
      PrintType: '',
      HtmlTemplateCode: '',
    },
  };

  columns = [
    {
      title: '代码',
      width: 80,
      dataIndex: 'Code',
      render: (text, record) => (
        <a href="javascript:;" onClick={() => this.changeTemplate(record)}>
          {text}
        </a>
      ),
    },
    {
      title: '名称',
      width: 100,
      dataIndex: 'Name',
    },
    {
      title: '单据类型',
      dataIndex: 'BaseType',
      width: 100,
      render: text => <span>{getName(emailSendType, text)}</span>,
    },
    {
      title: '内容模板',
      width: 100,
      dataIndex: 'HtmlTemplateCode',
      render: text => (
        <Ellipsis tooltip lines={5}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '备注',
      width: 100,
      dataIndex: 'Comment',
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      emailSendTemplate: { queryData },
    } = this.props;
    dispatch({
      type: 'emailSendTemplate/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  addNewTemplate = () => {
    this.setState({
      templatdetail: {
        Code: '',
        Name: '',
        Comment: '',
        BaseType: '',
        PrintType: '',
        HtmlTemplateCode: '',
      },
      modalVisible: true,
    });
  };

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      emailSendTemplate: { queryData },
    } = this.props;
    dispatch({
      type: 'emailSendTemplate/fetch',
      payload: {
        ...queryData,
        page: pagination.current,
        rows: pagination.pageSize,
      },
    });
  };

  changeTemplate = record => {
    this.setState({ isadd: false, templatdetail: { ...record }, modalVisible: true });
  };

  handleSearch = e => {
    // 搜索
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'emailSendTemplate/fetch',
        payload: {
          Content: {
            SearchText: '',
            SearchKey: 'Name',
            ...fieldsValue,
          },
          page: 1,
          rows: 30,
          sidx: 'Code',
          sord: 'Desc',
        },
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({ modalVisible: !!flag });
  };

  addOrderTempate = fieldsValue => {
    const {
      dispatch,
      emailSendTemplate: { queryData },
    } = this.props;
    const { isadd } = this.state;
    this.setState({
      templatdetail: { ...fieldsValue },
    });
    if (isadd) {
      dispatch({
        type: 'emailSendTemplate/add',
        payload: {
          Content: {
            ...fieldsValue,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('添加成功');
            this.handleModalVisible(false);
            dispatch({
              type: 'emailSendTemplate/fetch',
              payload: {
                ...queryData,
              },
            });
          }
        },
      });
    } else {
      dispatch({
        type: 'emailSendTemplate/update',
        payload: {
          Content: {
            ...fieldsValue,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('更新成功');
            this.handleModalVisible(false);
            dispatch({
              type: 'emailSendTemplate/fetch',
              payload: {
                ...queryData,
              },
            });
          }
        },
      });
    }
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem key="SearchText" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>

          <Col md={5} sm={24}>
            <FormItem key="searchBtn">
              <span className="submitButtons">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                  icon="plus"
                  style={{ marginLeft: 8 }}
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  新建
                </Button>
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      emailSendTemplate: { templateList, pagination },
      loading,
    } = this.props;
    const { modalVisible, templatdetail } = this.state;
    const parentMethod = {
      handleSubmit: this.addOrderTempate,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Card bordered={false}>
        <div className="tableList">
          <div className="tableListForm">{this.renderSimpleForm()}</div>
          <StandardTable
            loading={loading}
            data={{ list: templateList }}
            pagination={pagination}
            rowKey="Code"
            scroll={{ y: 600 }}
            columns={this.columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
        <EditTemplate {...parentMethod} templatdetail={templatdetail} modalVisible={modalVisible} />
      </Card>
    );
  }
}

export default EmailSendTemplate;
