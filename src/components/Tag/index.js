import React, { Fragment } from 'react';
import { Tag } from 'antd';

const MyTag = props => {
  const { type, value } = props;
  let whichTag;
  const tagsfun = () => {
    switch (type) {
      case '报价':
        whichTag = value === 'O' ? <Tag color="gold">未报价</Tag> : <Tag color="green">已报价</Tag>;
        break;
      case '询价':
        whichTag = value === 'O' ? <Tag color="gold">未询价</Tag> : <Tag color="green">已询价</Tag>;
        break;
      case '关闭':
        whichTag = value === 'Y' ? <Tag color="red">已关闭</Tag> : <Tag color="green">未关闭</Tag>;
        break;
      case '确认':
        whichTag = value === 'C' ? <Tag color="green">已确认</Tag> : <Tag color="gold">未确认</Tag>;
        break;
      case '通过':
        whichTag = value === 'Y' ? <Tag color="green">已通过</Tag> : <Tag color="gold">未通过</Tag>;
        break;
      case '成功':
        whichTag = value === 'Y' ? <Tag color="green">成功</Tag> : <Tag color="gold">失败</Tag>;
        break;
      case 'IsInquiry':
        whichTag =
          value === 'Y' ? <Tag color="gold">需询价</Tag> : <Tag color="green">不需询价</Tag>;
        break;
      default:
        break;
    }
    return whichTag;
  };
  return <Fragment>{tagsfun()}</Fragment>;
};

export default MyTag;
