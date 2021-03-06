import {
  querySingleRule,
  querySPURule,
  queryFHSCodeRule,
  queryHSCodeRule,
  updateRule,
} from '../service';

export default {
  namespace: 'skuDetail',

  state: {
    skuDetailInfo: {},
    spuList: [],
    fhscodeList: [],
    hscodeList: [],
    pagination: {
      Content: {
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
      sidx: 'Code',
      sord: 'Desc',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            skuDetailInfo: response.Content,
          },
        });
      }
    },
    *fetchcode(_, { call, put, select, all }) {
      const pagination = yield select(state => state.skuDetail.pagination);
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

    *update({ payload, callback }, { call }) {
      const response = yield call(updateRule, payload);
      if (callback) callback(response);
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
