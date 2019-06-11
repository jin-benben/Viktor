import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z022/TI_Z02202', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z022/TI_Z02203', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
