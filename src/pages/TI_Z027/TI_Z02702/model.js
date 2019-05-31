import { querySingleRule, addRule, updateRule, cancelRule, supplierRule } from '../service';

export default {
  namespace: 'supplierAskDetail',

  state: {
    supplierAskDetailInfo: {
      Comment: '',
      SourceType: '',
      OrderType: '',
      DocDate: null,
      CreateDate: null,
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
      NumAtCard: '',
      Owner: '',
      IsInquiry: '',
      TI_Z02702: [],
      TI_Z02703: [],
    },
    linkmanList: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'supplier',
          payload: {
            Content: {
              Code: response.Content.CardCode,
            },
          },
        });
        yield put({
          type: 'save',
          payload: {
            supplierAskDetailInfo: response.Content,
          },
        });
      }
    },
    *supplier({ payload }, { call, put }) {
      const response = yield call(supplierRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            linkmanList: response.Content.TI_Z00702List,
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
