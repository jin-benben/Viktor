/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import React, { Component, Fragment } from 'react';
import { Card, Icon, Button, message, Select } from 'antd';
import { connect } from 'dva';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import EditableFormTable from '@/components/EditableFormTable';
import MDMCommonality from '@/components/Select';
import Brand from '@/components/Brand';
import HSCode from '@/components/HSCode';
import FHSCode from '@/components/FHSCode';
import SPUCode from '@/components/SPUCode';
import AskPriceFetch from '@/pages/TI_Z030/components/askPriceFetch';

const { Option } = Select;

@connect(({ global, loading, skuAdd }) => ({
  global,
  skuAdd,
  loading: loading.models.global,
  addloading: loading.effects['skuAdd/add'],
  matchloading: loading.effects['skuAdd/match'],
  confirmloading: loading.effects['skuAdd/confrim'],
}))
class AddSKU extends Component {
  state = {
    TI_Z00901: [],
    selectedRows: [],
    orderModalVisible: false,
  };

  skuColumns = [
    {
      title: '行号',
      dataIndex: 'LineID',
      fixed: 'left',
      width: 50,
    },
    {
      title: '代码',
      dataIndex: 'Code',
      fixed: 'left',
      width: 80,
    },
    {
      title: '描述',
      width: 100,
      dataIndex: 'Name',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    },

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
      title: '销售价格',
      width: 80,
      inputType: 'text',
      dataIndex: 'SPrice',
      editable: true,
    },
    {
      title: '采购价格',
      width: 80,
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
              this.codeChange(hsCode, record, index, 'HSCode');
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

  componentDidMount() {
    const {
      dispatch,
      global: { BrandList, CategoryTree, Purchaser, WhsCode },
    } = this.props;
    if (!Purchaser.length || WhsCode.length) {
      dispatch({
        type: 'global/getMDMCommonality',
        payload: {
          Content: {
            CodeList: ['Purchaser', 'TI_Z042', 'WhsCode'],
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
      type: 'skuAdd/fetch',
    });
  }

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
    row.Name = `${row.BrandName}  ${row.ProductName}  ${row.ManufactureNO}  ${row.Parameters}  ${
      row.Package
    }`;
    const { TI_Z00901 } = this.state;
    TI_Z00901[index] = row;
    this.setState({ TI_Z00901 });
  };

  rowChange = record => {
    const { TI_Z00901 } = this.state;
    TI_Z00901.map(item => {
      if (item.LineID === record.LineID) {
        record.Name = `${record.BrandName}  ${record.ProductName}  ${record.ManufactureNO}  ${
          record.Parameters
        }  ${record.Package}`;
        return record;
      }
      return item;
    });
    this.setState({ TI_Z00901 });
  };

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
          message.success('添加成功');
          this.setState({ TI_Z00901: [] });
        }
      },
    });
  };

  addLine = () => {
    const { TI_Z00901 } = this.state;
    const lastLine = TI_Z00901[TI_Z00901.length - 1]
      ? TI_Z00901[TI_Z00901.length - 1].LineID + 1
      : 1;
    const {
      global: { currentUser },
    } = this.props;
    const line = {
      LineID: lastLine,
      Name: '',
      BrandName: '',
      ProductName: '',
      ManufactureNO: '',
      Parameters: '',
      PurchaserName: '',
      ForeignParameters: '',
      Rweight: '',
      Package: '',
      Purchaser: currentUser.Owner,
      Unit: '',
      ManLocation: '',
      Category1: '',
      Category2: '',
      Category3: '',
      Cate1Name: '',
      Cate2Name: '',
      Cate3Name: '',
      Putaway: '1',
      PutawayDateTime: new Date(),
      InvoiceName: '',
      InvoicePro: '',
      InvoiceMenu: '',
      HSCode: '',
      FHSCode: '',
      SPUCode: '',
      SPrice: 0,
      PPrice: 0,
    };

    TI_Z00901.push(line);
    this.setState({ TI_Z00901 });
  };

  handleModalVisible = flag => {
    this.setState({ orderModalVisible: !!flag });
  };

  // 添加行
  addLineSKU = selectedRows => {
    const { TI_Z00901 } = this.state;
    const lastLine = TI_Z00901[TI_Z00901.length - 1]
      ? TI_Z00901[TI_Z00901.length - 1].LineID + 1
      : 1;
    const {
      global: { currentUser },
    } = this.props;
    selectedRows.map((item, index) => {
      const {
        BrandName,
        SKUName,
        ProductName,
        ManufactureNO,
        Purchaser,
        Parameters,
        Package,
        Unit,
        DocEntry,
        LineID,
        ManLocation,
        ForeignParameters,
      } = item;
      TI_Z00901.push({
        LineID: lastLine + index,
        BrandName,
        ProductName,
        ManufactureNO,
        Parameters,
        Package,
        Unit,
        ForeignParameters,
        Name: SKUName,
        HSCode: item.HSCode || '',
        Purchaser: Purchaser || currentUser.Owner,
        ManLocation,
        Rweight: '',
        Category1: '',
        Category2: '',
        Category3: '',
        Cate1Name: '',
        Cate2Name: '',
        Cate3Name: '',
        Putaway: '1',
        EnglishName: '',
        PutawayDateTime: new Date(),
        InvoiceName: '',
        InvoicePro: '',
        InvoiceMenu: '',
        FHSCode: '',
        SPUCode: '',
        QutoNo: DocEntry,
        QutoLine: LineID,
      });
    });
    this.setState({ TI_Z00901: [...TI_Z00901], orderModalVisible: false });
  };

  // 根据报价单行名字匹配已有SKU
  matchingLine = () => {
    const { TI_Z00901 } = this.state;
    const { dispatch } = this.props;
    if (!TI_Z00901.length) return;
    const NameList = TI_Z00901.map(item => item.Name);
    dispatch({
      type: 'skuAdd/match',
      payload: {
        Content: {
          NameList,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('匹配成功');
          if (response.Content) {
            response.Content.SKUList.map((item, index) => {
              TI_Z00901[index].Code = item.Code;
            });
            this.setState({ TI_Z00901: [...TI_Z00901] });
          }
        }
      },
    });
  };

  // 确认匹配结果选择
  onSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows: [...selectedRows] });
  };

  // 确认匹配结果
  confirmMatch = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    if (!selectedRows.length) return;
    const MatchList = selectedRows.map(item => {
      const { LineID, Code, QutoNo, QutoLine } = item;
      return {
        LineID,
        Code,
        QutoNo,
        QutoLine,
      };
    });
    dispatch({
      type: 'skuAdd/confrim',
      payload: {
        Content: {
          MatchList,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          const { TI_Z00901 } = this.state;
          if (response.Content) {
            response.Content.MatchList.map(item => {
              if (item.Status === '1') {
                const thisIndex = TI_Z00901.findIndex(value => value.LineID === item.LineID);
                TI_Z00901.splice(thisIndex, 1);
              } else {
                message.success(item.Message);
              }
            });
          }
          this.setState({ TI_Z00901: [...TI_Z00901] });
        }
      },
    });
  };

  render() {
    const { TI_Z00901, orderModalVisible } = this.state;
    const { addloading, matchloading, confirmloading } = this.props;
    const orderParentMethods = {
      handleSubmit: this.addLineSKU,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Card bordered={false}>
        <EditableFormTable
          rowChange={this.rowChange}
          rowKey="LineID"
          scroll={{ x: 2800 }}
          rowSelection={{
            onChange: this.onSelectRow,
          }}
          columns={this.skuColumns}
          data={TI_Z00901}
        />
        <FooterToolbar>
          <Button icon="plus" onClick={this.addLine} style={{ marginBottom: 20 }} type="primary">
            添加行
          </Button>
          <Button
            icon="plus"
            style={{ marginLeft: 8 }}
            type="primary"
            onClick={() => this.handleModalVisible(true)}
          >
            复制从销售报价单
          </Button>
          <Button loading={matchloading} onClick={this.matchingLine} type="primary">
            匹配
          </Button>
          <Button loading={confirmloading} onClick={this.confirmMatch} type="primary">
            确认匹配
          </Button>
          <Button loading={addloading} onClick={this.addskulist} type="primary">
            保存
          </Button>
        </FooterToolbar>
        <AskPriceFetch {...orderParentMethods} QueryType="3" modalVisible={orderModalVisible} />
      </Card>
    );
  }
}
export default AddSKU;
