import request from '@/utils/request';

export async function queryRule(params) {
  return request('/Print/TI_Z045/TI_Z04502', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/Print/TI_Z045/TI_Z04503', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
