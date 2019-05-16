import React, { PureComponent, Fragment } from 'react';

import { Card, Icon, Button } from 'antd';

import EditableFormTable from '@/components/EditableFormTable';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';

class AddSKU extends PureComponent {
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
      width: 100,
      dataIndex: 'BrandName',
      inputType: 'text',
      editable: true,
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
      width: 100,
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
      width: 100,
      dataIndex: 'Purchaser',
      editable: true,
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
      width: 100,
      dataIndex: 'category',
      editable: true,
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
      width: 100,
      inputType: 'text',
      dataIndex: 'InvoiceMenu',
      editable: true,
    },
    {
      title: '上架状态',
      width: 100,
      dataIndex: 'Putaway',
    },
    {
      title: '上架日期',
      width: 100,
      dataIndex: 'PutawayDateTime',
    },
    {
      title: 'HS编码',
      width: 100,
      inputType: 'text',
      dataIndex: 'HSCode',
      editable: true,
    },
    {
      title: 'SPU编码',
      width: 100,
      inputType: 'text',
      dataIndex: 'SPUCode',
      editable: true,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 80,
      render: (text, record) => (
        <Fragment>
          <Icon
            title="删除行"
            className="icons"
            type="delete"
            theme="twoTone"
            onClick={() => this.deleteLine(record)}
          />
        </Fragment>
      ),
    },
  ];

  addskulist = async () => {
    console.log('ok');
  };

  render() {
    const { TI_Z00901 } = this.state;
    return (
      <Card title="物料添加">
        <Button icon="plus" style={{ marginBottom: 20 }} type="primary">
          添加行
        </Button>
        <EditableFormTable
          rowChange={this.rowChange}
          rowKey="LineID"
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
