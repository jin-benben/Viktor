import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z007/TI_Z00702', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z007/TI_Z00703', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function linkmanRule(params) {
  return request('/MDM/TI_Z007/TI_Z00705', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addbrandRule(params) {
  return request('/MDM/TI_Z007/TI_Z00706', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z007/TI_Z00701', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function deletebrandRule(params) {
  return request('/MDM/TI_Z007/TI_Z00707', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z007/TI_Z00704', {
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
