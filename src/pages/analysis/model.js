import {
  monthlySalesRule,
  monthlyPurchaseRule,
  allSaleRule,
  allPurchaseRule,
  monthlyReceiptRule,
  docProcessRule,
  customerSaleListRule,
  monthlyPaymentRule,
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
    *getHomeData({ payload }, { put, call, all }) {
      const [
        monthlySalesRes,
        monthlyPurchaseRes,
        monthlyReceiptRes,
        docProcessRes,
        monthlyPaymentRes,
      ] = yield all([
        call(monthlySalesRule, payload),
        call(monthlyPurchaseRule, payload),
        call(monthlyReceiptRule, payload),
        call(docProcessRule, payload),
        call(monthlyPaymentRule, payload),
      ]);
      if (monthlySalesRes && monthlySalesRes.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            monthlySalesData: { ...monthlySalesRes.Content },
          },
        });
      }
      if (monthlyPurchaseRes && monthlyPurchaseRes.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            monthlyPurchaseData: { ...monthlyPurchaseRes.Content },
          },
        });
      }
      if (monthlyReceiptRes && monthlyReceiptRes.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            monthlyReceiptData: { ...monthlyReceiptRes.Content },
          },
        });
      }
      if (docProcessRes && docProcessRes.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            docProcessData: { ...docProcessRes.Content },
          },
        });
      }
      if (monthlyPaymentRes && monthlyPaymentRes.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            monthlyPaymentRuleData: { ...monthlyPaymentRes.Content },
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
        yield put({
          type: 'save',
          payload: {
            customerSaleListData: { ...response.Content },
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
        visitData: [],
        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
      };
    },
  },
};