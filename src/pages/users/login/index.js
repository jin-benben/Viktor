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

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.code) {
      dispatch({
        type: 'login/ddLogin',
        payload: {
          Content: {
            Code: query.code,
            appId: 'dingoagro5m6uxanq9uari',
          },
        },
      });
    }
    this.ddloginFun();
  }

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

  ddloginFun = () => {
    const APPID = 'dingoagro5m6uxanq9uari';
    const script = document.createElement('script');
    script.setAttribute('src', '//g.alicdn.com/dingding/dinglogin/0.0.5/ddLogin.js');
    document.getElementsByTagName('head')[0].appendChild(script);
    script.onload = () => {
      const url = encodeURIComponent('http://e.wktmro.com/user/login');
      const goto = encodeURIComponent(
        `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${APPID}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}`
      );
      window.DDLogin({
        id: 'scan',
        goto,
        style: 'border:none;background-color:#FFFFFF;',
        width: '365',
        height: '365',
      });
      const hanndleMessage = event => {
        const { origin } = event;
        if (origin === 'https://login.dingtalk.com') {
          // 判断是否来自ddLogin扫码事件。
          const loginTmpCode = event.data; // 拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
          // eslint-disable-next-line no-restricted-globals
          location.href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${APPID}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}&loginTmpCode=${loginTmpCode}`;
        }
      };
      if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('message', hanndleMessage, false);
      } else if (typeof window.attachEvent !== 'undefined') {
        window.attachEvent('onmessage', hanndleMessage);
      }
    };
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
          <Tab key="tab1" tab="扫码登录">
            <div id="scan" style={{ textAlign: 'center', background: '#fff' }} />
          </Tab>
          <Tab key="tab2" tab="账号密码登录">
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
        </Login>
      </div>
    );
  }
}
export default LoginPage;
