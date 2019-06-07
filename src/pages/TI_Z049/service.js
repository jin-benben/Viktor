import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/MDM/TI_Z049/TI_Z04902`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z049/TI_Z04903', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z049/TI_Z04901', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z049/TI_Z04904', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeRule(params) {
  return request('/MDM/TI_Z049/TI_Z04905', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
