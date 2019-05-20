import { querySingleRule, addRule, updateRule, cancelRule, confirmRule } from './service';

export default {
  namespace: 'inquiryEdit',

  state: {
    inquiryDetail: {
      Comment: '',
      SDocStatus: '',
      PDocStatus: '',
      Closed: '',
      ClosedBy: '',
      SourceType: '',
      OrderType: '',
      DocDate: null,
      CreateDate: null,
      CardCode: '',
      CardName: '',
      UserID: '',
      Contacts: '',
      CellphoneNO: '',
      PhoneNO: '',
      Email: '',
      CompanyCode: '',
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
      StreetID: '',
      Street: '',
      Address: '',
      NumAtCard: '',
      Owner: '',
      IsInquiry: '',
      TI_Z02602: [],
      TI_Z02603: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      if (response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            inquiryDetail: response.Content,
          },
        });
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addRule, payload);
      if (callback) callback(response);
    },

    *update({ payload, callback }, { call }) {
      const response = yield call(updateRule, payload);
      if (callback) callback(response);
    },
    *cancel({ payload, callback }, { call, put }) {
      const response = yield call(cancelRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *confirm({ payload, callback }, { call, put }) {
      const response = yield call(confirmRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
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
