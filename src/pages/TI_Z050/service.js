import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z050/TI_Z05002', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z050/TI_Z05001', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z050/TI_Z05004', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeRule(params) {
  return request('/MDM/TI_Z050/TI_Z05005', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
