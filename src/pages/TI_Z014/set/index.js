/* eslint-disable array-callback-return */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Switch, Card, Form, Button, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';

function switchType(Type) {
  switch (Type) {
    case '1':
      return '节点';
    case '2':
      return 'Action';
    case '3':
      return '数据列';
    default:
      return '未知';
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ authoritySet, loading }) => ({
  authoritySet,
  loading: loading.models.rule,
}))
@Form.create()
class authorityGroup extends PureComponent {
  columns = [
    {
      title: '权限代码',
      dataIndex: 'PermissionCode',
    },
    {
      title: '权限名称',
      dataIndex: 'PermissionName',
    },
    {
      title: '权限类型',
      dataIndex: 'Type',
      render: text => <span>{switchType(text)}</span>,
    },
    {
      title: '权限',
      dataIndex: 'Permission',
      render: (text, record, index) => (
        <Switch
          checkedChildren="开"
          onChange={value => {
            this.permissionChange(value, record, index);
          }}
          unCheckedChildren="关"
          defaultChecked={record.Permission === 'Y'}
        />
      ),
    },
  ];

  state = {
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

  permissionChange = (value, record, index) => {
    const { authorityList } = this.state;
    // eslint-disable-next-line no-param-reassign
    record.Permission = value ? 'Y' : 'N';
    authorityList[index] = record;
    this.setState({ authorityList });
  };

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
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { authorityList } = this.state;
    dispatch({
      type: 'authoritySet/update',
      payload: {
        Content: {
          Code: query.Code,
          TI_Z01501: authorityList,
        },
      },
      callback: response => {
        if (response.Status === 200) {
          message.success('更新成功');
        }
      },
    });
  };

  render() {
    const { authorityList, method } = this.state;

    return (
      <Card title="角色权限设置">
        <StandardTable
          data={{ list: authorityList }}
          rowKey="PermissionCode"
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
