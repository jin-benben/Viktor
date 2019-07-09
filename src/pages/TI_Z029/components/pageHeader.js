import React from 'react';
import Link from 'umi/link';
import { PageHeader } from 'antd';

const MyPageHeader = props => {
  const routes = [
    {
      path: '/',
      breadcrumbName: '销售业务',
    },
    {
      path: '/sellabout/TI_Z029/add',
      breadcrumbName: '销售报价单',
    },
    {
      path: '/sellabout/TI_Z029/search',
      breadcrumbName: '单据查询',
    },
    {
      path: '/sellabout/TI_Z029/searchLine',
      breadcrumbName: '明细查询',
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