import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Collapse, Empty } from 'antd';
import moment from 'moment';
import Link from 'umi/link';
import { getName } from '@/utils/utils';
import { baseType } from '@/utils/publicData';

const { Panel } = Collapse;
@connect(({ global }) => ({
  global,
}))
class OrderAttach extends PureComponent {
  render() {
    const {
      global: { TI_Z004 },
      dataSource,
      deleteLine,
      skuLineAttachment,
    } = this.props;
    return (
      <Fragment>
        {dataSource.length ? (
          <Collapse>
            {dataSource.map(item => {
              const header = (
                <div>
                  单号：{' '}
                  <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${item.DocEntry}`}>
                    {item.DocEntry}
                  </Link>
                  ; 创建日期：{moment(item.FCreateDate).format('YYYY-MM-DD')}； 创建人:
                  <span>{getName(TI_Z004, item.FCreateUser)}</span>； 更新日期：
                  {moment(item.FUpdateDate).format('YYYY-MM-DD')}； 更新人:
                  <span>{getName(TI_Z004, item.FUpdateUser)}</span>
                  <Icon
                    title="上传附件"
                    className="icons"
                    style={{ color: '#08c', marginRight: 5, marginLeft: 5 }}
                    type="cloud-upload"
                    onClick={() => skuLineAttachment(item, '', false)}
                  />
                </div>
              );
              return (
                <Panel header={header} key={item.DocEntry}>
                  {item.TI_Z02603.map((line, index) => (
                    <ul key={line.OrderID}>
                      <li>序号:{line.OrderID}</li>
                      <li>
                        来源类型:<span>{getName(baseType, line.BaseType)}</span>
                      </li>
                      <li>来源单号:{line.BaseEntry}</li>
                      <li>附件代码:{line.AttachmentCode}</li>
                      <li>附件描述:{line.AttachmentName}</li>
                      <li>
                        附件路径:
                        <a href={line.AttachmentPath} target="_blank" rel="noopener noreferrer">
                          {line.AttachmentPath}
                        </a>
                      </li>
                      <li>
                        操作:{' '}
                        <Icon
                          title="删除行"
                          type="delete"
                          theme="twoTone"
                          onClick={() => deleteLine(item, index, false)}
                        />
                      </li>
                    </ul>
                  ))}
                </Panel>
              );
            })}
          </Collapse>
        ) : (
          <Empty />
        )}
      </Fragment>
    );
  }
}

export default OrderAttach;
