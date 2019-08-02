import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM//TI_Z018//TI_Z01802', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/MDM//TI_Z018//TI_Z01801', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params) {
  return request('/MDM//TI_Z018//TI_Z01804', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeRule(params) {
  return request('/MDM//TI_Z018//TI_Z01805', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
