import {
  monthlySalesRule,
  monthlyPurchaseRule,
  allSaleRule,
  allPurchaseRule,
  monthlyReceiptRule,
  docProcessRule,
  customerSaleListRule,
  monthlyPaymentRule,
  noDocProcessRule,
} from './service';

export default {
  namespace: 'analysis',

  state: {
    monthlySalesData: {
      DocTotal: 0, // 月销售总计
      MonthRate: 0, // 销售月同比
      DayRate: 0, // 销售天同比
      DayDocTotal: 0, // 金额销售额
      QuoteDocTotal: 0, // 月报价总计
      QuoteMonthRate: 0, // 报价周同比
      QuoteDayRate: 0, // 报价天同比
      QuoteDayDocTotal: 0, // 金额销售额
    },
    monthlyPurchaseData: {
      DocTotal: 0, // 月采购总计
      MonthRate: 0, // 采购月同比
      DayRate: 0, // 采购天同比
      DayDocTotal: 0, // 金额采购额
    },
    allSaleData: {
      MonthSalesTotalList: [], //  每月销售额
      SalesPersonTotalList: [], // 销售员销售额列表
    },
    allPurchaseData: {
      MonthPurchaseTotalList: [], //  每月采购额
      BrandTotalList: [], //  品牌列表
    },
    monthlyReceiptData: {
      DocTotal: 0, // 月销售总计
      DayDocTotal: 0, // 金额销售额
      DayReceiptList: [], // 每天收款列表
    },
    docProcessData: {
      PDocCount: 0, // 采购单据已处理行数
      SDocCount: 0, // 销售单据已处理行数
      SCount1: 0,
      SCount2: 0,
      SCount3: 0,
      PCount1: 0,
      PCount2: 0,
      PUserDocInfo: [], // 采购单据已处理行数人员明细
      SUserDocInfo: [], // 销售单据已处理行数人员明细
    },
    noDocProcessData: {
      PDocCount: 0, // 采购单据未处理行数
      SDocCount: 0, // 销售单据未处理行数
      PUserDocInfo: [], // 采购单据未处理行数人员明细
      SUserDocInfo: [], // 销售单据未处理行数人员明细
    },
    customerSaleListData: [],
    monthlyPaymentRuleData: {
      DocTotal: 0, // 月销售总计
      DayDocTotal: 0, // 金额销售额
      DayPaymentList: [], // 每天付款列表
    },

    loading: false,
  },

  effects: {
    *getHomeData({ payload }, { put }) {
      yield put({ type: 'getnoDocProcess', payload });
      yield put({ type: 'getmonthlyPayment', payload });
      yield put({ type: 'getdocProcess', payload });
      yield put({ type: 'getmonthlyReceipt', payload });
      yield put({ type: 'getmonthlyPurchase', payload });
      yield put({ type: 'getmonthlySales', payload });
    },
    *getnoDocProcess({ payload }, { call, put }) {
      const nodocProcessRes = yield call(noDocProcessRule, payload);
      if (nodocProcessRes && nodocProcessRes.Status === 200) {
        const { PUserDocInfo, SUserDocInfo, PDocCount, SDocCount } = nodocProcessRes.Content;
        const newPUserDocInfo = PUserDocInfo.map((item, index) => {
          return { key: index + 1, ...item, y: item.y * 1 };
        });
        const newSUserDocInfo = SUserDocInfo.map((item, index) => {
          return { key: index + 1, ...item, y: item.y * 1 };
        });

        yield put({
          type: 'save',
          payload: {
            noDocProcessData: {
              PDocCount,
              SDocCount,
              PUserDocInfo: newPUserDocInfo,
              SUserDocInfo: newSUserDocInfo,
            },
          },
        });
      }
    },
    *getmonthlyPayment({ payload }, { call, put }) {
      const monthlyPaymentRes = yield call(monthlyPaymentRule, payload);
      if (monthlyPaymentRes && monthlyPaymentRes.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            monthlyPaymentRuleData: { ...monthlyPaymentRes.Content },
          },
        });
      }
    },
    *getdocProcess({ payload }, { call, put }) {
      const docProcessRes = call(docProcessRule, payload);
      if (docProcessRes && docProcessRes.Status === 200) {
        const { PUserDocInfo, SUserDocInfo } = docProcessRes.Content;
        const newPUserDocInfo = PUserDocInfo.map((item, index) => {
          return { key: index + 1, ...item, y: item.Total * 1, x: item.Name };
        });
        const newSUserDocInfo = SUserDocInfo.map((item, index) => {
          return { key: index + 1, ...item, y: item.Total * 1, x: item.Name };
        });

        yield put({
          type: 'save',
          payload: {
            docProcessData: {
              ...docProcessRes.Content,
              PUserDocInfo: newPUserDocInfo,
              SUserDocInfo: newSUserDocInfo,
            },
          },
        });
      }
    },
    *getmonthlyReceipt({ payload }, { call, put }) {
      const monthlyReceiptRes = yield call(monthlyReceiptRule, payload);
      if (monthlyReceiptRes && monthlyReceiptRes.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            monthlyReceiptData: { ...monthlyReceiptRes.Content },
          },
        });
      }
    },
    *getmonthlyPurchase({ payload }, { call, put }) {
      const monthlyPurchaseRes = yield call(monthlyPurchaseRule, payload);
      if (monthlyPurchaseRes && monthlyPurchaseRes.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            monthlyPurchaseData: { ...monthlyPurchaseRes.Content },
          },
        });
      }
    },
    *getmonthlySales({ payload }, { call, put }) {
      const monthlySalesRes = yield call(monthlySalesRule, payload);
      if (monthlySalesRes && monthlySalesRes.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            monthlySalesData: { ...monthlySalesRes.Content },
          },
        });
      }
    },
    *getAllSaleData({ payload }, { call, put }) {
      const response = yield call(allSaleRule, payload);
      if (response && response.Status === 200) {
        const { MonthSalesTotalList, SalesPersonTotalList } = response.Content;
        yield put({
          type: 'save',
          payload: {
            allSaleData: {
              SalesPersonTotalList: SalesPersonTotalList || [],
              MonthSalesTotalList: MonthSalesTotalList || [],
            },
          },
        });
      }
    },
    *getCustomerSaleList({ payload }, { call, put }) {
      const response = yield call(customerSaleListRule, payload);
      if (response && response.Status === 200) {
        const { CustomerSaleList } = response.Content;
        yield put({
          type: 'save',
          payload: {
            customerSaleListData: CustomerSaleList || [],
          },
        });
      }
    },
    *getAllPurchaseData({ payload }, { call, put }) {
      const response = yield call(allPurchaseRule, payload);
      if (response && response.Status === 200) {
        const { MonthPurchaseTotalList, BrandTotalList } = response.Content;
        yield put({
          type: 'save',
          payload: {
            allPurchaseData: {
              MonthPurchaseTotalList: MonthPurchaseTotalList || [],
              BrandTotalList: BrandTotalList || [],
            },
          },
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        monthlySalesData: {
          DocTotal: 0, // 月销售总计
          MonthRate: 0, // 销售月同比
          DayRate: 0, // 销售天同比
          DayDocTotal: 0, // 金额销售额
          QuoteDocTotal: 0, // 月报价总计
          QuoteMonthRate: 0, // 报价周同比
          QuoteDayRate: 0, // 报价天同比
          QuoteDayDocTotal: 0, // 金额销售额
        },
        monthlyPurchaseData: {
          DocTotal: 0, // 月采购总计
          MonthRate: 0, // 采购月同比
          DayRate: 0, // 采购天同比
          DayDocTotal: 0, // 金额采购额
        },
        allSaleData: {
          MonthSalesTotalList: [], //  每月销售额
          SalesPersonTotalList: [], // 销售员销售额列表
        },
        allPurchaseData: {
          MonthPurchaseTotalList: [], //  每月采购额
          BrandTotalList: [], //  品牌列表
        },
        monthlyReceiptData: {
          DocTotal: 0, // 月销售总计
          DayDocTotal: 0, // 金额销售额
          DayReceiptList: [], // 每天收款列表
        },
        docProcessData: {
          SCount1: 0,
          SCount2: 0,
          SCount3: 0,
          PCount1: 0,
          PCount2: 0,
          PDocCount: 0, // 采购单据已处理行数
          SDocCount: 0, // 销售单据已处理行数
          PUserDocInfo: [], // 采购单据已处理行数人员明细
          SUserDocInfo: [], // 销售单据已处理行数人员明细
        },
        noDocProcessData: {
          PDocCount: 0, // 采购单据未处理行数
          SDocCount: 0, // 销售单据未处理行数
          PUserDocInfo: [], // 采购单据未处理行数人员明细
          SUserDocInfo: [], // 销售单据未处理行数人员明细
        },
        customerSaleListData: [],
        monthlyPaymentRuleData: {
          DocTotal: 0, // 月销售总计
          DayDocTotal: 0, // 金额销售额
          DayPaymentList: [], // 每天付款列表
        },
      };
    },
  },
};
