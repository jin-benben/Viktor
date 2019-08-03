import { routerRedux } from 'dva/router';
import { parse } from 'qs';
import {
  getMDMCommonalityRule,
  tokenOutRule,
  categoryRule,
  brandRule,
  customerRule,
  supplierRule,
  hscodeRule,
  processorRule,
  authorityRule,
  changepasswordRule,
  transferHistoryRule,
} from '@/services';

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
    SupplierList: [], // 供应商
    CustomerList: [], // 客户
    BrandList: [], // 品牌
    CategoryTree: [], // 分类
    TI_Z004: [], // 员工列表
    TI_Z003: [], // 部门
    TI_Z042: [], // 产地
    HS: [], // 海关编码
    HSCodeList: [], // hscode
    TI_Z050: [], // 转移类型
    ProcessorList: [], // 处理人,
    DepartmentList: [],
    TI_Z01802: [], // 文章分类
    NoPermissionDepartmentList: [],
    OSLPList: [],
    hasLoad: false,
  },

  effects: {
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
    *getMDMCommonality({ payload, callback }, { put, call }) {
      const response = yield call(getMDMCommonalityRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            ...response.Content.DropdownData,
          },
        });
        if (callback) callback(response);
      }
    },
    // 获取权限
    *getAuthority(_, { call, put }) {
      const response = yield call(authorityRule);
      if (response && response.Status === 200) {
        const { DepartmentList, NoPermissionDepartmentList, OSLPList } = response.Content;
        yield put({
          type: 'save',
          payload: {
            DepartmentList,
            NoPermissionDepartmentList,
            OSLPList,
            hasLoad: true,
          },
        });
      }
    },
    // 获取客户下拉框初始值
    *getCustomer(_, { put, call }) {
      const response = yield call(customerRule);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              CustomerList: [],
            },
          });
        } else {
          const { rows } = response.Content;
          yield put({
            type: 'save',
            payload: {
              CustomerList: rows,
            },
          });
        }
      }
    },
    // 获取品牌下拉框初始值
    *getBrand(_, { put, call }) {
      const response = yield call(brandRule);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              BrandList: [],
            },
          });
        } else {
          const { rows } = response.Content;
          yield put({
            type: 'save',
            payload: {
              BrandList: rows,
            },
          });
        }
      }
    },
    // 获取品牌下拉框初始值
    *getHscode(_, { put, call }) {
      const response = yield call(hscodeRule);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              HSCodeList: [],
            },
          });
        } else {
          const { rows } = response.Content;
          yield put({
            type: 'save',
            payload: {
              HSCodeList: rows,
            },
          });
        }
      }
    },
    // 获取处理人下拉框初始值
    *getProcessor({ payload }, { put, call }) {
      const response = yield call(processorRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            ProcessorList: response.Content.OSLP,
          },
        });
      }
    },
    // 获取分类下拉框初始值
    *getCategory(_, { put, call }) {
      const response = yield call(categoryRule);
      if (response && response.Status === 200) {
        if (response.Content) {
          yield put({
            type: 'save',
            payload: {
              CategoryTree: response.Content,
            },
          });
        }
      }
    },
    // 获取供应商下拉框及弹窗初始值
    *getSupplier(_, { put, call }) {
      const response = yield call(supplierRule);
      if (response && response.Status === 200) {
        if (response && response.Status === 200) {
          if (!response.Content) {
            yield put({
              type: 'save',
              payload: {
                companyList: [],
              },
            });
          } else {
            const { rows } = response.Content;
            yield put({
              type: 'save',
              payload: {
                SupplierList: rows,
              },
            });
          }
        }
      }
    },
    // 验证token
    *checkToken(_, { put, call }) {
      const currentUser = localStorage.getItem('currentUser')
        ? parse(localStorage.getItem('currentUser'))
        : {};
      if (!currentUser.Token) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
          })
        );
      } else {
        const payload = {
          Content: {
            Token: currentUser.Token,
          },
        };
        yield put({
          type: 'save',
          payload: {
            currentUser,
          },
        });
        const response = yield call(tokenOutRule, payload);
        if (response && response.Status !== 200) {
          yield put(
            routerRedux.replace({
              pathname: '/user/login',
            })
          );
        }
      }
    },
    *changepassword({ payload, callback }, { call }) {
      const response = yield call(changepasswordRule, payload);
      if (callback) callback(response);
    },
    // 获取客户询价单转移记录
    *transferHistroy({ payload, callback }, { call }) {
      const response = yield call(transferHistoryRule, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
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
    setUpLocalStorage({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/user/login')
          dispatch({
            type: 'checkToken',
          });
      });
    },
  },
};
