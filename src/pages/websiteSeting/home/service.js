import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z019/TI_Z01902', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z019/TI_Z01903', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z019/TI_Z01901', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z019/TI_Z01904', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
