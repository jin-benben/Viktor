import React, { PureComponent, Fragment } from 'react';
import { Row, Form, Input, Modal } from 'antd';
import StandardTable from '@/components/StandardTable';
import request from '@/utils/request';

const FormItem = Form.Item;
@Form.create()
class Company extends PureComponent {
  columns = [
    {
      title: '物料代码',
      dataIndex: 'Code',
    },
    {
      title: '物料名称',
      dataIndex: 'CardName',
    },
    {
      title: '品牌',
      dataIndex: 'BrandName',
    },

    {
      title: '型号',
      dataIndex: 'ManufactureNO',
    },
    {
      title: '参数',
      dataIndex: 'Parameters',
    },
    {
      title: '包装',
      dataIndex: 'package',
    },
    {
      title: '单位',
      dataIndex: 'Unit',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (text, record) => (
        <span>{`${record.Cate1Name}/${record.Cate2Name}/${record.Cate3Name}`}</span>
      ),
    },
    {
      title: '单位',
      dataIndex: 'Unit',
    },
    {
      title: '上架状态',
      dataIndex: 'Putaway',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      skuList: [],
      loading: false,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
  }

  componentDidMount() {}

  querySku = async params => {
    const response = await request('/MDM/TI_Z004/TI_Z00402', {
      method: 'POST',
      data: {
        ...params,
      },
    });
    if (response.Status === 200) {
      this.setState({
        skuList: response.Content.rows,
      });
    }
  };

  handleSelectRows = rows => {
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(rows);
    }
  };

  handleStandardTableChange = pagination => {
    // table change
    const { dispatch } = this.props;
    const { queryData } = this.state;
    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
    };

    dispatch({
      type: 'inquiryList/fetch',
      payload: {
        ...queryData,
        ...params,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      handleSubmit,
    } = this.props;
    const { skuList, loading, formVals } = this.state;
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

    return (
      <Modal
        width={640}
        destroyOnClose
        title="选择客户"
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => handleModalVisible()}
      >
        <Fragment>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Row>
              <FormItem key="UserName" {...this.formLayout} label="物料名称">
                {getFieldDecorator('UserName', {
                  rules: [{ required: true, message: '请输入物料名称！' }],
                  initialValue: formVals.UserName,
                })(<Input placeholder="请输入物料名称" />)}
              </FormItem>
            </Row>
          </Form>
          <StandardTable
            loading={loading}
            rowSelection={{ selectedRowKeys: [] }}
            data={skuList}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Fragment>
      </Modal>
    );
  }
}
export default Company;
