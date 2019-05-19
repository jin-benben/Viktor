import React, { Fragment } from 'react';
import { Card, Icon, Button, message, Select } from 'antd';
import EditableFormTable from '@/components/EditableFormTable';
import request from '@/utils/request';
import Staffs from '@/components/Staffs';
import Brand from '@/components/Brand';
import HSCode from '@/components/HSCode';
import FHSCode from '@/components/FHSCode';
import SPUCode from '@/components/SPUCode';
import Category from '@/components/Category';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';

const { Option } = Select;

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
      title: '品牌',
      width: 150,
      dataIndex: 'BrandName',
      render: (text, record, index) => (
        <Brand
          defaultValue={{ BrandName: record.BrandName }}
          onChange={({ label }) => {
            this.codeChange(label, record, index, 'BrandName');
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
      dataIndex: 'PurchaserName',
      render: (text, record, index) => (
        <Staffs
          onChange={staffs => {
            this.codeChange(staffs, record, index, 'PurchaserName');
          }}
        />
      ),
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
      selectList: [
        {
          lable: '是',
          value: '1',
        },
        {
          lable: '否',
          value: '2',
        },
      ],
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

  deleteLine = (record, index) => {
    const { TI_Z00901 } = this.state;
    TI_Z00901.splice(index, 1);
    this.setState({ TI_Z00901 });
  };

  categoryChange = (selectedOptions, record, index) => {
    const category = {
      Cate1Name: selectedOptions[0].Name,
      Cate2Name: selectedOptions[1].Name,
      Cate3Name: selectedOptions[2].Name,
      Category1: selectedOptions[1].Code,
      Category2: selectedOptions[2].Code,
      Category3: selectedOptions[3].Code,
    };
    const { TI_Z00901 } = this.state;
    TI_Z00901[index] = { ...record, ...category };
    this.setState({ TI_Z00901 });
  };

  codeChange = (value, row, index, key) => {
    // eslint-disable-next-line no-param-reassign
    row[key] = value;
    const { TI_Z00901 } = this.state;
    TI_Z00901[index] = row;
    this.setState({ TI_Z00901 });
  };

  rowChange = record => {
    const { TI_Z00901 } = this.state;
    TI_Z00901.map(item => {
      if (item.key === record.key) {
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
          scroll={{ x: 2100 }}
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
