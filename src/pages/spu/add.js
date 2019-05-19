import React, { Fragment } from 'react';
import { Card, Icon, Button, message } from 'antd';
import EditableFormTable from '@/components/EditableFormTable';

import Brand from '@/components/Brand';
import Category from '@/components/Category';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import { connect } from 'dva';

@connect(({ spu, loading }) => ({
  spu,
  loading: loading.models.spu,
}))
class AddSKU extends React.Component {
  state = {
    TI_Z01101: [],
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
      width: 150,
      editable: true,
    },
    {
      title: '单位',
      width: 100,
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
      dataIndex: 'category',
      render: (text, record, index) => <Category />,
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
    console.log(record, index);
  };

  rowChange = record => {
    const { TI_Z01101 } = this.state;
    TI_Z01101.map(item => {
      if (item.key === record.key) {
        return record;
      }
      return item;
    });
    this.setState({ TI_Z01101 });
  };

  addskulist = async () => {
    const { TI_Z01101 } = this.state;
    const { dispatch } = this.props;
    if (TI_Z01101.length) {
      dispatch({
        type: 'spu/add',
        payload: {
          Content: {
            TI_Z01101,
          },
        },
        callback: response => {
          if (response.Status === 200) {
            message.success('添加成功');
            this.setState({ TI_Z01101: [] });
          }
        },
      });
    }
  };

  addLine = () => {
    const { TI_Z01101 } = this.state;
    const lastLine = TI_Z01101[TI_Z01101.length - 1]
      ? TI_Z01101[TI_Z01101.length - 1].LineID + 1
      : 1;
    const line = {
      LineID: lastLine,
      Name: '名字',
      BrandName: '名字',
      ProductName: '名字',
      Unit: '名字',
      ManLocation: '名字',
      Category1: '名字',
      Category2: '名字',
      Category3: '名字',
      Cate1Name: '名字',
      Cate2Name: '名字',
      Cate3Name: '名字',
    };

    TI_Z01101.push(line);
    this.setState({ TI_Z01101 });
  };

  render() {
    const { TI_Z01101 } = this.state;
    const { loading } = this.props;
    return (
      <Card title="物料添加">
        <Button icon="plus" onClick={this.addLine} style={{ marginBottom: 20 }} type="primary">
          添加行
        </Button>
        <EditableFormTable
          rowChange={this.rowChange}
          rowKey="LineID"
          columns={this.skuColumns}
          data={TI_Z01101}
        />
        <FooterToolbar>
          <Button loading={loading} onClick={this.addskulist} type="primary">
            保存
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}
export default AddSKU;
