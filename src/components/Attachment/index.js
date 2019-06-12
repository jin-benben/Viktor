import React, { Component, Fragment } from 'react';
import { Table, Icon, Popconfirm } from 'antd';

class Attachment extends Component {
  attachmentColumns = [
    {
      title: '序号',
      width: 80,
      align: 'center',
      dataIndex: 'LineID',
    },
    {
      title: '来源类型',
      align: 'center',
      dataIndex: 'BaseType',
      render: text => <span>{text === '1' ? '正常订单' : '未知'}</span>,
    },
    {
      title: '来源单号',
      align: 'center',
      dataIndex: 'BaseEntry',
    },
    {
      title: '附件代码',
      align: 'center',
      dataIndex: 'AttachmentCode',
    },
    {
      title: '附件描述',
      align: 'center',
      dataIndex: 'AttachmentName',
    },
    {
      title: '附件路径',
      align: 'center',
      dataIndex: 'AttachmentPath',
      render: text => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>,
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record, index) => (
        <Fragment>
          <a target="_blnk" href={record.AttachmentPath}>
            <Icon title="预览" type="eye" style={{ color: '#08c', marginRight: 5 }} />
          </a>
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.deleteLine(record, index)}>
            <Icon title="删除行" type="delete" theme="twoTone" />
          </Popconfirm>
        </Fragment>
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
    return (
      <Table
        dataSource={dataSource}
        bordered
        rowKey="LineID"
        columns={this.attachmentColumns}
        pagination={false}
      />
    );
  }
}

export default Attachment;
