import { ordrDetailRule } from '../service';

export default {
  namespace: 'orderDetail',

  state: {
    orderDetailInfo: {
      DocEntry: '',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(ordrDetailRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            orderDetailInfo: response.Content,
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
