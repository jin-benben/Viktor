import React, { PureComponent } from 'react';
import Login from 'ant-design-pro/lib/Login';

import { Alert } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends PureComponent {
  state = {
    notice: '',
    type: 'tab1',
  };

  onSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          Content: {
            ...values,
          },
        },
      });
    }
  };

  onTabChange = key => {
    this.setState({
      type: key,
    });
  };

  // changeAutoLogin = e => {
  //   this.setState({
  //     autoLogin: e.target.checked,
  //   });
  // };

  render() {
    const { type, notice } = this.state;
    const { submitting } = this.props;
    return (
      <div className={styles.loginWarp}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.onSubmit}>
          <Tab key="tab1" tab="账号密码登录">
            {notice && (
              <Alert style={{ marginBottom: 24 }} message={notice} type="error" showIcon closable />
            )}
            <UserName
              name="Code"
              placeholder="请输入账号"
              rules={[
                {
                  required: true,
                  message: '请输入账号',
                },
              ]}
            />
            <Password
              name="PS"
              placeholder="密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            />
            <Submit loading={submitting}>登录</Submit>
          </Tab>
          <Tab key="tab2" tab="扫码登录">
            <span>此功能还在开发当中</span>
          </Tab>
        </Login>
      </div>
    );
  }
}
export default LoginPage;
