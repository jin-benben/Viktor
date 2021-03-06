import request from '@/utils/request';

export async function queryRule(params) {
  return request('/Report/TI_Z047/TI_Z04702', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/Report/TI_Z047/TI_Z04703', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function sendTestRule(params) {
  return request('/Report/TI_Z047/TI_Z04705', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function saveSendRule(params) {
  return request('/Report/TI_Z047/TI_Z04701', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function sendEmailRule(params) {
  return request('/Report/TI_Z047/TI_Z04704', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getSendRule(params) {
  return request('/Report/TI_Z047/TI_Z047Email01', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
