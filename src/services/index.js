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
export async function supplierRule() {
  return request('/MDM/TI_Z007/TI_Z00702', {
    method: 'POST',
    data: {
      Content: {
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
      sidx: 'Code',
      sord: 'Desc',
    },
  });
}
export async function customerRule() {
  return request('/MDM/TI_Z006/TI_Z00602', {
    method: 'POST',
    data: {
      Content: {
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
      sidx: 'Code',
      sord: 'Desc',
    },
  });
}
