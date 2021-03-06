import {
  addRule,
  matchRule,
  confrimRule,
  querySPURule,
  queryFHSCodeRule,
  queryHSCodeRule,
} from '../service';

export default {
  namespace: 'skuAdd',
  state: {
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
    spuList: [],
    fhscodeList: [],
    hscodeList: [],
  },
  effects: {
    *fetch(_, { call, put, select, all }) {
      const pagination = yield select(state => state.skuAdd.pagination);
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
