import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z005/TI_Z00502', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z005/TI_Z00501', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z005/TI_Z00504', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
