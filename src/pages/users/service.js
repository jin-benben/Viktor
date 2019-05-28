import request from '@/utils/request';

export async function loginRule(params) {
  return request(`/OMS/TI_Z030/TI_Z03006`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function TI_Z03007(params) {
  return request(`/OMS/TI_Z030/TI_Z03007`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function querySingleRule(params) {
  return request('/OMS/TI_Z030/TI_Z03002', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/OMS/TI_Z030/TI_Z03001', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
