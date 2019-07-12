import React, { Component, Fragment } from 'react';
import { Table, Icon, Popconfirm } from 'antd';
import { baseType } from '@/utils/publicData';
import { getName } from '@/utils/utils';

class Attachment extends Component {
  attachmentColumns = [
    {
      title: '序号',
      width: 80,
      align: 'center',
      dataIndex: 'OrderID',
    },
    {
      title: '来源类型',
      align: 'center',
      width: 100,
      dataIndex: 'BaseType',
      render: text => <span>{getName(baseType, text)}</span>,
    },
    {
      title: '来源单号',
      align: 'center',
      width: 100,
      dataIndex: 'BaseEntry',
    },
    {
      title: '附件代码',
      align: 'center',
      width: 300,
      dataIndex: 'AttachmentCode',
      render: text => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>,
    },
    {
      title: '附件描述',
      width: 100,
      align: 'center',
      dataIndex: 'AttachmentName',
    },
    {
      title: '附件路径',
      width: 300,
      align: 'center',
      dataIndex: 'AttachmentPath',
      render: text => (
        <a
          style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
          href={text}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </a>
      ),
    },
    {
      title: '操作',
      align: 'center',
      width: 80,
      render: (text, record, index) => {
        const { iscan } = this.props;
        return (
          <Fragment>
            {iscan ? (
              ''
            ) : (
              <Popconfirm title="确定要删除吗?" onConfirm={() => this.deleteLine(record, index)}>
                <Icon title="删除行" type="delete" theme="twoTone" />
              </Popconfirm>
            )}
          </Fragment>
        );
      },
    },
  ];

  deleteLine = (record, index) => {
    const { deleteLineFun } = this.props;
    if (deleteLineFun) {
      deleteLineFun(record, index);
    }
  };

  render() {
    const { dataSource } = this.props;

    return (
      <Table
        dataSource={dataSource}
        bordered
        rowKey="OrderID"
        columns={this.attachmentColumns}
        pagination={false}
      />
    );
  }
}

export default Attachment;
