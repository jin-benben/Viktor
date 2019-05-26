import { queryRule, addRule, updateRule, querySingleRule } from './service';

export default {
  namespace: 'category',

  state: {
    treeData: [],
    singleInfo: {
      Code: '',
      Name: '',
      FatherCode: '',
      Status: '1',
      Level: 0,
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: {
          treeData: response.Content,
        },
      });
    },
    *single({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      yield put({
        type: 'save',
        payload: {
          singleInfo: response.Content,
        },
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
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
