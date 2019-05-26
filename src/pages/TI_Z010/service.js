import request from '@/utils/request';

export async function queryRule() {
  return request(`/MDM/TI_Z010/TI_Z01002`, {
    method: 'POST',
    data: {
      Content: {},
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z010/TI_Z01003', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z010/TI_Z01001', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z010/TI_Z01004', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
