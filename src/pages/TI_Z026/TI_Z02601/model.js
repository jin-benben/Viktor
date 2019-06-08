import {
  querySingleRule,
  queryHSCodeRule,
  addRule,
  updateRule,
  cancelRule,
  confirmRule,
  companyRule,
} from '../service';

export default {
  namespace: 'inquiryEdit',

  state: {
    inquiryDetail: {
      Comment: '',
      SourceType: '1',
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
      InquiryDocTotal: 0,
      InquiryDocTotalLocal: 0,
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
      TI_Z02602: [],
      TI_Z02603: [],
      TI_Z02605: [],
    },
    pagination: {
      Content: {
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
      sidx: 'Code',
      sord: 'Desc',
    },
    addList: [],
    linkmanList: [],
    hscodeList: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            inquiryDetail: response.Content,
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
