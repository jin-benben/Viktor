import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z056/TI_Z05602', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z056/TI_Z05603', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z056/TI_Z05601', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
