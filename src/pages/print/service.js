import request from '@/utils/request';

export async function queryRule(params) {
  console.log(params);
  return request('/Print/TI_Z045/TI_Z04502', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeRule(params) {
  return request('/api/table-list', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/Print/TI_Z045/TI_Z04501', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/Print/TI_Z045/TI_Z04504', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
