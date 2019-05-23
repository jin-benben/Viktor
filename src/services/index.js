import request from '@/utils/request';

export async function getMDMCommonalityRule(params) {
  return request(`/MDM/MDMCommonality/MDMCommonality01`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
