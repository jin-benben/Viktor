import { queryRule,addRule } from './service';

export default {
  namespace: 'choicenessBrand',

  state: {},

  effects: {
    *fetch({ payload,callback }, { call }) {
      const response = yield call(queryRule, payload);
      if (callback) callback(response);
      
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addRule, payload);
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
