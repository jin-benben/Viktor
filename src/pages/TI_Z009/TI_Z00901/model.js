import {
  addRule,
  matchRule,
  confrimRule,
  querySPURule,
  queryFHSCodeRule,
  queryHSCodeRule,
  queryRule
} from '../service';

export default {
  namespace: 'skuAdd',
  state: {
    pagination1: {
      Content: {
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
      sidx: 'Code',
      sord: 'Desc',
    },
    spuList: [],
    fhscodeList: [],
    hscodeList: [],
    skuList:[],
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
    *fetch(_, { call, put, select, all }) {
      const pagination = yield select(state => state.skuAdd.pagination1);
      const [spuRes, fhsRes, hsRes] = yield all([
        call(querySPURule, pagination),
        call(queryFHSCodeRule, pagination),
        call(queryHSCodeRule, pagination),
      ]);
      if (spuRes && spuRes.Status === 200) {
        if (!spuRes.Content) {
          yield put({
            type: 'save',
            payload: {
              spuList: [],
            },
          });
        } else {
          const { rows } = spuRes.Content;
          yield put({
            type: 'save',
            payload: {
              spuList: rows,
            },
          });
        }
      }
      if (fhsRes && fhsRes.Status === 200) {
        if (!fhsRes.Content) {
          yield put({
            type: 'save',
            payload: {
              fhscodeList: [],
            },
          });
        } else {
          const { rows } = fhsRes.Content;
          yield put({
            type: 'save',
            payload: {
              fhscodeList: rows,
            },
          });
        }
      }
      if (hsRes && hsRes.Status === 200) {
        if (!hsRes.Content) {
          yield put({
            type: 'save',
            payload: {
              hscodeList: [],
            },
          });
        } else {
          const { rows } = hsRes.Content;
          yield put({
            type: 'save',
            payload: {
              hscodeList: rows,
            },
          });
        }
      }
    },

    *add({ payload, callback }, { call }) {
      const response = yield call(addRule, payload);
      if (callback) callback(response);
    },
    *match({ payload, callback }, { call }) {
      const response = yield call(matchRule, payload);
      if (callback) callback(response);
    },
    *confrim({ payload, callback }, { call }) {
      const response = yield call(confrimRule, payload);
      if (callback) callback(response);
    },
    *fetchList({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              skuList: [],
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
              skuList: rows,
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
