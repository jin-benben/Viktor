import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Modal, Button, message } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import MDMCommonality from '@/components/Select';
import StandardTable from '@/components/StandardTable';

const FormItem = Form.Item;
const { Description } = DescriptionList;
@Form.create()
@connect(({ global }) => ({
  global,
}))
class CreateForm extends React.Component {
  okHandle = () => {
    const { handleSubmit, form, origin } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSubmit({ ...origin, ...fieldsValue });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      global: { TI_Z042 },
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
        width={640}
        destroyOnClose
        maskClosable={false}
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
            })(<MDMCommonality initialValue={origin.U_Origin} data={TI_Z042} />)}
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
@connect(({ hscodeDetail, loading, global }) => ({
  hscodeDetail,
  global,
  addloading: loading.effects['hscodeDetail/fetch'],
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
    const {
      dispatch,
      global: { TI_Z042 },
    } = this.props;
    if (!TI_Z042.length) {
      dispatch({
        type: 'global/getMDMCommonality',
        payload: {
          Content: {
            CodeList: ['TI_Z042'],
          },
        },
      });
    }
    this.getDetail();
  }

  // 获取详情
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
  handleSubmit = origin => {
    const { dispatch } = this.props;
    const { hsCodeInfo } = this.state;
    const last = hsCodeInfo.TI_Z03602[hsCodeInfo.TI_Z03602.length - 1];
    const lastid = last ? last.LineId + 1 : 1;
    const LineId = origin.LineId ? origin.LineId : lastid;
    Object.assign(origin, { LineId });
    dispatch({
      type: 'hscodeDetail/add',
      payload: {
        Content: {
          ...origin,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          message.success('添加成功');
          this.getDetail();
          this.handleModalVisible(false);
        }
      },
    });
  };

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
            添加产地
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default HSCode;
