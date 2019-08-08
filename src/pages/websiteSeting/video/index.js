import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button,message,Tag } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import MyIcon from '@/components/MyIcon';
import DataUpload from '../components'
import MDMCommonality from '@/components/Select';
import Text from '@/components/Text';
import { formLayout } from '@/utils/publicData';
import {getName} from '@/utils/utils'

const FormItem = Form.Item;


@connect(({ videoData, loading, global }) => ({
  videoData,
  global,
  loading: loading.models.videoData,
}))
@Form.create()
class VideoDataPage extends PureComponent {
  columns = [
    {
      title: '附件代码',
      dataIndex: 'Code',
      width: 200,
      render: text => <Text text={text} />,
    },
    {
      title: '分类',
      dataIndex: 'Type',
      width: 100,
      render: text => {
        const {
          global: { TI_Z01802 },
        } = this.props;
        return <span>{getName(TI_Z01802, text)}</span>;
      },
    },
    {
      title: '附件描述',
      dataIndex: 'AttachmentName',
      width: 200,
      render: text => <Text text={text} />,
    },
    {
      title: '附件路径',
      dataIndex: 'AttachmentPath',
      width:100,
      render: text => <a href={text} target="_blank" rel="noopener noreferrer">视频地址</a>,
    },
    {
      title: '扩展名',
      dataIndex: 'AttachmentExtension',
      width:80,
    },
    {
      title: '图片',
      dataIndex: 'CoverPicture',
      width:100,
      render: text => <img style={{width:80}} src={text} alt="图片" />
    },
    {
      title: '是否显示',
      width: 80,
      dataIndex: 'IsShow',
      render: text =>
        text === 'Y' ? <Tag color="green">显示</Tag> : <Tag color="gold">不显示</Tag>,
    },
    {
      title: '创建日期',
      width: 100,
      dataIndex: 'CreateDate',
      render: val => (
        <Ellipsis tooltip lines={1}>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '操作',
      width: 50,
      align: 'center',
      render: (text, record) => (
        <a onClick={()=>this.uploadDate(record)}>
          <MyIcon type="iconedit" />
        </a>
      ),
    },
  ];

  state={
    modalVisible:false,
    dataItem:{}
  }

  componentDidMount() {
    const {dispatch,videoData: { queryData },} = this.props;
    dispatch({
      type: 'videoData/fetch',
      payload: {
        ...queryData,
      },
    });
    dispatch({
      type: 'global/getMDMCommonality',
      payload: {
        Content: {
          CodeList: ['TI_Z01802'],
          Key:"6",
        },
      },
    });
  }

  uploadDate=record=>{
    this.setState({
      dataItem:record,
      modalVisible:true
    })
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      videoData: { queryData },
    } = this.props;
    dispatch({
      type: 'videoData/fetch',
      payload: {
        ...queryData,
        page: pagination.current,
        rows: pagination.pageSize,
      },
    });
  };

  handleSearch = e => {
    // 搜索
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'videoData/fetch',
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

  handleModalVisible=flag=>{
    this.setState({
      modalVisible:!!flag,
      dataItem:{},
    })
  }

  handleSubmit=fieldsValue=>{
    const {dispatch, videoData: { queryData },}=this.props
    dispatch({
      type:"videoData/add",
      payload:{
        Content:{
          ...fieldsValue
        }
      },
      callback:response=>{
        if(response&&response.Status===200){
          message.success('添加成功')
          this.handleModalVisible(false)
          dispatch({
            type: 'videoData/fetch',
            payload: {
              ...queryData,
            },
          });
        }
      }
    })
    
  }

  renderSimpleForm() {
    const {form: { getFieldDecorator }, global: { TI_Z01802 },} = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem key="SearchText" {...formLayout}>
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem key="Type" {...formLayout} label="分类">
              {getFieldDecorator('Type')(<MDMCommonality data={TI_Z01802} />)}
            </FormItem>
          </Col>
          <Col md={2} sm={24}>
            <FormItem key="searchBtn">
              <span className="submitButtons">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{marginLeft:8}} type="primary" onClick={()=>this.handleModalVisible(true)}>
                  新建
                </Button>
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      videoData: { videoDataList, pagination },
      loading,
    } = this.props;
    const {modalVisible,dataItem}=this.state
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={{ list: videoDataList }}
              pagination={pagination}
              rowKey="Code"
              scroll={{ x: 1000 }}
              columns={this.columns}
              onRow={this.handleOnRow}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <DataUpload dataItem={dataItem} Folder="TI_Z056" handleSubmit={this.handleSubmit} modalVisible={modalVisible} handleModalVisible={this.handleModalVisible} />
        </Card>
       
      </Fragment>
    );
  }
}

export default VideoDataPage;
