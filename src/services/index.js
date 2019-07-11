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

export async function processorRule(params) {
  return request('/MDM/ERPSelect/OSLP', {
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

export async function changepasswordRule(params) {
  return request(`/Login/TI_Z004/TI_Z00401`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function ddLoginRule(params) {
  return request(`/Login/TI_Z004/TI_Z00405`, {
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

export async function authorityRule() {
  return request(`/MDM/TI_Z004/TI_Z00410`, {
    method: 'POST',
    data: {
      Content: '',
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

export async function brandRule() {
  return request('/MDM/TI_Z005/TI_Z00502', {
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

export async function hscodeRule() {
  return request('/MDM/TI_Z036/TI_Z03602', {
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

export async function categoryRule() {
  return request(`/MDM/TI_Z010/TI_Z01002`, {
    method: 'POST',
    data: {
      Content: {},
    },
  });
}
