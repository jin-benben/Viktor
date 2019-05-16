import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/MDM/TI_Z009/TI_Z00902`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z009/TI_Z00903', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z009/TI_Z00901', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z009/TI_Z00904', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
