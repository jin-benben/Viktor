import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/OMS/OINV/OINV02`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function confirmRule(params) {
  return request('/OMS/OINV/OINV01', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function savePrintRule(params) {
  return request('/MDM/TI_Z048/TI_Z04801', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function companyRule(params) {
  return request('/MDM/TI_Z006/TI_Z00603', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
