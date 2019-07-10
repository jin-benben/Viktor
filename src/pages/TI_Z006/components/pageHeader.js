import React from 'react';
import Link from 'umi/link';
import { PageHeader } from 'antd';

const MyPageHeader = props => {
  const routes = [
    {
      path: '/',
      breadcrumbName: '业务主数据',
    },
    {
      path: '/main/TI_Z006/add',
      breadcrumbName: '客户管理',
    },
    {
      path: '/main/TI_Z006/serach',
      breadcrumbName: '客户查询',
    },
  ];
  const itemRender = route => {
    const { pathname } = props;

    return (
      <Link to={route.path} style={{ fontWeight: pathname === route.path ? 'bold' : '' }}>
        {route.breadcrumbName}
      </Link>
    );
  };
  return (
    <PageHeader style={{ paddingRight: 0, paddingLeft: 0 }} breadcrumb={{ routes, itemRender }} />
  );
};

export default MyPageHeader;
