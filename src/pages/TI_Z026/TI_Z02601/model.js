import { querySingleRule, addRule, updateRule, cancelRule, confirmRule } from '../service';

export default {
  namespace: 'inquiryEdit',

  state: {
    inquiryDetail: {
      Comment: '',
      SDocStatus: '',
      PDocStatus: '',
      Closed: '',
      ClosedBy: '',
      SourceType: '1',
      OrderType: '1',
      DocDate: new Date(),
      CreateDate: new Date(),
      CardCode: '',
      CardName: '',
      UserID: '1',
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
    *cancel({ payload, callback }, { call }) {
      const response = yield call(cancelRule, payload);
      if (callback) callback(response);
    },
    *confirm({ payload, callback }, { call }) {
      const response = yield call(confirmRule, payload);
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
