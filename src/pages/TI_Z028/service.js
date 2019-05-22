import request from '@/utils/request';

export async function TI_Z02906(params) {
  return request(`/OMS/TI_Z029/TI_Z02906`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function TI_Z02907(params) {
  return request(`/OMS/TI_Z029/TI_Z02907`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function querySingleRule(params) {
  return request('/OMS/TI_Z029/TI_Z02903', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/OMS/TI_Z029/TI_Z02901', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/OMS/TI_Z029/TI_Z02904', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
