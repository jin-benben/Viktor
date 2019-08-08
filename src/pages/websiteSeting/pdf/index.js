import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button,Tag } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import MyIcon from '@/components/MyIcon';
import MDMCommonality from '@/components/Select';
import Text from '@/components/Text';
import { formLayout } from '@/utils/publicData';
import {getName} from '@/utils/utils'

const FormItem = Form.Item;


@connect(({ pdfData, loading, global }) => ({
  pdfData,
  global,
  loading: loading.models.pdfData,
}))
@Form.create()
class PdfDataPage extends PureComponent {
  columns = [
    {
      title: '附件代码',
      dataIndex: 'Code',
      width: 100,
      render: text => <Text text={text} />,
    },
    {
      title: '分类',
      dataIndex: 'Type',
      width: 100,
      render: text => {
        const {
          global: { TI_Z01802 },
        } = this.props;
        return <span>{getName(TI_Z01802, text)}</span>;
      },
    },
    {
      title: '附件描述',
      dataIndex: 'AttachmentName',
      width: 200,
      render: text => <Text text={text} />,
    },
    {
      title: '附件路径',
      dataIndex: 'AttachmentPath',
      width:100,
      render: text => <a href={text} target="_blank" rel="noopener noreferrer">文件地址</a>,
    },
    {
      title: '扩展名',
      dataIndex: 'AttachmentExtension',
      width:80,
    },
    {
      title: '是否显示',
      width: 80,
      dataIndex: 'IsShow',
      render: text =>
        text === 'Y' ? <Tag color="green">显示</Tag> : <Tag color="gold">不显示</Tag>,
    },
    {
      title: '创建日期',
      width: 100,
      dataIndex: 'CreateDate',
      render: val => (
        <Ellipsis tooltip lines={1}>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '操作',
      width: 50,
      align: 'center',
      render: (text, record) => (
        <a href={`/websiteSeting/pdf/detail?Code=${record.Code}`}>
          <MyIcon type="iconedit" />
        </a>
      ),
    },
  ];

  componentDidMount() {
    const {dispatch,pdfData: { queryData },} = this.props;
    dispatch({
      type: 'pdfData/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['TI_Z01802'],
          Key:"7",
        },
      },
    });
  }



  handleStandardTableChange = pagination => {
    const {
      dispatch,
      pdfData: { queryData },
    } = this.props;
    dispatch({
      type: 'pdfData/fetch',
      payload: {
        ...queryData,
        page: pagination.current,
        rows: pagination.pageSize,
      },
    });
  };

  handleSearch = e => {
    // 搜索
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'pdfData/fetch',
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

  renderSimpleForm() {
    const {form: { getFieldDecorator }, global: { TI_Z01802 },} = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem key="SearchText" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="Type" {...formLayout} label="分类">
              {getFieldDecorator('Type')(<MDMCommonality data={TI_Z01802} />)}
            </FormItem>
          </Col>
          <Col md={2} sm={24}>
            <FormItem key="searchBtn">
              <span className="submitButtons">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{marginLeft:8}} type="primary" onClick={()=>this.handleModalVisible(true)}>
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
      pdfData: { pdfDataList, pagination },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: pdfDataList }}
              pagination={pagination}
              rowKey="Code"
              scroll={{ x: 1000 }}
              columns={this.columns}
              onRow={this.handleOnRow}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
       
      </Fragment>
    );
  }
}

export default PdfDataPage;
