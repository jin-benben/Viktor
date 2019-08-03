import { queryRule, addRule, updateRule } from './service';

export default {
  namespace: 'articleEdit',

  state: {},

  effects: {
    *fetch({ payload, callback }, { call }) {
      const response = yield call(queryRule, payload);
      if (callback) callback(response);
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
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
