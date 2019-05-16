import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/OMS/TI_Z026/TI_Z02606`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
