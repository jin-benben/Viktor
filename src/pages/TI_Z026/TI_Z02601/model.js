import {
  querySingleRule,
  addRule,
  updateRule,
  cancelRule,
  uploadRule,
  companyRule,
} from '../service';

export default {
  namespace: 'inquiryEdit',

  state: {},

  effects: {
    *fetch({ payload, callback }, { call }) {
      const response = yield call(querySingleRule, payload);
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addRule, payload);
      if (callback) callback(response);
    },
    *company({ payload, callback }, { call }) {
      const response = yield call(companyRule, payload);
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
    *upload({ payload, callback }, { call }) {
      const response = yield call(uploadRule, payload);
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
