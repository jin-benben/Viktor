import React, { PureComponent, Fragment } from 'react';
import { Card, Tabs, Tag } from 'antd';
import { connect } from 'dva';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import PageLoading from '@/components/PageLoading';
import styles from '../style.less';

const { Description } = DescriptionList;
const { TabPane } = Tabs;

@connect(({ wxMessage, loading }) => ({
  wxMessage,
  loading,
}))
class WXDetailPage extends PureComponent {
  componentDidMount() {
    const {
      location: { query },
      dispatch,
    } = this.props;
    if (query.Code) {
      dispatch({
        type: 'wxMessage/singlefetch',
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
      wxMessage: { wxMessageDetail },
    } = this.props;
    return (
      <Card bordered={false} className={styles.message}>
        {wxMessageDetail.Code ? (
          <Fragment>
            <DescriptionList style={{ marginBottom: 24 }} title={wxMessageDetail.Title}>
              <Description term="代码">{wxMessageDetail.Code}</Description>
              <Description term="创建日期">{wxMessageDetail.CreateDate}</Description>
              <Description term="推送代码">{wxMessageDetail.NotificationCode}</Description>
              <Description term="推送名称">{wxMessageDetail.NotificationName}</Description>
              <Description term="地址">{wxMessageDetail.Url}</Description>
              <Description term="移动端地址">{wxMessageDetail.MobileUrl}</Description>
              <Description term="消息模板">{wxMessageDetail.Template_id}</Description>
              <Description term="微信APPID ">{wxMessageDetail.WeChatAppId}</Description>
              <Description term="用户ID">{wxMessageDetail.UserID}</Description>
              <Description term="微信OpenId">{wxMessageDetail.OpenId}</Description>
              <Description term="微信消息ID">{wxMessageDetail.Msgid}</Description>
              <Description term="发送状态">
                <span>
                  {wxMessageDetail.Status === '2' ? (
                    <Tag color="blue">成功</Tag>
                  ) : (
                    <Tag color="red">失败</Tag>
                  )}
                </span>
              </Description>
            </DescriptionList>
            <Tabs defaultActiveKey="1">
              <TabPane tab="推送内容" key="1">
                <div
                  style={{ overflow: 'auto', height: 500 }}
                  id="contentDetails"
                  dangerouslySetInnerHTML={{ __html: wxMessageDetail.Content }}
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
export default WXDetailPage;
