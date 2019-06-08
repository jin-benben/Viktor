import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/MDM/TI_Z046/TI_Z04602`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z046/TI_Z04601', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z046/TI_Z04604', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeRule(params) {
  return request('/MDM/TI_Z046/TI_Z04605', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
