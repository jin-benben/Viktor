import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
import { connect } from 'dva';
import UEditor from '@/components/Ueditor';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';

@connect(({ print, loading }) => ({
  print,
  loading,
}))
class PrintPage extends PureComponent {
  state = {
    printDetail: {
      OutType: '',
      isEdit: false,
    },
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

  pintFun = () => {
    window.document.body.innerHTML = window.document.getElementById('contentDetails').innerHTML;
    window.print();
    window.location.reload();
  };

  handleChange = content => {
    const { printDetail } = this.state;
    Object.assign(printDetail, { Content: `${printDetail.PaperHTMLString + content}</div>` });
    this.setState({ printDetail });
  };

  render() {
    const { printDetail, isEdit } = this.state;
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
          <UEditor content={printDetail.Content} onChange={this.handleChange} />
        </div>
        <div
          style={{ overflow: 'auto', display: isEdit ? 'none' : 'block' }}
          id="contentDetails"
          dangerouslySetInnerHTML={{ __html: printDetail.Content }}
        />
        <FooterToolbar>
          {printDetail.OutType === '1' ? (
            <Button onClick={() => this.setState({ isEdit: true })} type="primary">
              编辑
            </Button>
          ) : null}
          <Button onClick={this.pintFun} type="primary">
            打印
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}
export default PrintPage;
