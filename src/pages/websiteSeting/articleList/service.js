import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z017/TI_Z01702', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z017/TI_Z01703', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
