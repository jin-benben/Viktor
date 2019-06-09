import request from '@/utils/request';

export async function queryRule(params) {
  return request('/Print/TI_Z047/TI_Z04702', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/Print/TI_Z047/TI_Z04703', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
