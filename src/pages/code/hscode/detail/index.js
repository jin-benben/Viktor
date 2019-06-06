import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Modal, Button, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import ManLocation from '@/components/ManLocation';

const FormItem = Form.Item;
const { Description } = DescriptionList;
@Form.create()
class CreateForm extends React.Component {
  // static getDerivedStateFromProps(nextProps, preState) {
  //   if(nextProps.origin!==preState.origin){
  //     return {
  //       origin:nextProps.origin
  //     }
  //   }

  //   return null;
  // }

  okHandle = () => {
    const { handleSubmit } = this.props;
    handleSubmit();
  };

  render() {
    const {
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      origin,
    } = this.props;
    //  const {origin}=this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 10 },
      },
    };
    const formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };

    return (
      <Modal
        width={960}
        destroyOnClose
        title="编辑"
        okText="保存"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <FormItem key="U_Origin" {...formLayout} label="产地">
            {getFieldDecorator('U_Origin', {
              initialValue: origin.U_Origin,
            })(<ManLocation initialValue={origin.U_Origin} />)}
          </FormItem>

          <FormItem key="U_VatRateOther" {...formLayout} label="特殊税率">
            {getFieldDecorator('U_VatRateOther', {
              rules: [{ required: true, message: '请输入特殊税率！' }],
              initialValue: origin.U_VatRateOther,
            })(<Input placeholder="请输入特殊税率！" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
/* eslint react/no-multi-comp:0 */
@connect(({ hscodeDetail, loading }) => ({
  hscodeDetail,
  addloading: loading.effects['hscodeDetail/add'],
}))
@Form.create()
class HSCode extends PureComponent {
  state = {
    modalVisible: false,
    method: 'A',
    hsCodeInfo: {},
    origin: {
      Code: '',
      LineId: '',
      U_Origin: '',
      U_VatRateOther: '',
    },
  };

  columns = [
    {
      title: '行号',
      dataIndex: 'LineId',
    },
    {
      title: '产地',
      dataIndex: 'U_Origin',
    },
    {
      title: '特殊税率',
      dataIndex: 'U_VatRateOther',
    },
    {
      title: '操作',

      render: (text, record) => (
        <Fragment>
          <a href="">修改</a>
        </Fragment>
      ),
    },
  ];

  static getDerivedStateFromProps(nextProps, preState) {
    if (nextProps.hscodeDetail.hsCodeInfo !== preState.hsCodeInfo) {
      return {
        hsCodeInfo: nextProps.hscodeDetail.hsCodeInfo,
      };
    }

    return null;
  }

  componentDidMount() {
    this.getDetail();
  }

  getDetail() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.Code) {
      dispatch({
        type: 'hscodeDetail/fetch',
        payload: {
          Content: {
            Code: query.Code,
          },
        },
      });
    }
  }

  // 产地添加
  handleSubmit = () => {};

  // 关闭弹窗
  handleModalVisible = flag => {
    const { hsCodeInfo } = this.state;
    this.setState({
      modalVisible: !!flag,
      origin: {
        Code: hsCodeInfo.Code,
        LineId: '',
        U_Origin: '',
        U_VatRateOther: '',
      },
    });
  };

  // 更新
  updateHandle = () => {};

  render() {
    const { modalVisible, hsCodeInfo, method, origin } = this.state;
    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="tableList">
            <DescriptionList style={{ marginBottom: 24 }}>
              <Description term="国内海关ID">{hsCodeInfo.Code}</Description>
              <Description term="国内海关名称">{hsCodeInfo.Name}</Description>
              <Description term="税率">{hsCodeInfo.U_VatRate}</Description>
              <Description term="特殊税率">{hsCodeInfo.U_VatRateOther}</Description>
              <Description term="申报要素">{hsCodeInfo.U_Elements}</Description>
            </DescriptionList>
            <StandardTable
              data={{ list: hsCodeInfo.TI_Z03602 }}
              rowKey="LineId"
              pagination={false}
              columns={this.columns}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          origin={origin}
          method={method}
          modalVisible={modalVisible}
        />
        <FooterToolbar>
          <Button onClick={() => this.handleModalVisible(true)} type="primary">
            编辑
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default HSCode;
