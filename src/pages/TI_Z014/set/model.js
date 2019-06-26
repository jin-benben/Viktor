import { getTreeRule, setRule, queryTreeRule } from '../service';

export default {
  namespace: 'authoritySet',

  state: {
    treeData: [],
  },

  effects: {
    *fetch({ payload, callback }, { call }) {
      const response = yield call(getTreeRule, payload);
      if (callback) callback(response);
    },
    *fetchTree({ payload }, { call, put }) {
      const response = yield call(queryTreeRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            treeData: response.Content,
          },
        });
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(setRule, payload);
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
