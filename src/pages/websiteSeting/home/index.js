import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import MyIcon from '@/components/MyIcon';
import CateModal from '@/components/Modal/Category';
import { formLayout } from '@/utils/publicData';

const FormItem = Form.Item;

@connect(({ homeSet, loading, global }) => ({
  homeSet,
  global,
  loading: loading.models.homeSet,
}))
@Form.create()
class HomeSetPage extends PureComponent {
  columns = [
    {
      title: '代码',
      dataIndex: 'Code',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'Name',
      width: 100,
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
      width: 80,
      align: 'center',
      render: (text, record) => (
        <a href={`/websiteSeting/homeSet?Code=${record.Code}`}>
          <MyIcon type="iconedit" />
        </a>
      ),
    },
  ];

  state = {
    modalVisible: false,
  };

  componentDidMount() {
    const {
      dispatch,
      homeSet: { queryData },
    } = this.props;
    dispatch({
      type: 'homeSet/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      homeSet: { queryData },
    } = this.props;
    dispatch({
      type: 'homeSet/fetch',
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
        type: 'homeSet/fetch',
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
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleSubmit = selectedRows => {
    const {
      dispatch,
      homeSet: { queryData, homeSetList },
    } = this.props;
    const TI_Z01901List = selectedRows.map(item => {
      const { Code, Name } = item;
      return { Code, Name };
    });
    dispatch({
      type: 'homeSet/add',
      payload: {
        Content: {
          TI_Z01901List: [...homeSetList, ...TI_Z01901List],
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('添加成功');
          this.handleModalVisible(false);
          dispatch({
            type: 'homeSet/fetch',
            payload: {
              ...queryData,
            },
          });
        }
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem key="SearchText" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={2} sm={24}>
            <FormItem key="searchBtn">
              <span className="submitButtons">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
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
      homeSet: { homeSetList, pagination },
      loading,
    } = this.props;
    const { modalVisible } = this.state;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: homeSetList }}
              pagination={pagination}
              rowKey="Code"
              scroll={{ x: 1000 }}
              columns={this.columns}
              onRow={this.handleOnRow}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <CateModal
            Type="checkbox"
            handleSubmit={this.handleSubmit}
            modalVisible={modalVisible}
            handleModalVisible={this.handleModalVisible}
          />
        </Card>
      </Fragment>
    );
  }
}

export default HomeSetPage;
