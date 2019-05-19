import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/MDM/TI_Z014/TI_Z01402`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z014/TI_Z01403', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z014/TI_Z01401', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z014/TI_Z01404', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function setRule(params) {
  return request('/MDM/TI_Z015/TI_Z01501', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getTreeRule(params) {
  return request('/MDM/TI_Z015/TI_Z01502', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
