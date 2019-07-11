import React, { PureComponent } from 'react';
import { Spin, Menu, Icon, Avatar } from 'antd';
import logo from '@/assets/log.jpg';
import HeaderDropdown from '../HeaderDropdown';
import { getName } from '@/utils/utils';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
  render() {
    const { currentUser, onMenuClick, theme } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="lock">
          <Icon type="lock" />
          设置密码
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );

    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <span>{getName(currentUser.Company || [], currentUser.CompanyCode)}</span>
        {currentUser.UserName ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="small" className={styles.avatar} src={logo} alt="avatar" />
              <span className={styles.name}>
                {`${currentUser.UserName}(${currentUser.UserCode})`}
              </span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
      </div>
    );
  }
}
