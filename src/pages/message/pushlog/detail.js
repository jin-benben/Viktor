import React, { PureComponent, Fragment } from 'react';
import { Card, Tabs, Tag } from 'antd';
import { connect } from 'dva';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import PageLoading from '@/components/PageLoading';
import StandardTable from '@/components/StandardTable';
import styles from '../style.less';

const { Description } = DescriptionList;
const { TabPane } = Tabs;

@connect(({ pushMessage, loading }) => ({
  pushMessage,
  loading,
}))
class PushDetailPage extends PureComponent {
  columns = [
    {
      title: '行号',
      width: 80,
      dataIndex: 'LineID',
    },
    {
      title: '状态',
      width: 80,
      dataIndex: 'LineSts',
    },
    {
      title: '推送标题',
      width: 200,
      dataIndex: 'Title',
    },
    {
      title: '推送内容',
      dataIndex: 'Content',
      render: text => <div style={{ width: '100%', height: 300, overflowY: 'auto' }}>{text}</div>,
    },
    {
      title: '异常信息',
      width: 200,
      dataIndex: 'ErrorString',
    },
    {
      title: '消息模板',
      width: 200,
      dataIndex: 'MsgTemplate',
    },
  ];

  componentDidMount() {
    const {
      location: { query },
      dispatch,
    } = this.props;
    if (query.Code) {
      dispatch({
        type: 'pushMessage/singlefetch',
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
      pushMessage: { pushMessageDetail },
    } = this.props;
    return (
      <Card bordered={false} className={styles.message}>
        {pushMessageDetail.Code ? (
          <Fragment>
            <DescriptionList style={{ marginBottom: 24 }} title="推送日志">
              <Description term="代码">{pushMessageDetail.Code}</Description>
              <Description term="创建日期">{pushMessageDetail.CreateDate}</Description>
              <Description term="推送代码">{pushMessageDetail.NotificationCode}</Description>
              <Description term="推送名称">{pushMessageDetail.NotificationName}</Description>
              <Description term="推送渠道">{pushMessageDetail.NotificationChannel}</Description>
              <Description term="异常信息 ">{pushMessageDetail.ErrorString}</Description>
              <Description term="发送状态">
                <span>
                  {pushMessageDetail.Status === '2' ? (
                    <Tag color="blue">成功</Tag>
                  ) : (
                    <Tag color="red">失败</Tag>
                  )}
                </span>
              </Description>
            </DescriptionList>
            <Tabs defaultActiveKey="1">
              <TabPane tab="返回内容" key="1">
                <div
                  style={{ overflow: 'auto', height: 500 }}
                  id="contentDetails"
                  dangerouslySetInnerHTML={{ __html: pushMessageDetail.OutJSon }}
                />
              </TabPane>
              <TabPane tab="来源内容" key="2">
                <div
                  style={{ overflow: 'auto', height: 500 }}
                  id="contentDetails"
                  dangerouslySetInnerHTML={{ __html: pushMessageDetail.InJson }}
                />
              </TabPane>
              <TabPane tab="推送日志" key="3">
                <StandardTable
                  data={{ list: pushMessageDetail.ES_TI_Z02202 }}
                  pagination={false}
                  rowKey="LineID"
                  columns={this.columns}
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
export default PushDetailPage;
