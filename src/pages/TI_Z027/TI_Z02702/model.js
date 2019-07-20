import { querySingleRule, updateRule, cancelRule, supplierRule } from '../service';
import { uploadRule } from '../../TI_Z026/service';

export default {
  namespace: 'supplierAskDetail',

  state: {},

  effects: {
    *fetch({ payload,callback }, { call }) {
      const response = yield call(querySingleRule, payload);
      if (callback) callback(response);
    },
    *supplier({ payload,callback }, { call }) {
      const response = yield call(supplierRule, payload);
      if (callback) callback(response);
    },
    *upload({ payload, callback }, { call }) {
      const response = yield call(uploadRule, payload);
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
