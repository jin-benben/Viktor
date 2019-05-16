import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Modal, Button, DatePicker, message, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import EditableFormTable from '@/components/EditableFormTable';
import { isRegExp } from 'util';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class CreateForm extends PureComponent {
  constructor(props) {
    super(props);
    let { formVals } = props;
    formVals = formVals.map((item, index) => {
      item.key = index;
      return item;
    });
    this.state = {
      TI_Z03601: formVals,
    };
  }

  columns = [
    {
      title: '代码',
      dataIndex: 'Code',
      inputType: 'text',
      editable: true,
    },
    {
      title: '名称',
      dataIndex: 'Name',
      inputType: 'text',
      editable: true,
    },
  ];

  rowChange = record => {
    const { TI_Z03601 } = this.state;
    TI_Z03601.map(item => {
      if (item.key === record.key) {
        return record;
      }
      return item;
    });
    this.setState({ TI_Z03601: [...TI_Z03601] });
  };

  okHandle = () => {
    const { TI_Z03601, handleSubmit } = this.props;
    handleSubmit({ TI_Z03601 });
  };

  addLine = () => {
    let { TI_Z03601 } = this.state;
    if (!TI_Z03601.length) {
      TI_Z03601.push({ Code: '', Name: '', key: 1 });
      this.setState({ TI_Z03601: [...TI_Z03601] });
      return;
    }
    const last = TI_Z03601[TI_Z03601.length - 1];
    if (last.Code && last.Name) {
      TI_Z03601.push({ Code: '', Name: '', key: last.key + 1 });
      this.setState({ TI_Z03601: [...TI_Z03601] });
    } else {
      message.warning('请先填完上一个');
    }
  };

  render() {
    const { modalVisible, handleModalVisible } = this.props;
    const { TI_Z03601 } = this.state;
    console.log(TI_Z03601);

    return (
      <Modal
        width={640}
        destroyOnClose
        title="编辑"
        okText="保存"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Fragment>
          <Button icon="plus" style={{ marginBottom: 20 }} type="primary" onClick={this.addLine}>
            添加行
          </Button>
          <EditableFormTable
            rowChange={this.rowChange}
            pagination={false}
            columns={this.columns}
            data={TI_Z03601}
          />
        </Fragment>
      </Modal>
    );
  }
}
/* eslint react/no-multi-comp:0 */
@connect(({ hscode, loading }) => ({
  hscode,
  loading: loading.models.hscode,
}))
@Form.create()
class HSCode extends PureComponent {
  state = {
    modalVisible: false,
    method: 'A',
    formValues: [],
  };

  columns = [
    {
      title: '代码',
      dataIndex: 'Code',
    },
    {
      title: '名称',
      dataIndex: 'Name',
    },
    {
      title: '操作',

      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
          {/* <Divider type="vertical" />
          <a href="">删除</a> */}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      hscode: { queryData },
    } = this.props;
    dispatch({
      type: 'hscode/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      hscode: { queryData },
    } = this.props;
    dispatch({
      type: 'hscode/fetch',
      payload: {
        ...queryData,
        page: pagination.current,
        rows: pagination.pageSize,
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'hscode/fetch',
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

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      method: 'U',
      formValues: [record],
    });
  };

  handleSubmit = fieldsValue => {
    const {
      dispatch,
      hscode: { queryData },
    } = this.props;
    const { method } = this.state;
    if (method === 'A') {
      dispatch({
        type: 'hscode/add',
        payload: {
          Content: {
            ...fieldsValue,
          },
        },
        callback: response => {
          if (response.Status === 200) {
            this.handleModalVisible(false);
            message.success('添加成功');
            dispatch({
              type: 'hscode/fetch',
              payload: {
                ...queryData,
              },
            });
          }
        },
      });
    } else {
      dispatch({
        type: 'hscode/update',
        payload: {
          Content: {
            ...fieldsValue,
          },
        },
        callback: response => {
          if (response.Status === 200) {
            this.handleModalVisible(false);
            message.success('更新成功');
            dispatch({
              type: 'hscode/fetch',
              payload: {
                ...queryData,
              },
            });
          }
        },
      });
    }
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      method: 'A',
      formValues: [],
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('SearchText')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
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
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      hscode: { hscodeList, pagination },
      loading,
    } = this.props;
    const { modalVisible, formValues } = this.state;
    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: hscodeList }}
              rowKey="Code"
              pagination={pagination}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} formVals={formValues} modalVisible={modalVisible} />
      </Fragment>
    );
  }
}

export default HSCode;
