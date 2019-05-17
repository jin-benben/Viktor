import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/MDM/TI_Z037/TI_Z03702`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z037/TI_Z03701', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z037/TI_Z03704', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
