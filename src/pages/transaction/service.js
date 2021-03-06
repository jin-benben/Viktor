import request from '@/utils/request';

export async function odlnordnRule(params) {
  return request('/Report/ODLNORDN/ODLNORDN01', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function odlnordnLineRule(params) {
  return request('/Report/ODLNORDN/ODLNORDN02', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function odlnordnDetailRule(params) {
  return request('/Report/ODLNORDN/ODLNORDN03', {
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

export async function oinvorinLineRule(params) {
  return request('/Report/OINVORIN/OINVORIN02', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function oinvorinDetailRule(params) {
  return request('/Report/OINVORIN/OINVORIN03', {
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

export async function ordrLineRule(params) {
  return request('/Report/ORDR/ORDR02', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function ordrDetailRule(params) {
  return request('/Report/ORDR/ORDR03', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
