import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z051/TI_Z05102', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z051/TI_Z05101', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z051/TI_Z05104', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeRule(params) {
  return request('/MDM/TI_Z051/TI_Z05105', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
