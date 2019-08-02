/* eslint-disable no-script-url */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {  Card, Button, message, Popconfirm, Icon } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import SKUModal from '@/components/Modal/SKU';
import DragSortingTable from '@/components/DragSortingTable'



@connect(({ choicenessGoods, loading }) => ({
  choicenessGoods,
  loading:loading.effects['choicenessGoods/fetch'],
  addloading: loading.effects['choicenessGoods/add']
}))

class ChoicenessGoodsSet extends PureComponent {
  state = {
    modalVisible: false,
    choicenessGoodsList:[],
    queryData: {
      Content: {
        SearchText: '',
        SearchKey: 'Name',
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

  columns = [
    {
      title: '序号',
      width: 50,
      align:"center",
      dataIndex: 'OrderId',
    },
    {
      title: '物料代码',
      width: 50,
      align:"center",
      dataIndex: 'Code',
    },
    {
      title: '物料名称',
      width: 200,
      align:"center",
      dataIndex: 'Name',
    },
    {
      title: '创建时间',
      width: 100,
      align:"center",
      dataIndex: 'CreateDate',
    },
    {
      title: '操作',
      width: 50,
      align:"center",
      render: (text, record,index) => (
        <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(index)}>
          <a href="javascript:;">
            <Icon type="delete" theme="twoTone" />
          </a>
        </Popconfirm>
      ),
    },
  ];

  componentDidMount() {
     this.getChoicenessGoods()
  }

  getChoicenessGoods=()=>{
    const { queryData } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'choicenessGoods/fetch',
      payload: {
        ...queryData,
      },
      callback:response=>{
        if (response && response.Status === 200) {
          if (!response.Content) {
           this.setState({
             choicenessGoodsList: []
           })
          } else {
            const { rows } = response.Content;
            this.setState({
              choicenessGoodsList: rows
            })
          }
        }
      }
    });
  }

  // 删除
  handleDelete = index => {
    const { choicenessGoodsList } = this.state;
    choicenessGoodsList.splice(index,1)
    this.setState({
      choicenessGoodsList:[...choicenessGoodsList]
    })
  };

  handleStandardTableChange = paginations => {
    const {queryData,pagination}=this.state
    const {current,pageSize}=paginations
    Object.assign(pagination,{current,pageSize})
    Object.assign(queryData,{page:current,rows:pageSize})
    this.setState({
      queryData,pagination
    },()=>this.getChoicenessGoods())
  };


  selectChoicenessGoods = selectedRows => {
    // 保存品牌
    const { choicenessGoodsList } = this.state;
    const last = choicenessGoodsList[choicenessGoodsList.length - 1];
    const newsbrandList = selectedRows.map((item,index) => {
      const { Code, Name } = item;
      return {
        Code,
        Name,
        OrderId: last ? last.OrderId + index : 1+index,
      };
    });
    this.setState({
      choicenessGoodsList:[...choicenessGoodsList,...newsbrandList],
      modalVisible:false
    })
   
  };

  addChoicenessGoods=()=>{
    const { dispatch } = this.props;
    const { choicenessGoodsList } = this.state;
    const newList=choicenessGoodsList.map((item,index)=>{
      const newItem=item
      newItem.OrderId=index+1
      return newItem
    })
    dispatch({
      type: 'choicenessGoods/add',
      payload: {
        Content: {
          TI_Z02001List:newList
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('保存成功');
        }
      },
    });
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  sortChange=({dataSource})=>{
    this.setState({
      choicenessGoodsList:[...dataSource]
    })
  }

  render() {
    const {loading,addLoading} = this.props;
    const { modalVisible,choicenessGoodsList,pagination } = this.state;
    const skuModalVisible = {
      handleSubmit: this.selectChoicenessGoods,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Card bordered={false}>
        <div className="tableList">
          <DragSortingTable
            loading={loading}
            dataSource={choicenessGoodsList}
            rowKey="Code"
            columns={this.columns}
            pagination={pagination}
            sortChange={this.sortChange}
            onChange={this.handleStandardTableChange}
            bordered
          />
        </div>
        
        <SKUModal Type="checkbox" {...skuModalVisible} modalVisible={modalVisible} />
        <FooterToolbar>
          <Button onClick={()=>this.handleModalVisible(true)} type="primary">添加</Button>
          <Button loading={addLoading} onClick={this.addChoicenessGoods} type="primary">保存</Button>
        </FooterToolbar>
      </Card>
      
    
    );
  }
}

export default ChoicenessGoodsSet;
