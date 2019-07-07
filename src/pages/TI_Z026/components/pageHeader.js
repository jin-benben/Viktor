import React from 'react';
import Link from 'umi/link';
import { PageHeader, Breadcrumb } from 'antd';

const MyPageHeader = props => {
  const routes = [
    {
      path: '/',
      breadcrumbName: '销售业务',
    },
    {
      path: '/sellabout/TI_Z026/TI_Z02601',
      breadcrumbName: '客户询价单',
    },
    {
      path: '/sellabout/TI_Z026/TI_Z02606',
      breadcrumbName: '单据查询',
    },
    {
      path: '/sellabout/TI_Z026/TI_Z02607',
      breadcrumbName: '明细查询',
    },
  ];
  const itemRender = (route, params, routes, paths) => {
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
