import request from '@/utils/request';

export async function monthlySalesRule(params) {
  return request('/Report/HomePage/MonthlySales', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function monthlyPurchaseRule(params) {
  return request('/Report/HomePage/MonthlyPurchase', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function allSaleRule(params) {
  return request('/Report/HomePage/AllSale', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function allPurchaseRule(params) {
  return request('/Report/HomePage/AllPurchase', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function monthlyReceiptRule(params) {
  return request('/Report/HomePage/MonthlyReceipt', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function docProcessRule(params) {
  return request('/Report/HomePage/DocProcess', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function customerSaleListRule(params) {
  return request('/Report/HomePage/CustomerSaleList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function monthlyPaymentRule(params) {
  return request('/Report/HomePage/MonthlyPayment', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
