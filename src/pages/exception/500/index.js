import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Exception } from 'ant-design-pro';

const Exception500 = () => (
  <Exception
    type="500"
    desc={formatMessage({ id: '抱歉，服务器出错了' })}
    linkElement={Link}
    backText={formatMessage({ id: '返回首页' })}
  />
);

export default Exception500;
