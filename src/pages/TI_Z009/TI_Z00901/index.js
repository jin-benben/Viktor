/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Button, Icon, Select, notification, List, Tag } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import EditableFormTable from '@/components/EditableFormTable';
import MDMCommonality from '@/components/Select';
import Brand from '@/components/Brand';
import HSCode from '@/components/HSCode';
import FHSCode from '@/components/FHSCode';
import SPUCode from '@/components/SPUCode';

const FormItem = Form.Item;
const { Option } = Select;
/* eslint react/no-multi-comp:0 */
@connect(({ skuAdd, global, loading }) => ({
  skuAdd,
  global,
  loading: loading.models.rule,
}))
@Form.create()

class AddSKU extends PureComponent {
  columns = [
    {
      title: '代码',
      dataIndex: 'Code',
      width: 80,
    },
    // {
    //   title: '描述',
    //   width: 100,
    //   dataIndex: 'Name',
    //   render: text => (
    //     <Ellipsis tooltip lines={1}>
    //       {text}
    //     </Ellipsis>
    //   ),
    // },
    {
      title: '品牌',
      width: 100,
      dataIndex: 'BrandName',
      render: (text, record, index) => (
        <Brand
          keyType="Name"
          initialValue={text}
          onChange={value => {
            this.codeChange(value, record, index, 'BrandName');
          }}
        />
      ),
    },
    {
      title: '名称',
      dataIndex: 'ProductName',
      inputType: 'textArea',
      width: 100,
      editable: true,
    },
    {
      title: '英文名称',
      width: 100,
      inputType: 'textArea',
      dataIndex: 'EnglishName',
      editable: true,
    },
    {
      title: '型号',
      width: 100,
      dataIndex: 'ManufactureNO',
      inputType: 'textArea',
      editable: true,
    },
    {
      title: '参数',
      width: 150,
      dataIndex: 'Parameters',
      inputType: 'textArea',
      editable: true,
    },
    {
      title: '规格(外)',
      width: 150,
      dataIndex: 'ForeignParameters',
      inputType: 'textArea',
      editable: true,
      align: 'center',
    },
    {
      title: '包装',
      width: 100,
      dataIndex: 'Package',
      inputType: 'text',
      editable: true,
    },
    {
      title: '采购员',
      width: 100,
      dataIndex: 'Purchaser',
      render: (text, record, index) => {
        const {
          global: { Purchaser },
        } = this.props;
        return (
          <MDMCommonality
            onChange={value => {
              this.codeChange(value, record, index, 'Purchaser');
            }}
            initialValue={text}
            data={Purchaser}
          />
        );
      },
    },
    {
      title: '单位',
      width: 80,
      inputType: 'text',
      dataIndex: 'Unit',
      editable: true,
    },

    {
      title: 'SPU编码',
      width: 150,
      dataIndex: 'SPUCode',
      render: (text, record, index) => {
        const {
          skuAdd: { spuList },
        } = this.props;
        return (
          <SPUCode
            initialValue={text}
            data={spuList}
            onChange={select => {
              this.spuChange(select, record, index);
            }}
          />
        );
      },
    },
    {
      title: '开票名称',
      width: 150,
      inputType: 'textArea',
      dataIndex: 'InvoiceName',
      editable: true,
    },
    {
      title: '开票核心规格',
      width: 150,
      inputType: 'textArea',
      dataIndex: 'InvoicePro',
      editable: true,
    },
    {
      title: '开票目录分类',
      width: 150,
      inputType: 'textArea',
      dataIndex: 'InvoiceMenu',
      editable: true,
    },
    {
      title: '上架状态',
      width: 80,
      dataIndex: 'Putaway',
      render: (text, record, index) => (
        <Select
          defaultValue={record.Putaway}
          onChange={value => this.codeChange(value, record, index, 'Putaway')}
        >
          <Option value="1">是</Option>
          <Option value="2">否</Option>
        </Select>
      ),
    },
    {
      title: '上架日期',
      width: 130,
      inputType: 'date',
      editable: true,
      dataIndex: 'PutawayDateTime',
    },
    {
      title: 'HS编码',
      width: 150,
      inputType: 'text',
      dataIndex: 'HSCode',
      render: (text, record, index) => {
        const {
          skuAdd: { hscodeList },
        } = this.props;
        return (
          <HSCode
            initialValue={text}
            data={hscodeList}
            onChange={hsCode => {
              this.hsCodeChange(hsCode, record, index);
            }}
          />
        );
      },
    },
    {
      title: 'FHS编码',
      width: 150,
      inputType: 'text',
      dataIndex: 'FHSCode',
      render: (text, record, index) => {
        const {
          skuAdd: { fhscodeList },
        } = this.props;
        return (
          <FHSCode
            initialValue={text}
            data={fhscodeList}
            onChange={hsCode => {
              this.codeChange(hsCode, record, index, 'FHSCode');
            }}
          />
        );
      },
    },
    {
      title: '销售价格',
      width: 100,
      inputType: 'text',
      dataIndex: 'SPrice',
      editable: true,
    },
    {
      title: '采购价格',
      width: 100,
      inputType: 'text',
      dataIndex: 'PPrice',
      editable: true,
    },
    {
      title: '产地',
      width: 100,
      dataIndex: 'ManLocation',
      render: (text, record, index) => {
        const {
          global: { TI_Z042 },
        } = this.props;
        return (
          <MDMCommonality
            onChange={value => {
              this.codeChange(value, record, index, 'ManLocation');
            }}
            initialValue={text}
            data={TI_Z042}
          />
        );
      },
    },
    {
      title: '重量',
      width: 80,
      dataIndex: 'Rweight',
      editable: true,
    },
    {
      title: '分类',
      width: 200,
      dataIndex: 'category',
      render: (text, record) => (
        <span>{`${record.Cate1Name}/${record.Cate2Name}/${record.Cate3Name}`}</span>
      ),
    },
    {
      title: '操作',
      fixed: 'right',
      width: 50,
      render: (text, record, index) => (
        <Fragment>
          <Icon
            title="删除行"
            className="icons"
            type="delete"
            theme="twoTone"
            onClick={() => this.deleteLine(record, index)}
          />
        </Fragment>
      ),
    },
  ];

