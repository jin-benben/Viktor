/* eslint-disable no-param-reassign */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Modal, Button, message, Divider, Select } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import Supplier from '@/components/Supplier';
import Upload from '@/components/Upload';
import MDMCommonality from '@/components/Select';
import { getName } from '@/utils/utils';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;

const brandLevel = [
  {
    Key: '1',
    Value: '优势',
  },
  {
    Key: '2',
    Value: '可询价',
  },
  {
    Key: '3',
    Value: '国外不询价',
  },
];

@connect(({ global }) => ({
  global,
}))
@Form.create()
class CreateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        CardCode: '',
        CardName: '',
      },
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const {
      dispatch,
      global: { Purchaser, SupplierList },
    } = this.props;
    if (!SupplierList.length) {
      dispatch({
        type: 'global/getSupplier',
      });
    }
    if (!Purchaser.length) {
      dispatch({
        type: 'global/getMDMCommonality',
        payload: {
          Content: {
            CodeList: ['Purchaser'],
          },
        },
      });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.formVals !== prevState.formVals) {
      return {
        formVals: nextProps.formVals,
      };
    }
    return null;
  }

  changePicture = ({ FilePath, FilePathX }) => {
    const { formVals } = this.props;
    Object.assign(formVals, { Picture: FilePath, Picture_List: FilePathX });
  };

  render() {
    const {
      form: { getFieldDecorator },
      global: { Purchaser },
      form,
      modalVisible,
      handleModalVisible,
      handleSubmit,
    } = this.props;
    const { formVals } = this.state;
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
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        delete fieldsValue.Picture;
        if (
          fieldsValue.WebSite.indexOf('Http://') === -1 &&
          fieldsValue.WebSite.indexOf('Https://') === -1
        ) {
          fieldsValue.WebSite = fieldsValue.prefix + fieldsValue.WebSite;
        }
        delete fieldsValue.prefix;
        handleSubmit({ ...formVals, ...fieldsValue });
      });
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 'Http://',
    })(
      <Select style={{ width: 90 }}>
        <Option value="Http://">Http://</Option>
        <Option value="Https://">Https://</Option>
      </Select>
    );

    return (
      <Modal
        width={640}
        destroyOnClose
        title="品牌编辑"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <FormItem key="Name" {...this.formLayout} label="名称">
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: '请输入名称！' }],
              initialValue: formVals.Name,
            })(<Input placeholder="请输入名称！" />)}
          </FormItem>
          <FormItem key="Purchaser" {...this.formLayout} label="采购员">
            {getFieldDecorator('Purchaser', {
              rules: [{ required: true, message: '请选择采购员！' }],
              initialValue: formVals.Purchaser,
            })(<MDMCommonality initialValue={formVals.Purchaser} data={Purchaser} />)}
          </FormItem>
          <FormItem key="supplier" {...this.formLayout} label="默认供应商">
            {getFieldDecorator('supplier', {
              initialValue: { key: formVals.CardCode, label: formVals.CardName },
            })(
              <Supplier
                initialValue={{ key: formVals.CardCode, label: formVals.CardName }}
                labelInValue
              />
            )}
          </FormItem>
          <FormItem key="WebSite" {...this.formLayout} label="官网">
            {getFieldDecorator('WebSite', {
              initialValue: formVals.WebSite,
            })(<Input addonBefore={prefixSelector} placeholder="请输入官网！" />)}
          </FormItem>
          <FormItem key="Abbreviate" {...this.formLayout} label="简写">
            {getFieldDecorator('Abbreviate', {
              initialValue: formVals.Abbreviate,
            })(<Input placeholder="请输入简写！" />)}
          </FormItem>
          <FormItem key="BrandLevel" {...this.formLayout} label="级别">
            {getFieldDecorator('BrandLevel', {
              initialValue: formVals.BrandLevel,
            })(
              <Select placeholder="请选择品牌级别" style={{ width: '100%' }}>
                {brandLevel.map(option => (
                  <Option key={option.Key} value={option.Key}>
                    {option.Value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem key="Content" {...this.formLayout} label="品牌介绍">
            {getFieldDecorator('Content', {
              initialValue: formVals.Content,
            })(<TextArea rows={4} placeholder="请输入介绍" />)}
          </FormItem>
          <FormItem key="Picture" {...this.formLayout} label="品牌主图">
            {getFieldDecorator('Picture', {
              initialValue: formVals.Picture,
            })(
              <Upload
                onChange={this.changePicture}
                type="MDM"
                Folder="TI_Z005"
                initialValue={formVals.Picture}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
/* eslint react/no-multi-comp:0 */
@connect(({ brands, loading, global }) => ({
  brands,
  global,
  loading: loading.models.rule,
}))
@Form.create()
class BrandList extends PureComponent {
  state = {
    modalVisible: false,
    method: 'A',
    formValues: {},
  };

  columns = [
    {
      title: '品牌ID',
      width: 80,
      dataIndex: 'Code',
      render: val => (
        <a
          target="_blank"
          href={`/main/product/TI_Z005/detail?Code=${val}`}
          rel="noopener noreferrer"
        >
          {val}
        </a>
      ),
    },
    {
      title: '品牌名称',
      dataIndex: 'Name',
      render: text => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>,
      width: 250,
    },
    {
      title: '品牌介绍',
      dataIndex: 'Content',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
      width: 350,
    },
    {
      title: '主图',
      dataIndex: 'Picture',
      width: 100,
      render: val => (val ? <img style={{ width: 50, height: 50 }} src={val} alt="主图" /> : ''),
    },
    {
      title: '采购员',
      width: 120,
      dataIndex: 'Purchaser',
      render: text => {
        const {
          global: { Purchaser },
        } = this.props;
        return <span>{getName(Purchaser, text)}</span>;
      },
    },
    {
      title: '品牌级别',
      width: 100,
      dataIndex: 'BrandLevel',
      render: text => <span>{getName(brandLevel, text)}</span>,
    },
    {
      title: '简写',
      width: 150,
      dataIndex: 'Abbreviate',
    },
    {
      title: '默认供应商',
      dataIndex: 'CardName',
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
          <Divider type="vertical" />
          <a
            href={`/main/product/TI_Z009/TI_Z00902?BrandName=${record.Name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            物料
          </a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      brands: { queryData },
    } = this.props;
    dispatch({
      type: 'brands/fetch',
      payload: {
        ...queryData,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      brands: { queryData },
    } = this.props;
    dispatch({
      type: 'brands/fetch',
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
        type: 'brands/fetch',
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
      formValues: record,
    });
  };

  handleSubmit = fieldsValue => {
    const {
      dispatch,
      brands: { queryData },
    } = this.props;
    const { method } = this.state;
    this.setState({
      formValues: {
        ...fieldsValue,
      },
    });
    let supplier;
    if (fieldsValue.supplier) {
      supplier = {
        CardCode: fieldsValue.supplier.key,
        CardName: fieldsValue.supplier.label,
      };
    }
    let purchaser;
    if (fieldsValue.purchaser) {
      purchaser = {
        Purchaser: fieldsValue.purchaser.key,
        PurchaserName: fieldsValue.purchaser.label,
      };
    }
    delete fieldsValue.purchaser;
    delete fieldsValue.supplier;
    if (method === 'A') {
      dispatch({
        type: 'brands/add',
        payload: {
          Content: {
            ...fieldsValue,
            ...supplier,
            ...purchaser,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            this.handleModalVisible(false);
            message.success('添加成功');
            dispatch({
              type: 'brands/fetch',
              payload: {
                ...queryData,
              },
            });
          }
        },
      });
    } else {
      dispatch({
        type: 'brands/update',
        payload: {
          Content: {
            ...fieldsValue,
            ...supplier,
            ...purchaser,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            this.handleModalVisible(false);
            message.success('更新成功');
            dispatch({
              type: 'brands/fetch',
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
      formValues: {},
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
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
      brands: { brandsList, pagination },
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
              data={{ list: brandsList }}
              rowKey="Code"
              scroll={{ x: 1300, y: 600 }}
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

export default BrandList;
