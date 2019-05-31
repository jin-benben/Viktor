import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/OMS/ODLN/ODLN02`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function confirmRule(params) {
  return request('/OMS//ODLN/ODLN01', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
