export const printType = [
  {
    Key: '1',
    Value: '可以编辑',
  },
  {
    Key: '2',
    Value: '直接打印',
  },
];
export const printOrderType = [
  {
    Key: 'TI_Z029',
    Value: '销售报价',
  },
  {
    Key: 'TI_Z030',
    Value: '销售合同',
  },
  {
    Key: 'ODLN',
    Value: '交货单',
  },
];
export const emailSendType = [
  {
    Key: 'TI_Z027',
    Value: '供应商询价单',
  },
  {
    Key: 'TI_Z029',
    Value: '销售报价',
  },
  {
    Key: 'TI_Z030',
    Value: '销售合同',
  },
];

export const baseType = [
  {
    Key: 'TI_Z026',
    Value: '客户询价单',
  },
  {
    Key: 'TI_Z027',
    Value: '供应商询价单',
  },
  {
    Key: 'TI_Z029',
    Value: '销售报价',
  },
  {
    Key: 'TI_Z030',
    Value: '销售合同',
  },
];

export const templateType = [
  {
    Key: '1',
    Value: '通用',
  },
  {
    Key: '2',
    Value: '打印',
  },
  {
    Key: '3',
    Value: '邮件',
  },
];
export const parameterType = [
  {
    Key: '1',
    Value: '变量',
  },
  {
    Key: '2',
    Value: 'List',
  },
];
export const orderSourceType = [
  {
    Key: '1',
    Value: '销售下单',
  },
  {
    Key: '2',
    Value: '网站下单',
  },
  {
    Key: '3',
    Value: '电话',
  },
  {
    Key: '4',
    Value: '其他来源',
  },
];

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 10 },
  },
};

export const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

export const linkmanColumns = [
  {
    title: '用户ID',
    align: 'center',
    dataIndex: 'UserID',
  },
  {
    title: '联系人',
    align: 'center',
    dataIndex: 'Contacts',
  },
  {
    title: '手机号',
    align: 'center',
    dataIndex: 'CellphoneNO',
  },
];

export const otherCostCColumns = [
  {
    title: '序号',
    width: 80,
    align: 'center',
    dataIndex: 'OrderId',
  },
  {
    title: '费用项目',
    align: 'center',
    dataIndex: 'FeeName',
  },
  {
    title: '总计',
    align: 'center',
    dataIndex: 'OtherTotal',
  },
  {
    title: '行备注',
    align: 'center',
    dataIndex: 'LineComment',
  },
];
