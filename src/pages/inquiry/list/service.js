import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/OMS/TI_Z026/TI_Z02606`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/OMS/TI_Z003/TI_Z00303', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/OMS/TI_Z003/TI_Z00301', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/OMS/TI_Z003/TI_Z00304', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
