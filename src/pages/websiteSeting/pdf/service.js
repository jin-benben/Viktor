import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z054/TI_Z05402', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z054/TI_Z05403', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z054/TI_Z05401', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z054/TI_Z05404', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
