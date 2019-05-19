/* eslint-disable array-callback-return */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Divider, Icon, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import StaffsModal from '@/components/Modal/Staffs';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ authoritySet, loading }) => ({
  authoritySet,
  loading: loading.models.rule,
}))
@Form.create()
class authorityGroup extends PureComponent {
  columns = [
    {
      title: '成员ID',
      dataIndex: 'EmployeeCode',
    },
    {
      title: '成员姓名',
      dataIndex: 'EmployeeName',
    },
    {
      title: '删除',
      dataIndex: 'contact',
      render: (text, record, index) => (
        // eslint-disable-next-line no-script-url
        <a href="javascript:;" onClick={() => this.deleteLine(index)}>
          <Icon type="delete" theme="twoTone" />
        </a>
      ),
    },
  ];

  state = {
    authorityList: {
      Content: {
        Code: '',
        Name: '',
        TI_Z01402: [],
      },
    },
    method: 'A',
    authorityList: [],
  };

  componentDidMount() {
    this.getSingle();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.authoritySet.authorityList !== prevState.authorityList) {
      return {
        authorityList: nextProps.authoritySet.authorityList,
        employeeList: nextProps.authoritySet.authorityList.TI_Z01402,
      };
    }
    return null;
  }

  getSingle() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.Code) {
      this.setState({ method: 'U' });
      dispatch({
        type: 'authoritySet/fetch',
        payload: {
          Content: {
            Code: query.Code,
          },
        },
      });
    }
  }

  saveHandle = () => {
    // 保存主数据
    const { form, dispatch } = this.props;
    const { employeeList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'authoritySet/add',
        payload: {
          Content: {
            ...fieldsValue,
            TI_Z01402: employeeList,
          },
        },
        callback: response => {
          if (response.Status === 200) {
            message.success('添加成功');
          }
        },
      });
    });
  };

  updateHandle = () => {
    // 更新主数据
    const { form, dispatch } = this.props;
    const { employeeList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'authoritySet/update',
        payload: {
          Content: {
            ...fieldsValue,
            TI_Z01402: employeeList,
          },
        },
        callback: response => {
          if (response.Status === 200) {
            message.success('更新成功');
          }
        },
      });
    });
  };

  render() {
    const { authorityList, method } = this.state;

    return (
      <Card title="角色权限设置">
        <StandardTable
          data={{ list: authorityList }}
          rowKey="EmployeeCode"
          columns={this.columns}
        />
        <FooterToolbar>
          {method === 'U' ? (
            <Button onClick={this.updateHandle} type="primary">
              更新
            </Button>
          ) : (
            <Button onClick={this.saveHandle} type="primary">
              保存
            </Button>
          )}
        </FooterToolbar>
      </Card>
    );
  }
}

export default authorityGroup;
