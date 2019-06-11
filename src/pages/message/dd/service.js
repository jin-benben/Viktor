import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z023/TI_Z02302', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z023/TI_Z02303', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
