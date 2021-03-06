import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Icon, Button, message } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import EditableFormTable from '@/components/EditableFormTable';
import MDMCommonality from '@/components/Select';
import Brand from '@/components/Brand';
import Category from '@/components/Category';

@connect(({ spu, loading, global }) => ({
  spu,
  global,
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
      width: 100,
    },
    {
      title: '品牌',
      width: 200,
      dataIndex: 'BrandName',
      render: (text, record, index) => (
        <Brand
          initialValue={record.BrandName}
          keyType="Name"
          onChange={value => {
            this.codeChange(value, record, index, 'BrandName');
          }}
        />
      ),
    },
    {
      title: '描述',
      dataIndex: 'Name',
    },
    {
      title: '名称',
      dataIndex: 'ProductName',
      inputType: 'text',
      editable: true,
    },
    {
      title: '单位',
      dataIndex: 'Unit',
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
      title: '分类',
      width: 300,
      dataIndex: 'category',
      render: (text, record, index) => (
        <Category
          initialValue={[record.Category1, record.Category2, record.Category3]}
          onChange={selectedOptions => {
            this.categoryChange(selectedOptions, record, index);
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
    const {
      dispatch,
      global: { BrandList, CategoryTree },
    } = this.props;
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
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['TI_Z042'],
        },
      },
    });
  }

  deleteLine = (record, index) => {
    const { TI_Z01101 } = this.state;
    TI_Z01101.splice(index, 1);
    this.setState({ TI_Z01101 });
  };

  codeChange = (value, row, index, key) => {
    // eslint-disable-next-line no-param-reassign
    row[key] = value;
    // eslint-disable-next-line no-param-reassign
    row.Name = `${row.BrandName}  ${row.ProductName} `;
    const { TI_Z01101 } = this.state;
    TI_Z01101[index] = row;
    this.setState({ TI_Z01101 });
  };

  categoryChange = (selectedOptions, record, index) => {
    const { TI_Z01101 } = this.state;
    TI_Z01101[index] = { ...record, ...selectedOptions };
    this.setState({ TI_Z01101 });
  };

  rowChange = record => {
    const { TI_Z01101 } = this.state;
    TI_Z01101.map(item => {
      if (item.key === record.key) {
        // eslint-disable-next-line no-param-reassign
        record.Name = `${record.BrandName}  ${record.ProductName} `;
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
          if (response && response.Status === 200) {
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
      Name: '',
      BrandName: '',
      ProductName: '',
      Unit: '',
      ManLocation: '',
      Category1: '',
      Category2: '',
      Category3: '',
      Cate1Name: '',
      Cate2Name: '',
      Cate3Name: '',
    };
    TI_Z01101.push(line);
    this.setState({ TI_Z01101 });
  };

  render() {
    const { TI_Z01101 } = this.state;
    const { loading } = this.props;
    return (
      <Card bordered={false}>
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
