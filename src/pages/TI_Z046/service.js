import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/MDM/TI_Z044/TI_Z04402`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z044/TI_Z04403', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z044/TI_Z04401', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z044/TI_Z04404', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeRule(params) {
  return request('/MDM/TI_Z044/TI_Z04405', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
