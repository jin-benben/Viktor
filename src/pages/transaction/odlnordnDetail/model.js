import { odlnordnDetailRule } from '../service';

export default {
  namespace: 'odlnordnDetail',

  state: {
    odlnordnDetailInfo: {
      DocEntry: '',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(odlnordnDetailRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            odlnordnDetailInfo: response.Content,
          },
        });
      }
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
