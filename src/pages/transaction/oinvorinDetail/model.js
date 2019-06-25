import { oinvorinDetailRule } from '../service';

export default {
  namespace: 'oinvorinDetail',

  state: {
    oinvorinDetailInfo: {
      DocEntry: '',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(oinvorinDetailRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            oinvorinDetailInfo: response.Content,
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
