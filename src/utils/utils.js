/* eslint-disable consistent-return */
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
const emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,7}$/;
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
    return url.replace(/\/MDM/i, 'http://47.104.65.49:8088');
  }
  if (url.indexOf('/OMS') !== -1) {
    return url.replace(/\/OMS/i, 'http://47.104.65.49:8090');
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
