import { querySingleRule, addRule, updateRule } from './service';

export default {
  namespace: 'inquiryEdit',

  state: {
    inquiryDetail: {
      Content: {
        Comment: '',
        SDocStatus: '',
        PDocStatus: '',
        Closed: '',
        ClosedBy: '',
        SourceType: '',
        OrderType: '',
        CardCode: '',
        CardName: '',
        UserID: 0,
        Contacts: '',
        CellphoneNO: '',
        PhoneNO: '',
        Email: '',
        CompanyCode: '',
        DueDate: '',
        ToDate: '',
        InquiryDocTotal: 0,
        DocTotal: 0,
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
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
