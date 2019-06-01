import { addRule } from '../service';

export default {
  namespace: 'supplierAsk',

  state: {
    orderLineList: [],
  },

  effects: {
    *add({ payload, callback }, { call }) {
      const response = yield call(addRule, payload);
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
