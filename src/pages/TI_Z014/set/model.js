import { getTreeRule, setRule } from '../service';

export default {
  namespace: 'authoritySet',

  state: {
    authorityList: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getTreeRule, payload);
      if (response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            authorityList: response.Content.rows,
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
