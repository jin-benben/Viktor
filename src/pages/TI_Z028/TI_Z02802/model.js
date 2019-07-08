import { querySingleRule } from '../service';

export default {
  namespace: 'TI_Z02802',
  state: {
    purchaseDetail: {},
  },
  effects: {
    *fetch({ payload, callback }, { call }) {
      const response = yield call(querySingleRule, payload);
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
