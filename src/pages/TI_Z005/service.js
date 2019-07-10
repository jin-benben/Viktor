import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z005/TI_Z00502', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z005/TI_Z00501', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z005/TI_Z00504', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z005/TI_Z00503', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function supplierRule(params) {
  return request('/MDM/TI_Z007/TI_Z00702', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function skuRule(params) {
  return request(`/MDM/TI_Z009/TI_Z00902`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function attachRule(params) {
  return request('/OMS/TI_Z052/TI_Z05201', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
