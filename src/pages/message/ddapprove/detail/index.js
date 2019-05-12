import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './style.less';

const { Description } = DescriptionList;

@connect(({ approveDetail, loading }) => ({
  approveDetail,
  loading: loading.models.rule,
}))
class ApproveDetail extends PureComponent {
  state = {
    description: [
      {
        title: '单号',
        dataIndex: 'DonEntry',
        width: 80,
      },
      {
        title: '单据日期',
        dataIndex: 'DocDate',
      },
      {
        title: '单据状态',
        dataIndex: 'DocStatus',
      },
      {
        title: '审批对象',
        dataIndex: 'Object',
      },
      {
        title: '原始对象主键',
        dataIndex: 'BaseKey',
      },
      {
        title: '审批实例ID',
        dataIndex: 'Process_instance_id',
      },
      {
        title: '传入参数JSON',
        dataIndex: 'InputJson',
      },
      {
        title: '钉钉表单JSON',
        dataIndex: 'DDJson',
      },
      {
        title: '钉钉审批流代码',
        dataIndex: 'ProcessCode',
      },
      {
        title: '钉钉审批流代码',
        dataIndex: 'ObjType',
      },
      {
        title: '状态',
        dataIndex: 'Status',
        render: val => <span>{val === '1' ? '成功' : '失败'}</span>,
      },
      {
        title: '创建用户',
        dataIndex: 'CreateUser',
      },
    ],
  };

  render() {
    const { description } = this.state;
    return (
      <Card bordered={false} className={styles.approveDetail}>
        <DescriptionList size="large" title="钉钉审批单详情" col={4}>
          {description.map(des => {
            if (des.render) {
              return <Description term={des.title}>{des.render}</Description>;
            }
            return <Description term={des.title}>sss</Description>;
          })}
        </DescriptionList>
      </Card>
    );
  }
}

export default ApproveDetail;
