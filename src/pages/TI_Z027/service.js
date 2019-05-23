import request from '@/utils/request';

export async function TI_Z02706(params) {
  return request(`/OMS/TI_Z027/TI_Z02706`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function TI_Z02707(params) {
  return request(`/OMS/TI_Z027/TI_Z02707`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function querySingleRule(params) {
  return request('/OMS/TI_Z027/TI_Z02702', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/OMS/TI_Z027/TI_Z02701', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/OMS/TI_Z027/TI_Z02703', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function cancelRule(params) {
  return request('/OMS/TI_Z027/TI_Z02704', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
