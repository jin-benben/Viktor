import { queryNotices } from '@/services/user';
import { getMDMCommonalityRule, tokenOutRule } from '@/services';
import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import { parse } from 'qs';

export default {
  namespace: 'global',

  state: {
    collapsed: true,
    currentUser: {}, // 当前用户信息
    notices: [],
    Saler: [], // 销售员
    Purchaser: [], // 采购员
    Company: [], // 交易公司
    WhsCode: [], // 仓库
    PayMent: [], // 付款条款
    Trnsp: [], // 物流公司
    Card: [], // 客户类型
    Supplier: [], // 供应商类型
    Curr: [], // 交易币种
  },

  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        })
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
    *getMDMCommonality({ payload }, { put, call }) {
      const response = yield call(getMDMCommonalityRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            ...response.Content.DropdownData,
          },
        });
      }
    },
    *checkToken({ payload }, { put, call }) {
      const response = yield call(tokenOutRule, payload);
      if (response && response.Status !== 200) {
        notification.error({
          message: '验证失败',
          description: '登录已过期，请重新登录',
        });
        routerRedux.replace({
          pathname: '/user/login',
        });
      }
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      console.log(payload);
      return {
        ...state,
        collapsed: payload,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      const currentUser = localStorage.getItem('currentUser')
        ? parse(localStorage.getItem('currentUser'))
        : {};
      console.log(currentUser);
      return history.listen(() => {
        if (typeof window.ga !== 'undefined') {
          dispatch({
            type: 'save',
            payload: {
              currentUser,
            },
          });
        }
      });
    },
  },
};
