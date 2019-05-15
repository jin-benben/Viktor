import { queryRule, removeRule, addRule, updateRule } from './service';

export default {
  namespace: 'staffs',

  state: {
    staffsList: [],
    queryData: {
      Content: {
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
      sidx: 'Code',
      sord: 'Desc',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      if (response.Status === 200) {
        yield put({
          type: 'save',
          payload: { staffsList: response.Content.rows },
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
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
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
    save(state, { payload }) {
      console.log(payload);
      return {
        ...state,
        ...payload,
      };
    },
  },
};
