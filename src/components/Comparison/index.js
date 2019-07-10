import React, { PureComponent, Fragment } from 'react';
import { Table, Modal, Button } from 'antd';
import Link from 'umi/link';

const Text = ({ text, isRed }) => (
  <div style={{ wordWrap: 'break-word', wordBreak: 'break-all', color: isRed ? 'red' : '' }}>
    {text}
  </div>
);

class comparison extends PureComponent {
  columns = [
    {
      title: '单号',
      width: 80,
      dataIndex: 'DocEntry',
      render: (text, record) => {
        const { type } = this.props;
        if (type === 'TI_Z029') {
          return (
            <Link target="_blank" to={`/sellabout/TI_Z029/detail?DocEntry=${text}`}>
              {`${text}-${record.LineID}`}
            </Link>
          );
        }
        return (
          <Link target="_blank" to={`/sellabout/TI_Z026/detail?DocEntry=${text}`}>
            {`${text}-${record.LineID}`}
          </Link>
        );
      },
    },
    {
      title: '品牌',
      width: 100,
      dataIndex: 'BrandName',
      render: text => <Text text={text} />,
    },
    {
      title: '名称',
      width: 100,
      dataIndex: 'ProductName',
      render: (text, record) => <Text isRed={record.ForeignName !== text} text={text} />,
    },
    {
      title: '名称(外)',
      width: 250,
      dataIndex: 'ForeignName',
      render: text => <Text text={text} />,
    },
    {
      title: '型号',
      width: 150,
      dataIndex: 'ManufactureNO',
      render: (text, record) => <Text isRed={record.ForeignParameters !== text} text={text} />,
    },
    {
      title: '规格(外)',
      width: 250,
      dataIndex: 'ForeignParameters',
      render: text => <Text text={text} />,
    },
    {
      title: '价格',
      dataIndex: 'Price',
      render: text => <Text text={text} />,
    },
  ];

  state = {
    modalVisible: false,
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  render() {
    const { dataSource, key } = this.props;
    const { modalVisible } = this.state;
    return (
      <Fragment>
        <Modal
          width={1100}
          destroyOnClose
          title="匹配"
          visible={modalVisible}
          onOk={this.okHandle}
          onCancel={() => this.handleModalVisible(false)}
        >
          <Table
            pagination={false}
            rowKey={key || 'Key'}
            bordered
            scroll={{ y: 400 }}
            dataSource={dataSource}
            columns={this.columns}
          />
        </Modal>
        <Button type="primary" onClick={() => this.handleModalVisible(true)}>
          名称规格匹配
        </Button>
      </Fragment>
    );
  }
}

export default comparison;
