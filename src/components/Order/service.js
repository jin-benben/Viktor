import request from '@/utils/request';

export async function queryTIZ026Rule(params) {
  return request('/Report/TI_Z026/TI_Z02611', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryTIZ027Rule(params) {
  return request('/Report/TI_Z027/TI_Z02708', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryTIZ045Rule(params) {
  return request('/Report/TI_Z045/TI_Z04504', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryTIZ047Rule(params) {
  return request('/Report/TI_Z047/TI_Z04706', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
