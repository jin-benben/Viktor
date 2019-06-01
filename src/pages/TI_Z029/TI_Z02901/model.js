import {
  querySingleRule,
  addRule,
  updateRule,
  cancelRule,
  confirmRule,
  costCheckRule,
  companyRule,
} from '../service';

export default {
  namespace: 'TI_Z029',

  state: {
    orderDetail: {
      Comment: '',
      SourceType: '',
      OrderType: '1',
      DocDate: new Date(),
      CreateDate: new Date(),
      CardCode: '',
      CardName: '',
      Contacts: '',
      CellphoneNO: '',
      PhoneNO: '',
      Email: '',
      DueDate: null,
      ToDate: null,
      InquiryDocTotal: '',
      ProfitTotal: '',
      DocTotal: '',
      ProvinceID: '',
      Province: '',
      CityID: '',
      City: '',
      AreaID: '',
      Area: '',

      Address: '',
      NumAtCard: '',
      ClosedDate: '2019-05-25',
      IsInquiry: '',
      TI_Z02902: [],
      TI_Z02904: [],
    },
    linkmanList: [],
    addList: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            orderDetail: response.Content,
          },
        });
        yield put({
          type: 'company',
          payload: {
            Content: { Code: response.Content.CardCode },
          },
        });
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addRule, payload);
      if (callback) callback(response);
    },
    *company({ payload }, { put, call }) {
      const response = yield call(companyRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            addList: response.Content.TI_Z00603List,
            linkmanList: response.Content.TI_Z00602List,
          },
        });
      }
    },
    *costCheck({ payload, callback }, { call }) {
      const response = yield call(costCheckRule, payload);
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
