import request from '@/utils/request';

export async function TI_Z02806(params) {
  return request(`/OMS/TI_Z028/TI_Z02806`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function TI_Z02807(params) {
  return request(`/OMS/TI_Z028/TI_Z02807`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function TI_Z02803(params) {
  return request('/OMS/TI_Z028/TI_Z02803', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/OMS/TI_Z028/TI_Z02801', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function TI_Z02805(params) {
  return request('/OMS/TI_Z028/TI_Z02805', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function TI_Z02804(params) {
  return request('/OMS/TI_Z028/TI_Z02804', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
