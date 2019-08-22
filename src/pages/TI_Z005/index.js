/* eslint-disable no-param-reassign */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Modal,
  Button,
  message,
  Divider,
  Select,
  Icon,
  AutoComplete,
} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import Supplier from '@/components/Supplier';
import Upload from '@/components/Upload';
import MDMCommonality from '@/components/Select';
import MyIcon from '@/components/MyIcon';
import OrderAttachUpload from '@/components/Modal/OrderAttachUpload';
import Text from '@/components/Text';
import MyPageHeader from './components/pageHeader';
import { getName } from '@/utils/utils';
import { brandLevel, formLayout, formItemLayout } from '@/utils/publicData';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ brands, global, loading }) => ({
  global,
  brands,
  addloading: loading.effects['brands/add'],
  updateloading: loading.effects['brands/update'],
}))
@Form.create()
class CreateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        Code: '',
        CardCode: '',
        CardName: '',
      },
      dataSource: [],
    };
  }

  componentDidMount() {
    const {
      dispatch,
      global: { SupplierList },
    } = this.props;
    if (!SupplierList.length) {
      dispatch({
        type: 'global/getSupplier',
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

  checkExist = value => {
    const { dispatch } = this.props;
    if (value) {
      dispatch({
        type: 'brands/exist',
        payload: {
          Content: {
            SearchText: value,
            SearchKey: 'Name',
            ShowAll: 'Y',
          },
          page: 1,
          rows: 30,
          sidx: 'Code',
          sord: 'Desc',
        },
        callback: response => {
          if (response && response.Status === 200) {
            if (response.Content) {
              this.setState({
                dataSource: response.Content.rows,
              });
            }
          }
        },
      });
    }
  };

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
      addloading,
      updateloading,
    } = this.props;
    const { formVals, dataSource } = this.state;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        delete fieldsValue.Picture;
        handleSubmit({ ...formVals, ...fieldsValue });
      });
    };

    return (
      <Modal
        width={640}
        confirmLoading={addloading || updateloading}
        destroyOnClose
        title="品牌编辑"
        maskClosable={false}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <FormItem key="Name" {...formLayout} label="名称">
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: '请输入名称！' }],
              initialValue: formVals.Name,
            })(
              <AutoComplete
                style={{ width: '100%' }}
                onSearch={this.checkExist}
                placeholder="请输入名称！"
              >
                {dataSource.map(item => (
                  <AutoComplete.Option value={item.Name} key={item.Code}>
                    {item.Name}
                  </AutoComplete.Option>
                ))}
              </AutoComplete>
            )}
          </FormItem>
          <FormItem key="Purchaser" {...formLayout} label="采购员">
            {getFieldDecorator('Purchaser', {
              rules: [{ required: true, message: '请选择采购员！' }],
              initialValue: formVals.Purchaser,
            })(<MDMCommonality initialValue={formVals.Purchaser} data={Purchaser} />)}
          </FormItem>
          <FormItem
            key="supplier"
            {...formLayout}
            label="默认供应商"
            style={{ position: 'relative' }}
          >
            {getFieldDecorator('supplier', {
              initialValue: { key: formVals.CardCode, label: formVals.CardName },
            })(
              <Supplier
                initialValue={{ key: formVals.CardCode, label: formVals.CardName }}
                labelInValue
              />
            )}
          </FormItem>

          <FormItem key="WebSite" {...formLayout} label="官网">
            {getFieldDecorator('WebSite', {
              initialValue: formVals.WebSite,
            })(<Input placeholder="请输入官网！" />)}
          </FormItem>
          <FormItem key="Abbreviate" {...formLayout} label="简写">
            {getFieldDecorator('Abbreviate', {
              initialValue: formVals.Abbreviate,
            })(<Input placeholder="请输入简写！" />)}
          </FormItem>
          <FormItem key="BrandLevel" {...formLayout} label="级别">
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
          <FormItem key="Content" {...formLayout} label="品牌介绍">
            {getFieldDecorator('Content', {
              rules: [{ required: true, message: '请输入名称！' }],
              initialValue: formVals.Content,
            })(<TextArea rows={4} placeholder="请输入介绍" />)}
          </FormItem>
          <FormItem key="Picture" {...formLayout} label="品牌主图">
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
  loading: loading.models.brands,
}))
@Form.create()
class BrandList extends PureComponent {
  state = {
    modalVisible: false,
    uploadmodalVisible: false,
    BaseEntry: '',
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
      width: 300,
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
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
      width: 100,
      dataIndex: 'Abbreviate',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '官网',
      width: 200,
      dataIndex: 'WebSite',
      render: text => <Text text={text} />,
    },
    {
      title: '默认供应商',
      dataIndex: 'CardName',
      render: text => <Text text={text} />,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
            {' '}
            <MyIcon type="iconedit" />
          </a>
          <Divider type="vertical" />
          <a
            href={`/main/product/TI_Z009/TI_Z00902?BrandName=${record.Name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            物料
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.uploadLine(record)} title="附件上传">
            {' '}
            <Icon type="cloud-upload" />
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
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Purchaser'],
        },
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

  uploadLine = record => {
    this.setState({
      uploadmodalVisible: true,
      BaseEntry: record.Code,
    });
  };

  handleSubmitAttach = fileList => {
    const { dispatch } = this.props;
    const { BaseEntry } = this.state;
    fileList.map(file => {
      const { AttachmentPath, AttachmentCode, AttachmentName, AttachmentExtension } = file;
      dispatch({
        type: 'brands/attach',
        payload: {
          Content: {
            BaseEntry,
            BaseType: 'TI_Z005',
            AttachmentPath,
            AttachmentCode,
            AttachmentName,
            AttachmentExtension,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('保存成功');
            this.setState({
              uploadmodalVisible: false,
            });
          }
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
    this.setState({
      formValues: {
        ...fieldsValue,
        ...supplier,
        ...purchaser,
      },
    });
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

  addBrand = () => {
    this.setState({
      modalVisible: true,
      method: 'A',
      formValues: {},
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      uploadmodalVisible: !!flag,
      method: 'A',
      formValues: {},
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      global: { Purchaser },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="Purchaser" {...formLayout} label="采购员">
              {getFieldDecorator('Purchaser')(
                <Select
                  showArrow={false}
                  mode="multiple"
                  placeholder="输入名称"
                  filterOption={false}
                  style={{ width: '100%' }}
                >
                  {Purchaser.map(option => (
                    <Option key={option.Key} value={option.Key}>
                      {option.Value}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button icon="plus" style={{ marginLeft: 8 }} type="primary" onClick={this.addBrand}>
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
      location,
    } = this.props;
    const { modalVisible, formValues, uploadmodalVisible } = this.state;
    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };
    const uploadmodalMethods = {
      handleSubmit: this.handleSubmitAttach,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <MyPageHeader {...location} />
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: brandsList }}
              rowKey="Code"
              scroll={{ x: 1500 }}
              pagination={pagination}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} formVals={formValues} modalVisible={modalVisible} />
        <OrderAttachUpload {...uploadmodalMethods} modalVisible={uploadmodalVisible} />
      </Fragment>
    );
  }
}

export default BrandList;
