import { querySingleRule, addRule, updateRule, linkmanRule, addressRule } from '../service';

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
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
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
