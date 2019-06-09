import React, { Component } from 'react';
import { Card, Button } from 'antd';
import { connect } from 'dva';
import UEditor from '@/components/Ueditor';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';

@connect(({ print, loading }) => ({
  print,
  loading,
}))
class PrintPage extends Component {
  state = {
    printDetail: {
      OutType: '',
      isEdit: true,
    },
  };

  componentDidMount() {
    const {
      location: { query },
      dispatch,
    } = this.props;
    if (query.BaseEntry && query.Code) {
      dispatch({
        type: 'print/getPrint',
        payload: {
          Content: {
            ...query,
          },
        },
      });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.print.printDetail !== prevState.printDetail) {
      return {
        printDetail: nextProps.print.printDetail,
      };
    }
    return null;
  }

  // 保存打印数据
  savePrintFun = () => {
    const {
      dispatch,
      print: { printDetail },
      location: { query },
    } = this.props;
    const {
      BaseEntry,
      BaseType,
      HtmlString,
      HtmlTemplateCode,
      PrintType,
      PaperHTMLString,
    } = printDetail;
    dispatch({
      type: 'print/savePrint',
      payload: {
        Content: {
          BaseType,
          BaseEntry,
          PrintTemplateCode: query.Code,
          PrintTemplateName: query.Name,
          OutType: PrintType,
          HtmlTemplateCode,
          Content: HtmlString,
          PaperHTMLString,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          this.pintFun();
        }
      },
    });
  };

  pintFun = () => {
    window.document.body.innerHTML = window.document.getElementById('contentDetails').innerHTML;
    window.print();
    window.location.reload();
  };

  handleChange = content => {
    const { printDetail } = this.state;
    Object.assign(printDetail, { HtmlString: `${printDetail.PaperHTMLString + content}</div>` });
    this.setState({ printDetail });
  };

  render() {
    const { printDetail, isEdit } = this.state;
    console.log(printDetail.HtmlString);
    return (
      <Card bordered={false}>
        <div
          style={{
            display: isEdit ? 'block' : 'none',
            overflow: 'auto',
            textAlign: 50,
            marginLeft: 50,
          }}
        >
          <UEditor content={printDetail.HtmlString} onChange={this.handleChange} />
        </div>
        <div
          style={{ overflow: 'auto', display: isEdit ? 'none' : 'block' }}
          id="contentDetails"
          dangerouslySetInnerHTML={{ __html: printDetail.HtmlString }}
        />
        <FooterToolbar>
          {printDetail.PrintType === '1' ? (
            <Button onClick={() => this.setState({ isEdit: true })} type="primary">
              编辑
            </Button>
          ) : null}
          <Button onClick={this.savePrintFun} type="primary">
            保存并打印
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}
export default PrintPage;
