import {
  querySingleRule,
  addRule,
  updateRule,
  linkmanRule,
  addressRule,
  queryRule,
  qrcodeRule,
} from '../service';

export default {
  namespace: 'companyEdit',

  state: {
    companyDetail: {
      Status: '1',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            companyDetail: response.Content,
          },
        });
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addRule, payload);
      if (callback) callback(response);
    },

    *linkman({ payload, callback }, { call }) {
      const response = yield call(linkmanRule, payload);
      if (callback) callback(response);
    },

    *address({ payload, callback }, { call }) {
      const response = yield call(addressRule, payload);
      if (callback) callback(response);
    },
    *qrcode({ payload, callback }, { call }) {
      const response = yield call(qrcodeRule, payload);
      if (callback) callback(response);
    },

    *exist({ payload, callback }, { call }) {
      const response = yield call(queryRule, payload);
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
