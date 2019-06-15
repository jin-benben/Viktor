import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z048/TI_Z04802', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z048/TI_Z04803', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
