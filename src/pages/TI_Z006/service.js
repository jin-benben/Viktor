import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z006/TI_Z00602', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z006/TI_Z00603', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function linkmanRule(params) {
  return request('/MDM/TI_Z006/TI_Z00605', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addressRule(params) {
  return request('/MDM/TI_Z006/TI_Z00606', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z006/TI_Z00601', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z006/TI_Z00604', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function qrcodeRule(params) {
  return request('/MDM/TI_Z032/TI_Z03201', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
