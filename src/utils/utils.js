/* eslint-disable consistent-return */
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import round from 'lodash/round';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
const emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,20}$/;
export function isUrl(path) {
  return reg.test(path);
}
export function checkPhone(phone) {
  // 手机效验
  if (phone.length === 11) {
    return /^1(3|4|5|6|7|8|9)\d{9}$/.test(phone);
  }
  return false;
}
export function chechEmail(email) {
  // 邮箱效验
  return emailReg.test(email);
}

export function requestUrl(url) {
  if (url.indexOf('/MDM') !== -1) {
    return url.replace(/\/MDM/i, 'http://apimdm.wktmro.com');
  }
  if (url.indexOf('/OMS') !== -1) {
    return url.replace(/\/OMS/i, 'http://apioms.wktmro.com');
  }
  if (url.indexOf('/Login') !== -1) {
    return url.replace(/\/Login/i, 'http://apilogin.wktmro.com');
  }
  if (url.indexOf('/Report') !== -1) {
    return url.replace(/\/Report/i, 'http://printandreport.wktmro.com');
  }
  return url;
}

export function getName(arr, code) {
  let newCode = code;
  if (!code || !arr.length) {
    return '';
  }
  if (typeof code !== 'string') {
    newCode = code.toString();
  }
  const filter = arr.find(item => item.Key === newCode);
  return filter ? filter.Value : '';
}

export function validatorPhone(rule, value, callback) {
  if (value && !checkPhone(value)) {
    callback(new Error('手机号格式不正确'));
  } else {
    callback();
  }
}

export function validatorEmail(rule, value, callback) {
  if (value && !chechEmail(value)) {
    callback(new Error('邮箱格式不正确'));
  } else {
    callback();
  }
}

export function getTotal(orderList) {
  let ProfitTotal=0;
  let DocTotal=0;
  let InquiryDocTotalLocal=0; 
  if (orderList.length) {
    orderList.forEach(order => {
      DocTotal += order.LineTotal;
      InquiryDocTotalLocal += order.InquiryLineTotalLocal;
      ProfitTotal += order.ProfitLineTotal
    });
    DocTotal = round(DocTotal, 2);
    InquiryDocTotalLocal = round(InquiryDocTotalLocal, 2);
   
    ProfitTotal = round(ProfitTotal, 2);
  } 
  return {InquiryDocTotalLocal,ProfitTotal,DocTotal} 
}
