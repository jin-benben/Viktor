import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/MDM/TI_Z042/TI_Z04202`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z042/TI_Z04203', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z042/TI_Z04201', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z042/TI_Z04204', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeRule(params) {
  return request('/MDM/TI_Z042/TI_Z04205', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
