import request from '@/utils/request';

export async function queryRule() {
  return request(`/MDM/TI_Z013/TI_Z01302`, {
    method: 'POST',
    data: {
      Content: {},
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z013/TI_Z01303', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z013/TI_Z01301', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z013/TI_Z01304', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
