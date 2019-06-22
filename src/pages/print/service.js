import request from '@/utils/request';

export async function queryRule(params) {
  return request('/Report/TI_Z045/TI_Z04502', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/Report/TI_Z045/TI_Z04503', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getReportRule(params) {
  console.log(params);
  return request('/Report/TI_Z045/TI_Z045Print01', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function saveReportRule(params) {
  return request('/Report/TI_Z045/TI_Z04501', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
