import React from 'react';
import Link from 'umi/link';
import { PageHeader } from 'antd';

const MyPageHeader = props => {
  const routes = [
    {
      path: '/',
      breadcrumbName: '采购业务',
    },
    {
      path: '/purchase/TI_Z028/TI_Z02801',
      breadcrumbName: '采购询价确认单',
    },
    {
      path: '/purchase/TI_Z028/TI_Z02803',
      breadcrumbName: '单据查询',
    },
    {
      path: '/purchase/TI_Z028/TI_Z02804',
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