  state = {
    TI_Z00901: [],
    selectedRows: [],
    queryData: {
      Content: {
        BrandName: '',
        Category: '',
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
      sidx: 'Code',
      sord: 'Desc',
    },
  };

  componentDidMount() {
    const {
      dispatch,global: { BrandList, CategoryTree, Purchaser, WhsCode },
      location: { query },
    } = this.props;
    const { BrandName, Category } = query;
    const { queryData } = this.state;
    Object.assign(queryData.Content, { BrandName: BrandName || '', Category: Category || '' });
    this.setState({ queryData: { ...queryData } });
    dispatch({
      type: 'skuAdd/fetch',
      payload: {
        ...queryData,
      },
    });
   
    if (!Purchaser.length || WhsCode.length) {
      dispatch({
        type: 'global/getMDMCommonality',
        payload: {
          Content: {
            CodeList: ['Purchaser', 'TI_Z042', 'WhsCode', 'Saler'],
          },
        },
      });
    }
    if (!BrandList.length) {
      dispatch({
        type: 'global/getBrand',
      });
    }
    if (!CategoryTree.length) {
      dispatch({
        type: 'global/getCategory',
      });
    }
    dispatch({
      type: 'skuAdd/fetchList',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { queryData } = this.state;
    dispatch({
      type: 'skuAdd/fetch',
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
    const { queryData } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'skuAdd/fetch',
        payload: {
          Content: {
            SearchText: '',
            SearchKey: 'Name',
            ...queryData.Content,
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

  // spu change 获取code与分类
  spuChange = (select, record, index) => {
    const { Code, Cate1Name, Cate2Name, Cate3Name, Category1, Category2, Category3 } = select;
    const { TI_Z00901 } = this.state;
    Object.assign(record, {
      SPUCode: Code,
      Cate1Name,
      Cate2Name,
      Cate3Name,
      Category1,
      Category2,
      Category3,
    });
    TI_Z00901[index] = record;
    this.setState({ TI_Z00901 });
  };

  deleteLine = (record, index) => {
    const { TI_Z00901 } = this.state;
    TI_Z00901.splice(index, 1);
    this.setState({ TI_Z00901 });
  };

  categoryChange = (category, record, index) => {
    const { TI_Z00901 } = this.state;
    TI_Z00901[index] = { ...record, ...category };
    this.setState({ TI_Z00901 });
  };

  codeChange = (value, row, index, key) => {
    // eslint-disable-next-line no-param-reassign
    row[key] = value;
    row.Name = `${row.BrandName}  ${row.ProductName}  ${row.ManufactureNO}`;
    const { TI_Z00901 } = this.state;
    TI_Z00901[index] = row;
    this.setState({ TI_Z00901 });
  };

  hsCodeChange = (value, row, index) => {
    // eslint-disable-next-line no-param-reassign
    row.HSCode = value.Code;
    const { TI_Z00901 } = this.state;
    TI_Z00901[index] = row;
    this.setState({ TI_Z00901 });
  };

  rowChange = record => {
    const { TI_Z00901 } = this.state;
    TI_Z00901.map(item => {
      if (item.LineID === record.LineID) {
        record.Name = `${record.BrandName}  ${record.ProductName}  ${record.ManufactureNO}`;
        return record;
      }
      return item;
    });
    this.setState({ TI_Z00901 });
  };

  onSelectRow=selectedRows=>{
    this.setState({
      selectedRows:[...selectedRows]
    })
  }

  addskulist = async () => {
    const { TI_Z00901 } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'skuAdd/add',
      payload: {
        Content: {
          TI_Z00901,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          const dataList = response.Content.TI_Z00901;
          notification.open({
            message: '添加提示',
            icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
            description: (
              <List
                bordered
                dataSource={dataList}
                renderItem={item => (
                  <List.Item>
                    {item.Code}
                    {item.Name}
                    {item.Status === 1 ? <Tag color="blue">成功</Tag> : <Tag color="red">失败</Tag>}
                  </List.Item>
                )}
              />
            ),
          });
          this.setState({ TI_Z00901: [] });
        }
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      queryData: {
        Content: { BrandName, Category },
      },
    } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="报价单号">
              {getFieldDecorator('QutoNo')(<Input placeholder="请输入单号" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem key="BrandName" label="品牌">
              {getFieldDecorator('BrandName', { initialValue: BrandName })(
                <Input placeholder="请输入品牌" />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem key="Category" label="分类">
              {getFieldDecorator('Category', { initialValue: Category })(
                <Input placeholder="请输入分类" />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      skuAdd: { skuList, pagination },
      loading,addloading
    } = this.props;
    console.log(skuList)
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <EditableFormTable
              rowChange={this.rowChange}
              rowKey="Code"
              loading={loading}
              pagination={pagination}
              scroll={{ x: 3500 }}
              rowSelection={{
                onChange: this.onSelectRow,
              }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              data={skuList}
              
            />
            
          </div>
          <FooterToolbar>
            <Button loading={addloading} onClick={this.addskulist} type="primary">
              更新
            </Button>
          </FooterToolbar>
        </Card>
      </Fragment>
    );
  }
}

export default AddSKU;

