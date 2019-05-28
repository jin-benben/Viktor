import request from '@/utils/request';

export async function getMDMCommonalityRule(params) {
  return request(`/MDM/MDMCommonality/MDMCommonality01`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function loginRule(params) {
  return request(`/Login/TI_Z004/TI_Z00402`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function loginOutRule(params) {
  return request(`/Login/TI_Z004/TI_Z00403`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function tokenOutRule(params) {
  return request(`/Login/TI_Z004/TI_Z00404`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
