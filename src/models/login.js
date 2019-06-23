import { routerRedux } from 'dva/router';
import { loginRule, loginOutRule, getMDMCommonalityRule, ddLoginRule } from '@/services';
import { stringify } from 'qs';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(loginRule, payload);
      const redirect = '';
      if (response && response.Status === 200) {
        const currentUser = response.Content;
        const responsecom = yield call(getMDMCommonalityRule, {
          Content: { CodeList: ['Company'] },
        });
        if (responsecom && responsecom.Status === 200) {
          Object.assign(currentUser, { Company: responsecom.Content.DropdownData.Company });
        }
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

    *ddLogin({ payload }, { call, put }) {
      const response = yield call(ddLoginRule, payload);
      const redirect = '';
      if (response && response.Status === 200) {
        const currentUser = response.Content;
        const responsecom = yield call(getMDMCommonalityRule, {
          Content: { CodeList: ['Company'] },
        });
        if (responsecom && responsecom.Status === 200) {
          Object.assign(currentUser, { Company: responsecom.Content.DropdownData.Company });
        }
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
