import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/MDM/TI_Z011/TI_Z01102`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z011/TI_Z01103', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z011/TI_Z01101', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z011/TI_Z01104', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
