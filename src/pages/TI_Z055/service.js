import request from '@/utils/request';

export async function queryRule(params) {
  return request('/OMS/TI_Z055/TI_Z05502', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/OMS/TI_Z055/TI_Z05501', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
