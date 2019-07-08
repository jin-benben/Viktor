import { TI_Z02803 } from '../service';

export default {
  namespace: 'TI_Z02803',

  state: {},

  effects: {
    *fetch({ payload, callback }, { call }) {
      const response = yield call(TI_Z02803, payload);
      callback(response);
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
