import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { Row, Col, Form, Input, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import request from '@/utils/request';

const FormItem = Form.Item;

@Form.create()
class SKUModal extends PureComponent {
  columns = [
    {
      title: '物料代码',
      width: 80,
      dataIndex: 'Code',
      render: text => (
        <Link target="_blank" to={`/main/product/TI_Z009/TI_Z00903?Code=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '物料名称',
      dataIndex: 'Name',
      width: 100,
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '型号',
      width: 100,
      dataIndex: 'ManufactureNO',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '参数',
      dataIndex: 'Parameters',
      width: 100,
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '包装',
      dataIndex: 'package',
      width: 100,
      render: text => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '单位',
      width: 80,
      dataIndex: 'Unit',
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 150,
      render: (text, record) => (
        <Ellipsis tooltip lines={1}>
          {' '}
          {`${record.Cate1Name}/${record.Cate2Name}/${record.Cate3Name}`}
        </Ellipsis>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      skuList: [],
      queryData: {
        Content: {
          SearchText: '',
          SearchKey: 'Name',
          BrandCode: props.BrandCode,
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
    this.getSKU(queryData);
  }

  handleStandardTableChange = pagination => {
    let { queryData } = this.state;
    queryData = {
      ...queryData,
      page: pagination.current,
      rows: pagination.pageSize,
    };
    this.setState({ queryData });
    this.getSKU(queryData);
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, BrandCode } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const queryData = {
        Content: {
          BranCode,
          SearchText: '',
          SearchKey: 'Name',
          ...fieldsValue,
        },
        page: 1,
        rows: 30,
        sidx: 'Code',
        sord: 'Desc',
      };
      this.getSKU(queryData);
    });
  };

  getSKU = async params => {
    const response = await request('/MDM/TI_Z009/TI_Z00902', {
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
          skuList: [...rows],
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
          <Col lg={4} md={12} sm={24}>
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
    const { loading, pagination, skuList } = this.state;
    return (
      <div className="tableList">
        <div className="tableListForm">{this.renderSimpleForm()}</div>
        <StandardTable
          loading={loading}
          data={{ list: skuList }}
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

export default SKUModal;
