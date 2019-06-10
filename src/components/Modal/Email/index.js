import React, { PureComponent, Fragment } from 'react';

import { Row, Col, Form, Input, Modal, Button, message } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import request from '@/utils/request';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { emailSendType } from '@/utils/publicData';
import { getName } from '@/utils/utils';
import router from 'umi/router';

const FormItem = Form.Item;

@Form.create()
@connect(({ global }) => ({
  global,
}))
class EmailModal extends PureComponent {
  state = {
    templateList: [],
    selectedRows: [],
    loading: false,
    queryData: {
      Content: {
        BaseType: '',
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
      sidx: 'Code',
      sord: 'Desc',
    },
    pagination: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['30', '60', '90'],
      total: 0,
      pageSize: 30,
      current: 1,
    },
  };

  columns = [
    {
      title: '代码',
      width: 80,
      dataIndex: 'Code',
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
    const { queryData } = this.state;
    this.getTemplate(queryData);
  }

  componentWillReceiveProps(nextProps) {
    const { queryData } = this.state;
    if (nextProps.BaseType !== queryData.Content.BaseType) {
      Object.assign(queryData.Content, { BaseType: nextProps.BaseType });
      this.getTemplate(queryData);
      return {
        queryData: {
          ...queryData,
        },
      };
    }
    return null;
  }

  okHandle = () => {
    const { selectedRows } = this.state;
    const { BaseEntry, BaseType } = this.props;
    if (selectedRows.length) {
      const { Code, Name } = selectedRows[0];
      router.push(
        `/base/sendEmail?BaseEntry=${BaseEntry}&BaseType=${BaseType}&Code=${Code}&Name=${Name}`
      );
    } else {
      message.warning('请先选择');
    }
  };

  onSelectRow = selectedRows => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  handleStandardTableChange = pagination => {
    let { queryData } = this.state;
    queryData = {
      ...queryData,
      page: pagination.current,
      rows: pagination.pageSize,
    };
    this.setState({ queryData });
    this.getTemplate(queryData);
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const { queryData } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.getTemplate({
        Content: {
          ...queryData,
          ...fieldsValue,
        },
        page: 1,
        rows: 30,
        sidx: 'Code',
        sord: 'Desc',
      });
    });
  };

  getTemplate = async params => {
    const response = await request('/MDM/TI_Z046/TI_Z04602', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    if (response && response.Status === 200) {
      if (response.Content) {
        const { rows, records, page } = response.Content;
        const { pagination } = this.state;
        this.setState({
          templateList: [...rows],
          pagination: { ...pagination, total: records, current: page },
        });
      }
    }
  };

  handleModalVisible = flag => {
    this.setState({ modalVisible: !!flag });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8 }}>
          <Col>
            <FormItem>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { pagination, templateList, modalVisible, loading } = this.state;
    return (
      <Fragment>
        <Button onClick={() => this.handleModalVisible(true)} type="primary">
          提交邮件
        </Button>
        <Modal
          width={960}
          destroyOnClose
          confirmLoading={loading}
          title="模板选择"
          visible={modalVisible}
          onOk={this.okHandle}
          onCancel={() => this.handleModalVisible(false)}
        >
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: templateList }}
              rowKey="Code"
              scroll={{ y: 400 }}
              pagination={pagination}
              columns={this.columns}
              rowSelection={{
                type: 'radio',
                onSelectRow: this.onSelectRow,
              }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default EmailModal;
