import { message } from 'antd';
import { querySingleRule, addRule, updateRule, linkmanRule, addbrandRule } from '../service';

export default {
  namespace: 'supplierEdit',

  state: {
    supplierDetail: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      if (response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            supplierDetail: response.Content,
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

    *linkman({ payload, callback }, { call, put }) {
      const response = yield call(linkmanRule, payload);
      if (response.Status === 200) {
        message.success('添加成功');
        if (callback) callback();
        yield put({
          type: 'fetch',
          payload,
        });
      }
    },

    *addbrand({ payload, callback }, { call, put }) {
      const response = yield call(addbrandRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
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