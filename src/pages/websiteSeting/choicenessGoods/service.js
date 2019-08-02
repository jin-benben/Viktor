import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z020/TI_Z02002', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z020/TI_Z02001', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

