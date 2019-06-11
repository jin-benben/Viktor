import React, { PureComponent, Fragment } from 'react';
import { Card, Button, message } from 'antd';
import { connect } from 'dva';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import PageLoading from '@/components/PageLoading';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import MyTag from '@/components/Tag';
import { emailSendType } from '@/utils/publicData';
import { getName } from '@/utils/utils';

const { Description } = DescriptionList;

@connect(({ sendEmail, loading }) => ({
  sendEmail,
  loading,
}))
class PrintDetailPage extends PureComponent {
  state = {
    sendDetail: {},
  };

  componentDidMount() {
    this.getDetail();
  }

  getDetail() {
    const {
      location: { query },
      dispatch,
    } = this.props;
    if (query.DocEntry) {
      dispatch({
        type: 'sendEmail/singlefetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
          },
        },
      });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.sendEmail.sendHistoryDetail !== prevState.sendDetail) {
      return {
        sendDetail: nextProps.sendEmail.sendHistoryDetail,
      };
    }
    return null;
  }

  sendAgain = () => {
    const { dispatch } = this.props;
    const { sendDetail } = this.state;
    dispatch({
      type: 'sendEmail/saveAgainSend',
      payload: {
        Content: {
          ...sendDetail,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('发送成功');
          this.getDetail();
        }
      },
    });
  };

  render() {
    const { sendDetail } = this.state;
    return (
      <Card bordered={false}>
        {sendDetail.DocEntry ? (
          <Fragment>
            <DescriptionList style={{ marginBottom: 24 }}>
              <Description term="单号">{sendDetail.DocEntry}</Description>
              <Description term="创建日期">{sendDetail.CreateDate}</Description>
              <Description term="来源类型">
                {getName(emailSendType, sendDetail.BaseType)}
              </Description>
              <Description term="来源单号">{sendDetail.BaseEntry}</Description>
              <Description term="邮件模板代码">{sendDetail.EmailTemplateCode}</Description>
              <Description term="邮件模板名称">{sendDetail.EmailTemplateName}</Description>
              <Description term="发送邮箱">{sendDetail.From}</Description>
              <Description term="收信邮箱">{sendDetail.ToList}</Description>
              <Description term="抄送邮箱">{sendDetail.CCList}</Description>
              <Description term="主题">{sendDetail.Title}</Description>
              <Description term="发送状态">
                <MyTag type="成功" value={sendDetail.SendStatus} />
              </Description>
            </DescriptionList>
            <div
              style={{ overflow: 'auto' }}
              id="contentDetails"
              dangerouslySetInnerHTML={{ __html: sendDetail.Body }}
            />
            {sendDetail.SendStatus !== 'Y' ? (
              <FooterToolbar>
                <Button type="primary" onClick={this.sendAgain}>
                  再次发送
                </Button>
              </FooterToolbar>
            ) : (
              ''
            )}
          </Fragment>
        ) : (
          <PageLoading />
        )}
      </Card>
    );
  }
}
export default PrintDetailPage;
