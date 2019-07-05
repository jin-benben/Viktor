import React, { PureComponent } from 'react';
import { Table } from 'antd';

class Attachment extends PureComponent {
  attachmentColumns = [
    {
      title: '附件代码',
      align: 'center',
      width: 200,
      dataIndex: 'AttachmentCode',
      render: text => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>,
    },
    {
      title: '附件描述',
      align: 'center',
      width: 100,
      dataIndex: 'AttachmentName',
    },
    {
      title: '附件路径',
      align: 'center',
      width: 200,
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
  ];

  deleteLine = (record, index) => {
    const { deleteLineFun } = this.props;
    if (deleteLineFun) {
      deleteLineFun(record, index);
    }
  };

  render() {
    const { dataSource } = this.props;
    const newdataSource = dataSource.map((item, index) => {
      const newitem = item;
      newitem.key = index;
      return newitem;
    });
    return (
      <Table
        dataSource={newdataSource}
        bordered
        rowKey="key"
        columns={this.attachmentColumns}
        pagination={false}
      />
    );
  }
}

export default Attachment;
