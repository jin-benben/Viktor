import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { printOrderType } from '@/utils/publicData';
import { getName } from '@/utils/utils';

const { Description } = DescriptionList;

@connect(({ print, loading }) => ({
  print,
  loading,
}))
class PrintDetailPage extends PureComponent {
  state = {
    printDetail: {},
  };

  componentDidMount() {
    const {
      location: { query },
      dispatch,
    } = this.props;
    if (query.DocEntry) {
      dispatch({
        type: 'print/singlefetch',
        payload: {
          Content: {
            DocEntry: query.DocEntry,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            this.setState({
              printDetail: response.Content,
            });
          }
        },
      });
    }
  }

  render() {
    const { printDetail } = this.state;
    return (
      <Card bordered={false}>
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="单号">{printDetail.DocEntry}</Description>
          <Description term="创建日期">{printDetail.CreateDate}</Description>
          <Description term="来源类型">{getName(printOrderType, printDetail.BaseType)}</Description>
          <Description term="来源单号">{printDetail.BaseEntry}</Description>
          <Description term="打印单据模板代码">{printDetail.PrintTemplateCode}</Description>
          <Description term="打印单据模板名称">{printDetail.PrintTemplateName}</Description>
          <Description term="内容模板">{printDetail.HtmlTemplateCode}</Description>
        </DescriptionList>
        <div
          style={{ overflow: 'auto' }}
          id="contentDetails"
          dangerouslySetInnerHTML={{ __html: printDetail.Content }}
        />
      </Card>
    );
  }
}
export default PrintDetailPage;
