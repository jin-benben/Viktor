/* eslint-disable no-script-url */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {  Card, Button, message, Popconfirm, Icon } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import BrandModal from '@/components/Modal/Brand';
import DragSortingTable from '@/components/DragSortingTable'



@connect(({ choicenessBrand, loading }) => ({
  choicenessBrand,
  loading:loading.effects['choicenessBrand/fetch'],
  addloading: loading.effects['choicenessBrand/add']
}))

class ChoicenessBrandSet extends PureComponent {
  state = {
    modalVisible: false,
    choicenessBrandList:[],
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
      title: '品牌代码',
      width: 100,
      align:"center",
      dataIndex: 'Code',
    },
    {
      title: '品牌名称',
      width: 200,
      align:"center",
      dataIndex: 'Name',
    },
    {
      title: '创建时间',
      width: 200,
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
     this.getChoicenessBrand()
  }

  getChoicenessBrand=()=>{
    const { queryData } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'choicenessBrand/fetch',
      payload: {
        ...queryData,
      },
      callback:response=>{
        if (response && response.Status === 200) {
          if (!response.Content) {
           this.setState({
             choicenessBrandList: []
           })
          } else {
            const { rows } = response.Content;
            this.setState({
              choicenessBrandList: rows
            })
          }
        }
      }
    });
  }

  // 删除
  handleDelete = index => {
    const { choicenessBrandList } = this.state;
    choicenessBrandList.splice(index,1)
    this.setState({
      choicenessBrandList:[...choicenessBrandList]
    })
  };

  handleStandardTableChange = paginations => {
    const {queryData,pagination}=this.state
    const {current,pageSize}=paginations
    Object.assign(pagination,{current,pageSize})
    Object.assign(queryData,{page:current,rows:pageSize})
    this.setState({
      queryData,pagination
    },()=>this.getChoicenessBrand())
  };


  addBrandFetch = selectedRows => {
    // 保存品牌
    const { choicenessBrandList } = this.state;
    const last = choicenessBrandList[choicenessBrandList.length - 1];
    const newsbrandList = selectedRows.map((item,index) => {
      const { Code, Name } = item;
      return {
        Code,
        Name,
        OrderId: last ? last.OrderId + index : 1+index,
      };
    });
    this.setState({
      choicenessBrandList:[...choicenessBrandList,...newsbrandList],
      modalVisible:false
    })
   
  };

  addWebBrand=()=>{
    const { dispatch } = this.props;
    const { choicenessBrandList } = this.state;
    const newList=choicenessBrandList.map((item,index)=>{
      const newItem=item
      newItem.OrderId=index+1
      return newItem
    })
    dispatch({
      type: 'choicenessBrand/add',
      payload: {
        Content: {
          TI_Z02101List:newList
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
      choicenessBrandList:[...dataSource]
    })
  }

  render() {
    const {loading,addLoading} = this.props;
    const { modalVisible,choicenessBrandList,pagination } = this.state;
    const brandParentMethods = {
      handleSubmit: this.addBrandFetch,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Card bordered={false}>
        <div className="tableList">
          <DragSortingTable
            loading={loading}
            dataSource={choicenessBrandList}
            rowKey="Code"
            columns={this.columns}
            pagination={pagination}
            sortChange={this.sortChange}
            onChange={this.handleStandardTableChange}
          />
        </div>
        
        <BrandModal {...brandParentMethods} modalVisible={modalVisible} />
        <FooterToolbar>
          <Button onClick={()=>this.handleModalVisible(true)} type="primary">添加</Button>
          <Button loading={addLoading} onClick={this.addWebBrand} type="primary">保存</Button>
        </FooterToolbar>
      </Card>
      
    
    );
  }
}

export default ChoicenessBrandSet;
