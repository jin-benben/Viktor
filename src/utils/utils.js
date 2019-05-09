/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
const emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
export function isUrl(path) {
  return reg.test(path);
}
export function checkPhone(phone) { // 手机效验
  if(phone.length===11){
    return /^1(3|4|5|7|8)\d{9}$/.test(phone) 
  }
  return false
}
export function chechEmail(email){ // 邮箱效验
  return emailReg.test(email)
}