import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z021/TI_Z02102', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z021/TI_Z02101', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
