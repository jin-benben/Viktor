import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/OMS/TI_Z026/TI_Z02606`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function orderLineRule(params) {
  return request(`/OMS/TI_Z026/TI_Z02607`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/OMS/TI_Z026/TI_Z02602', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/OMS/TI_Z026/TI_Z02601', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/OMS/TI_Z026/TI_Z02603', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function cancelRule(params) {
  return request('/OMS/TI_Z026/TI_Z02604', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function confirmRule(params) {
  return request('/OMS/TI_Z026/TI_Z02605', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
