import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/MDM/TI_Z036/TI_Z03602`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z036/TI_Z03601', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z036/TI_Z03604', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z036/TI_Z03603', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addOrignRule(params) {
  return request('/MDM/TI_Z036/TI_Z03605', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
