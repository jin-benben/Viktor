import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM//TI_Z017//TI_Z01703', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM//TI_Z017//TI_Z01701', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM//TI_Z017//TI_Z01704', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
