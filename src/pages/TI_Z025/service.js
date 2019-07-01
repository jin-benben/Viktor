import request from '@/utils/request';

export async function uploadSearchRule(params) {
  return request(`/OMS/TI_Z025/TI_Z02506`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function uploadRule(params) {
  return request(`/OMS/TI_Z025/TI_Z02507`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function searchRule(params) {
  return request('/OMS/TI_Z025/TI_Z02502', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function approveSearchRule(params) {
  return request('/OMS/TI_Z025/TI_Z02505', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function approveRule(params) {
  return request('/OMS/TI_Z025/TI_Z02504', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
