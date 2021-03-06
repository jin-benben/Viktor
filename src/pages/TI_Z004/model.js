import {
  queryRule,
  addRule,
  updateRule,
  getControllerRule,
  setLoadingRule,
  getSalerRule,
  getDepartmentRule,
  getDepartmentTreeRule,
  getOSLPRule,
  reloadRule,
} from './service';

export default {
  namespace: 'staffs',

  state: {
    staffsList: [],
    controllerList: [],
    OSLP: [],
    treeData: [],
    pagination: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['30', '60', '90'],
      total: 0,
      pageSize: 30,
      current: 1,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              staffsList: [],
              pagination: {
                total: 0,
              },
            },
          });
        } else {
          const { rows, records, page } = response.Content;
          yield put({
            type: 'save',
            payload: {
              staffsList: rows,
              pagination: {
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条`,
                pageSizeOptions: ['30', '60', '90'],
                total: records,
                pageSize: payload.rows,
                current: page,
              },
            },
          });
        }
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addRule, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateRule, payload);
      if (callback) callback(response);
    },
    *getController({ payload }, { call, put }) {
      const response = yield call(getControllerRule, payload);
      const responseTree = yield call(getDepartmentTreeRule);
      const responseSP = yield call(getOSLPRule, { Content: { SlpName: '' } });
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            controllerList: response.Content.TI_Z00409ResponseItem,
          },
        });
      }
      if (responseTree && responseTree.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            treeData: responseTree.Content,
          },
        });
      }
      if (responseSP && responseSP.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            OSLP: responseSP.Content.OSLP,
          },
        });
      }
    },
    *getSaler({ payload, callback }, { call }) {
      const response = yield call(getSalerRule, payload);
      if (callback) callback(response);
    },
    *getDepartment({ payload, callback }, { call }) {
      const response = yield call(getDepartmentRule, payload);
      if (callback) callback(response);
    },
    *setLoading({ payload, callback }, { call }) {
      const response = yield call(setLoadingRule, payload);
      if (callback) callback(response);
    },
    *reload({ callback }, { call }) {
      const response = yield call(reloadRule);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
