import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z004/TI_Z00402', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z004/TI_Z00401', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z004/TI_Z00404', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
