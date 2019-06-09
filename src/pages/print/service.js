import request from '@/utils/request';

export async function queryRule(params) {
  return request('/Print/TI_Z045/TI_Z04502', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/Print/TI_Z045/TI_Z04503', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getPrintRule(params) {
  return request('/Print/TI_Z045/TI_Z045Print01', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function savePrintRule(params) {
  return request('/Print/TI_Z045/TI_Z04501', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
