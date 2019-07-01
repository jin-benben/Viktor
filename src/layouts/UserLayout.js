import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import { GlobalFooter } from 'ant-design-pro';

import styles from './UserLayout.less';
import logo from '../assets/log.jpg';

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 秦皇岛维克托国际贸易有限公司
  </Fragment>
);

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>维克托国际贸易有限公司</span>
              </Link>
            </div>
            <div className={styles.desc}>一个成长型企业</div>
          </div>
          {children}
        </div>
        <GlobalFooter copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
