import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z024/TI_Z02402', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z024/TI_Z02403', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
