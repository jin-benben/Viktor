import request from '@/utils/request';

export async function odlnordnRule(params) {
  return request('/Report/ODLNORDN/ODLNORDN01', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function oinvorinRule(params) {
  return request('/Report/OINVORIN/OINVORIN01', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function orctovpmRule(params) {
  return request('/Report/ORCTOVPM/ORCTOVPM01', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function ordrRule(params) {
  return request('/Report/ORDR/ORDR01', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
