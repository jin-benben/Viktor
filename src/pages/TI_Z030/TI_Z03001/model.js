import {
  querySingleRule,
  addRule,
  updateRule,
  cancelRule,
  confirmRule,
  costCheckRule,
  companyRule,
  queryBaseEntryleRule,
} from '../service';
import { uploadRule } from '../../TI_Z026/service';

export default {
  namespace: 'agreementEdit',

  state: {},

  effects: {
    *fetch({ payload, callback }, { call }) {
      const response = yield call(querySingleRule, payload);
      if (callback) callback(response);
    },
    *getBaseEntry({ payload, callback }, { call }) {
      const response = yield call(queryBaseEntryleRule, payload);
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
    *confirm({ payload, callback }, { call }) {
      const response = yield call(confirmRule, payload);
      if (callback) callback(response);
    },
    *costCheck({ payload, callback }, { call }) {
      const response = yield call(costCheckRule, payload);
      if (callback) callback(response);
    },
    *upload({ payload, callback }, { call }) {
      const response = yield call(uploadRule, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      console.log(action.payload);
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
