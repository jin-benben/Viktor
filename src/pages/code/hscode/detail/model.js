import { querySingleRule, updateRule } from '../service';

export default {
  namespace: 'hscodeDetail',

  state: {
    hsCodeInfo: {
      Code: '',
      Name: '',
      U_VatRate: '',
      U_VatRateOther: '',
      U_Elements: '',
      TI_Z03602: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            hsCodeInfo: response.Content,
          },
        });
      }
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
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
