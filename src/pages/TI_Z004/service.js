import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z004/TI_Z00402', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z004/TI_Z00401', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z004/TI_Z00404', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getControllerRule(params) {
  return request('/MDM/TI_Z004/TI_Z00405', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function setLoadingRule(params) {
  return request('/MDM/TI_Z004/TI_Z00408', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getSalerRule(params) {
  return request('/MDM/TI_Z004/TI_Z00407', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getDepartmentRule(params) {
  return request('/MDM/TI_Z004/TI_Z00406', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getDepartmentTreeRule() {
  return request(`/MDM/TI_Z003/TI_Z00302`, {
    method: 'POST',
    data: {
      Content: {},
    },
  });
}
