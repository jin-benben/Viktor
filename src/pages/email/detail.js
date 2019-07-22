import React, { PureComponent, Fragment } from 'react';
import { Card, Button, message, Modal, Badge, Tag } from 'antd';
import { connect } from 'dva';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import PageLoading from '@/components/PageLoading';
import Attachment from '@/components/Attachment/other';
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

  lookAttach = () => {
    this.setState({
      attachmentVisible: true,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      attachmentVisible: !!flag,
    });
  };

  render() {
    const { sendDetail, attachmentVisible } = this.state;
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
                <span>
                  {sendDetail.SendStatus === 'C' ? (
                    <Tag color="blue">成功</Tag>
                  ) : (
                    <Tag color="red">失败</Tag>
                  )}
                </span>
              </Description>
              <Description term="附件">
                <Badge count={sendDetail.TI_Z04702.length} showZero>
                  <Button
                    style={{ marginLeft: 16 }}
                    size="small"
                    type="primary"
                    onClick={() => this.handleModalVisible(true)}
                    shape="circle"
                    icon="eye"
                    title="查看附件"
                  />
                </Badge>
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
        <Modal
          width={960}
          destroyOnClose
          title="物料行附件"
          visible={attachmentVisible}
          onOk={() => this.handleModalVisible(false)}
          onCancel={() => this.handleModalVisible(false)}
        >
          <Attachment dataSource={sendDetail.TI_Z04702} />
        </Modal>
      </Card>
    );
  }
}
export default PrintDetailPage;
