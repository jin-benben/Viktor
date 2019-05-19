import { querySingleRule, addRule, updateRule } from '../service';

export default {
  namespace: 'skuDetail',

  state: {
    skuDetailInfo: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      if (response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            skuDetailInfo: response.Content,
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
