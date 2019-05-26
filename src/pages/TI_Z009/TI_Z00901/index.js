import React, { Fragment } from 'react';
import { Card, Icon, Button, message, Select } from 'antd';
import EditableFormTable from '@/components/EditableFormTable';
import request from '@/utils/request';
import MDMCommonality from '@/components/Select';
import Brand from '@/components/Brand';
import HSCode from '@/components/HSCode';
import FHSCode from '@/components/FHSCode';
import SPUCode from '@/components/SPUCode';
import Category from '@/components/Category';
import { connect } from 'dva';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';

const { Option } = Select;

@connect(({ global, loading }) => ({
  global,
  loading: loading.models.global,
}))
class AddSKU extends React.Component {
  state = {
    TI_Z00901: [],
  };

  skuColumns = [
    {
      title: '行号',
      dataIndex: 'LineID',
      fixed: 'left',
      width: 50,
    },
    {
      title: '描述',
      dataIndex: 'Name',
    },
    {
      title: '品牌',
      width: 150,
      dataIndex: 'BrandName',
      render: (text, record, index) => (
        <Brand
          keyType="Name"
          onChange={value => {
            this.codeChange(value, record, index, 'BrandName');
          }}
        />
      ),
    },
    {
      title: '名称',
      dataIndex: 'ProductName',
      inputType: 'text',
      width: 100,
      editable: true,
    },
    {
      title: '型号',
      width: 100,
      dataIndex: 'ManufactureNO',
      inputType: 'text',
      editable: true,
    },
    {
      title: '参数',
      width: 150,
      dataIndex: 'Parameters',
      inputType: 'text',
      editable: true,
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
      width: 150,
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
      title: '数量',
      width: 100,
      inputType: 'text',
      dataIndex: 'Quantity',
      editable: true,
    },
    {
      title: '单位',
      width: 80,
      inputType: 'text',
      dataIndex: 'Unit',
      editable: true,
    },
    {
      title: '产地',
      width: 100,
      dataIndex: 'ManLocation',
      editable: true,
    },
    {
      title: '分类',
      width: 150,
      dataIndex: 'category',
      render: (text, record, index) => (
        <Category
          onChange={selectedOptions => {
            this.categoryChange(selectedOptions, record, index);
          }}
        />
      ),
    },
    {
      title: '开票名称',
      width: 100,
      inputType: 'text',
      dataIndex: 'InvoiceName',
      editable: true,
    },
    {
      title: '开票核心规格',
      width: 150,
      inputType: 'text',
      dataIndex: 'InvoicePro',
      editable: true,
    },
    {
      title: '开票目录分类',
      width: 150,
      inputType: 'text',
      dataIndex: 'InvoiceMenu',
      editable: true,
    },
    {
      title: '上架状态',
      width: 100,
      dataIndex: 'Putaway',
      render: (text, record, index) => (
        <Select
          defaultValue={record.Putaway}
          style={{ width: 120 }}
          onChange={value => this.codeChange(value, record, index, 'Putaway')}
        >
          <Option value="1">是</Option>
          <Option value="2">否</Option>
        </Select>
      ),
    },
    {
      title: '上架日期',
      width: 180,
      inputType: 'date',
      editable: true,
      dataIndex: 'PutawayDateTime',
    },
    {
      title: 'HS编码',
      width: 150,
      inputType: 'text',
      dataIndex: 'HSCode',
      render: (text, record, index) => (
        <HSCode
          initialValue={text}
          onChange={hsCode => {
            this.codeChange(hsCode, record, index, 'HSCode');
          }}
        />
      ),
    },
    {
      title: 'FHS编码',
      width: 150,
      inputType: 'text',
      dataIndex: 'FHSCode',
      render: (text, record, index) => (
        <FHSCode
          initialValue={text}
          onChange={hsCode => {
            this.codeChange(hsCode, record, index, 'FHSCode');
          }}
        />
      ),
    },
    {
      title: 'SPU编码',
      width: 150,
      dataIndex: 'SPUCode',
      render: (text, record, index) => (
        <SPUCode
          initialValue={text}
          onChange={hsCode => {
            this.codeChange(hsCode, record, index, 'SPUCode');
          }}
        />
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
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['Purchaser', 'WhsCode'],
        },
      },
    });
  }

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
    row.Name = row.BrandName + row.ProductName + row.Parameters + row.Package;
    const { TI_Z00901 } = this.state;
    TI_Z00901[index] = row;
    this.setState({ TI_Z00901 });
  };

  rowChange = record => {
    const { TI_Z00901 } = this.state;
    TI_Z00901.map(item => {
      item.Name = item.BrandName + item.ProductName + item.Parameters + item.Package;
      if (item.key === record.key) {
        record.Name = record.BrandName + record.ProductName + record.Parameters + record.Package;
        return record;
      }
      return item;
    });
    this.setState({ TI_Z00901 });
  };

  addskulist = async () => {
    const { TI_Z00901 } = this.state;
    const response = await request('/MDM/TI_Z009/TI_Z00901', {
      method: 'POST',
      data: {
        Content: {
          TI_Z00901,
        },
      },
    });
    if (response.Status === 200) {
      message.success('添加成功');
      this.setState({ TI_Z00901: [] });
    }
  };

  addLine = () => {
    const { TI_Z00901 } = this.state;
    const lastLine = TI_Z00901[TI_Z00901.length - 1]
      ? TI_Z00901[TI_Z00901.length - 1].LineID + 1
      : 1;
    const line = {
      LineID: lastLine,
      Name: '',
      BrandName: '',
      ProductName: '',
      ManufactureNO: '',
      Parameters: '',
      PurchaserName: '',
      Package: '',
      Purchaser: '',
      Unit: '',
      ManLocation: '',
      Category1: '',
      Category2: '',
      Category3: '',
      Cate1Name: '',
      Cate2Name: '',
      Cate3Name: '',
      Putaway: '',
      PutawayDateTime: '',
      InvoiceName: '',
      InvoicePro: '',
      InvoiceMenu: '',
      HSCode: '',
      FHSCode: '',
      SPUCode: '',
    };

    TI_Z00901.push(line);
    this.setState({ TI_Z00901 });
  };

  render() {
    const { TI_Z00901 } = this.state;
    return (
      <Card title="物料添加">
        <Button icon="plus" onClick={this.addLine} style={{ marginBottom: 20 }} type="primary">
          添加行
        </Button>
        <EditableFormTable
          rowChange={this.rowChange}
          rowKey="LineID"
          scroll={{ x: 2600 }}
          columns={this.skuColumns}
          data={TI_Z00901}
        />
        <FooterToolbar>
          <Button onClick={this.addskulist} type="primary">
            保存
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}
export default AddSKU;
