import { routerRedux } from 'dva/router';
import { loginRule, loginOutRule } from '@/services';
import { stringify } from 'qs';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(loginRule, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      const redirect = '';
      if (response && response.Status === 200) {
        const currentUser = response.Content;
        localStorage.setItem('currentUser', stringify(currentUser));
        yield put({
          type: 'global/save',
          payload: {
            currentUser,
          },
        });
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *logout(_, { call, put }) {
      const response = yield call(loginOutRule);
      if (response && response.Status === 200) {
        localStorage.clear();
        routerRedux.replace({
          pathname: '/user/login',
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
