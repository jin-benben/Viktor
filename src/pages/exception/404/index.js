import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Exception } from 'ant-design-pro';

const Exception404 = () => (
  <Exception
    type="404"
    desc={formatMessage({ id: '抱歉，你访问的页面不存在' })}
    linkElement={Link}
    backText={formatMessage({ id: '返回首页' })}
  />
);

export default Exception404;
