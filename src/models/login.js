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

    *logout(_, { call, put, select }) {
      const ToKen = yield select(state => state.global.currentUser.Token);
      const payload = {
        Content: {},
        Tonken: ToKen,
      };
      const response = yield call(loginOutRule, payload);
      if (response && response.Status === 200) {
        localStorage.clear();
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
          })
        );
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
