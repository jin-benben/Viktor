import request from '@/utils/request';

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
    },
  });
}

export async function updateRule(params) {
  return request('/OMS/TI_Z003/TI_Z00304', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
