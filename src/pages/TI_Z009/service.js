import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/MDM/TI_Z009/TI_Z00902`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z009/TI_Z00903', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM/TI_Z009/TI_Z00901AddorUpdate', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM/TI_Z009/TI_Z00904', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function matchRule(params) {
  return request('/MDM/TI_Z009/TI_Z00907', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function confrimRule(params) {
  return request('/MDM/TI_Z009/TI_Z00908', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySPURule(params) {
  return request(`/MDM/TI_Z011/TI_Z01102`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryHSCodeRule(params) {
  return request(`/MDM/TI_Z036/TI_Z03602`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryFHSCodeRule(params) {
  return request(`/MDM/TI_Z037/TI_Z03702`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
