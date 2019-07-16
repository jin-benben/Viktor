import request from '@/utils/request';

export async function queryRule(params) {
  return request('/MDM/TI_Z032/TI_Z03202', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySingleRule(params) {
  return request('/MDM/TI_Z032/TI_Z03203', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
