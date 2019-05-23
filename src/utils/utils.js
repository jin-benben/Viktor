/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
const emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
export function isUrl(path) {
  return reg.test(path);
}
export function checkPhone(phone) {
  // 手机效验
  if (phone.length === 11) {
    return /^1(3|4|5|7|8)\d{9}$/.test(phone);
  }
  return false;
}
export function chechEmail(email) {
  // 邮箱效验
  return emailReg.test(email);
}

export function requestUrl(url) {
  if (url.indexOf('/MDM') !== -1) {
    return url.replace(/\/MDM/i, 'http://47.104.65.49:8002');
  }
  if (url.indexOf('/OMS') !== -1) {
    return url.replace(/\/OMS/i, 'http://47.104.65.49:8001');
  }
  return url;
}

export function getName(arr, code) {
  let name;
  arr.some(item => {
    if (item.Key === code) {
      name = item.Value;
      return true;
    }
  });
  return name;
}
