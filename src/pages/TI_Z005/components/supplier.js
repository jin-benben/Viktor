import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { Row, Col, Form, Input, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import request from '@/utils/request';

const FormItem = Form.Item;

@Form.create()
class SupplierList extends PureComponent {
  columns = [
    {
      title: '供应商ID',
      width: 100,
      dataIndex: 'Code',
      render: text => (
        <Link target="_blank" to={`/main/TI_Z007/detail?Code=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '供应商名称',
      dataIndex: 'Name',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      supplierList: [],
      queryData: {
        Content: {
          SearchText: '',
          IsCheck: 'Y',
          SearchKey: 'Name',
          BrandName: props.BrandName,
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
  }

  componentDidMount() {
    const { queryData } = this.state;
    this.getSupplier(queryData);
  }

  handleStandardTableChange = pagination => {
    let { queryData } = this.state;
    queryData = {
      ...queryData,
      page: pagination.current,
      rows: pagination.pageSize,
    };
    this.setState({ queryData });
    this.getSupplier(queryData);
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, BrandName } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const queryData = {
        Content: {
          BrandName,
          SearchText: '',
          IsCheck: 'Y',
          SearchKey: 'Name',
          ...fieldsValue,
        },
        page: 1,
        rows: 30,
        sidx: 'Code',
        sord: 'Desc',
      };
      this.getSupplier(queryData);
    });
  };

  getSupplier = async params => {
    const response = await request('/MDM/TI_Z007/TI_Z00702', {
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
          supplierList: [...rows],
          pagination: { ...pagination, total: records, current: page },
        });
      }
    }
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
    const { loading, pagination, supplierList } = this.state;
    return (
      <div className="tableList">
        <div className="tableListForm">{this.renderSimpleForm()}</div>
        <StandardTable
          loading={loading}
          data={{ list: supplierList }}
          rowKey="Code"
          pagination={pagination}
          scroll={{ y: 500 }}
          columns={this.columns}
          onChange={this.handleStandardTableChange}
        />
      </div>
    );
  }
}

export default SupplierList;
