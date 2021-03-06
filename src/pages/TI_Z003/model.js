import { queryRule, addRule, updateRule, querySingleRule, reloadRule } from './service';

export default {
  namespace: 'organization',

  state: {
    treeData: [],
    singleInfo: {
      Code: '',
      Name: '',
      Comment: '',
      Type: '2',
      FatherCode: '',
      ComapnyCode: '',
      DDCode: 0,
      Level: 0,
    },
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryRule);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            treeData: response.Content,
          },
        });
      }
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
              Comment: '',
              FatherCode: response.Content.Code,
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
    *reload({ callback }, { call }) {
      const response = yield call(reloadRule);
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
