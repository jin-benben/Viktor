import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Exception } from 'ant-design-pro';

const Exception403 = () => (
  <Exception
    type="403"
    desc={formatMessage({ id: '抱歉，你无权访问该页面' })}
    linkElement={Link}
    backText={formatMessage({ id: '返回首页' })}
  />
);

export default Exception403;
