import { queryRule, addRule, updateRule, querySingleRule } from './service';

export default {
  namespace: 'authority',

  state: {
    treeData: [],
    singleInfo: {
      Code: '',
      Name: '',
      PCode: '',
      Level: 0,
      Type: '',
      Action: '',
      Method: '',
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
      const { method, Content } = payload;
      const response = yield call(querySingleRule, { Content });
      if (method === 'A') {
        yield put({
          type: 'save',
          payload: {
            singleInfo: {
              ...response.Content,
              Code: '',
              Name: '',
              Type: '',
              Action: '',
              Method: '',
              PCode: response.Content.Code,
              Level: response.Content.Level + 1,
            },
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            singleInfo: response.Content,
          },
        });
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addRule, payload);
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
