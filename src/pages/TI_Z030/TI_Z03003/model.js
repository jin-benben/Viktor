import { querySingleRule, cancelRule, confirmRule, costCheckRule } from '../service';

export default {
  namespace: 'agreementPreview',

  state: {
    agreementDetail: {
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
      TI_Z03002: [],
      TI_Z03004: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            agreementDetail: response.Content,
          },
        });
      }
    },
    *cancel({ payload, callback }, { call }) {
      const response = yield call(cancelRule, payload);
      if (callback) callback(response);
    },
    *confirm({ payload, callback }, { call }) {
      const response = yield call(confirmRule, payload);
      if (callback) callback(response);
    },
    *costCheck({ payload, callback }, { call }) {
      const response = yield call(costCheckRule, payload);
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
