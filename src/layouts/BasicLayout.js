import React from 'react';
import { Layout, PageHeader } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import { Scrollbars } from 'react-custom-scrollbars';
import classNames from 'classnames';
import Media from 'react-media';
import pathToRegexp from 'path-to-regexp';
import { conversionBreadcrumbList } from '@/components/PageHeader/breadcrumb';

import logo from '../assets/log.jpg';

import Header from './Header';
import Context from './MenuContext';
import SiderMenu from '@/components/SiderMenu';

import styles from './BasicLayout.less';

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getRouterAuthority = (pathname, routeData) => {
    let routeAuthority = ['noAuthority'];
    const getAuthority = (key, routes) => {
      routes.map(route => {
        if (route.path === key) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);
    if (!currRouterData) {
      return '维克托';
    }
    return `${currRouterData.name} - 维克托`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '200px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  // 获取公共字段

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      fixedHeader,
    } = this.props;
    const isTop = PropsLayout === 'topmenu';
    // const routerConfig = this.getRouterAuthority(pathname, routes);
    const breadcrumbObj = conversionBreadcrumbList({
      ...this.props,
    });

    const isbreadcrumb = breadcrumbObj.routes.length > 1 && pathname.indexOf('/exception') === -1;
    const isAsk =
      pathname.indexOf('/sellabout/TI_Z026') === -1 &&
      pathname.indexOf('/purchase/TI_Z027') === -1 &&
      pathname.indexOf('/sellabout/TI_Z030') === -1 &&
      pathname.indexOf('/sellabout/TI_Z029') === -1 &&
      pathname.indexOf('/main/product/TI_Z005') === -1 &&
      pathname.indexOf('/main/TI_Z006') === -1 &&
      pathname.indexOf('/main/TI_Z007') === -1 &&
      pathname.indexOf('/purchase/TI_Z028') === -1;
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <Scrollbars style={{ minHeight: '100vh' }}>
        <Layout>
          {isTop && !isMobile ? null : (
            <SiderMenu
              logo={logo}
              theme={navTheme}
              onCollapse={this.handleMenuCollapse}
              menuData={menuData}
              isMobile={isMobile}
              {...this.props}
            />
          )}
          <Layout
            style={{
              ...this.getLayoutStyle(),
              minHeight: '100vh',
            }}
          >
            <Header
              menuData={menuData}
              handleMenuCollapse={this.handleMenuCollapse}
              logo={logo}
              isMobile={isMobile}
              {...this.props}
            />
            <Content className={styles.content} style={contentStyle}>
              {isbreadcrumb && isAsk ? <PageHeader breadcrumb={breadcrumbObj} /> : null}
              {children}
            </Content>
          </Layout>
        </Layout>
      </Scrollbars>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menu.menuData,
  global,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
