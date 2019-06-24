import { getTreeRule, setRule, queryTreeRule } from '../service';

export default {
  namespace: 'authoritySet',

  state: {
    authorityList: [],
    treeData: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getTreeRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            authorityList: response.Content.rows,
          },
        });
      }
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
    *update({ payload, callback }, { call, put }) {
      const response = yield call(setRule, payload);
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
