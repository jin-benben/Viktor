import React, { PureComponent, Fragment } from 'react';
import { Card, Tabs } from 'antd';
import { connect } from 'dva';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import PageLoading from '@/components/PageLoading';
import StandardTable from '@/components/StandardTable';
import MyTag from '@/components/Tag';
import styles from '../style.less';

const { Description } = DescriptionList;
const { TabPane } = Tabs;

@connect(({ ddMessage, loading }) => ({
  ddMessage,
  loading,
}))
class PrintDetailPage extends PureComponent {
  columns = [
    {
      title: '代码',
      dataIndex: 'Code',
    },
    {
      title: '状态',
      dataIndex: 'LineSts',
    },
    {
      title: '接收用户',
      dataIndex: 'Touser',
    },
    {
      title: '异步任务id',
      dataIndex: 'Task_id',
    },
  ];

  columns2 = [
    {
      title: '代码',
      dataIndex: 'Code',
    },
    {
      title: '状态',
      dataIndex: 'LineSts',
    },
    {
      title: '异步任务id',
      dataIndex: 'Task_id',
    },
  ];

  componentDidMount() {
    const {
      location: { query },
      dispatch,
    } = this.props;
    if (query.Code) {
      dispatch({
        type: 'ddMessage/singlefetch',
        payload: {
          Content: {
            Code: query.Code,
          },
        },
      });
    }
  }

  render() {
    const {
      ddMessage: { ddMessageDetail },
    } = this.props;
    return (
      <Card bordered={false} className={styles.message}>
        {ddMessageDetail.Code ? (
          <Fragment>
            <DescriptionList style={{ marginBottom: 24 }} title={ddMessageDetail.Title}>
              <Description term="代码">{ddMessageDetail.Code}</Description>
              <Description term="创建日期">{ddMessageDetail.CreateDate}</Description>
              <Description term="推送代码">{ddMessageDetail.NotificationCode}</Description>
              <Description term="推送名称">{ddMessageDetail.NotificationName}</Description>
              <Description term="PC地址">{ddMessageDetail.PCUrl}</Description>
              <Description term="移动端地址">{ddMessageDetail.MobileUrl}</Description>
              <Description term="消息模板">{ddMessageDetail.MsgTemplate}</Description>
              <Description term="主题">{ddMessageDetail.Title}</Description>
              <Description term="发送状态">
                <MyTag type="成功" value={ddMessageDetail.Status === '1' ? 'Y' : 'N'} />
              </Description>
            </DescriptionList>
            <Tabs defaultActiveKey="1">
              <TabPane tab="推送内容" key="1">
                <div
                  style={{ overflow: 'auto', height: 500 }}
                  id="contentDetails"
                  dangerouslySetInnerHTML={{ __html: ddMessageDetail.Content }}
                />
              </TabPane>
              <TabPane tab="发送人员" key="2">
                <StandardTable
                  data={{ list: ddMessageDetail.ES_TI_Z02302 }}
                  pagination={false}
                  rowKey="Task_id"
                  columns={this.columns}
                />
              </TabPane>
              <TabPane tab="推送记录" key="3">
                <StandardTable
                  data={{ list: ddMessageDetail.ES_TI_Z02303 }}
                  pagination={false}
                  rowKey="Task_id"
                  columns={this.columns2}
                />
              </TabPane>
            </Tabs>
          </Fragment>
        ) : (
          <PageLoading />
        )}
      </Card>
    );
  }
}
export default PrintDetailPage;
