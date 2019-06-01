import { querySingleRule, cancelRule } from '../service';

export default {
  namespace: 'SalesQuotationPreview',

  state: {
    SalesQuotationDetail: {
      Comment: '',
      SDocStatus: '',
      PDocStatus: '',
      Closed: '',
      ClosedBy: '',
      SourceType: '1',
      OrderType: '1',
      DocDate: '',
      CreateDate: '',
      CardCode: '',
      CardName: '',
      Contacts: '',
      CellphoneNO: '',
      PhoneNO: '',
      Email: '',
      DueDate: null,
      ToDate: null,
      InquiryDocTotal: '',
      DocTotal: '',
      ProvinceID: '',
      Province: '',
      CityID: '',
      City: '',
      AreaID: '',
      Area: '',

      Address: '',
      NumAtCard: '',
      IsInquiry: '',
      TI_Z02902: [],
      TI_Z02903: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            SalesQuotationDetail: response.Content,
          },
        });
      }
    },
    *cancel({ payload, callback }, { call }) {
      const response = yield call(cancelRule, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
