import {
  odlnordnRule,
  orctovpmRule,
  oinvorinRule,
  ordrRule,
  ordrLineRule,
  odlnordnLineRule,
  oinvorinLineRule,
} from './service';

export default {
  namespace: 'transaction',

  state: {
    odlnordnList: [],
    orctovpmList: [],
    oinvorinList: [],
    ordrList: [],
    ordrLineList: [],
    odlnordnLineList: [],
    oinvorinLineList: [],
    queryData: {
      Content: {
        SlpCode: '',
        QueryType: '1',
        SearchText: '',
        SearchKey: '',
      },
      page: 1,
      rows: 20,
      sidx: 'DocEntry',
      sord: 'Desc',
    },
    pagination: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['20', '40', '60'],
      total: 0,
      pageSize: 20,
      current: 1,
    },
  },

  effects: {
    *getOrdr({ payload }, { call, put, select }) {
      const pagination = yield select(state => state.pagination);
      const response = yield call(ordrRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              ordrList: [],
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
              ordrList: rows,
              pagination: {
                ...pagination,
                total: records,
                pageSize: payload.rows,
                current: page,
              },
            },
          });
        }
      }
    },
    *getOrdrLine({ payload }, { call, put, select }) {
      const pagination = yield select(state => state.pagination);
      const response = yield call(ordrLineRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              ordrLineList: [],
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
              ordrLineList: rows,
              pagination: {
                ...pagination,
                total: records,
                pageSize: payload.rows,
                current: page,
              },
            },
          });
        }
      }
    },
    *getOrctovpm({ payload }, { call, put, select }) {
      const pagination = yield select(state => state.pagination);
      const response = yield call(orctovpmRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              orctovpmList: [],
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
              orctovpmList: rows,
              pagination: {
                ...pagination,
                total: records,
                pageSize: payload.rows,
                current: page,
              },
            },
          });
        }
      }
    },
    *getOdlnordn({ payload }, { call, put, select }) {
      const pagination = yield select(state => state.pagination);
      const response = yield call(odlnordnRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              odlnordnList: [],
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
              odlnordnList: rows,
              pagination: {
                ...pagination,
                total: records,
                pageSize: payload.rows,
                current: page,
              },
            },
          });
        }
      }
    },
    *getOdlnordnLine({ payload }, { call, put, select }) {
      const pagination = yield select(state => state.pagination);
      const response = yield call(odlnordnLineRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              odlnordnLineList: [],
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
              odlnordnLineList: rows,
              pagination: {
                ...pagination,
                total: records,
                pageSize: payload.rows,
                current: page,
              },
            },
          });
        }
      }
    },

    *getOinvorin({ payload }, { call, put, select }) {
      const pagination = yield select(state => state.pagination);
      const response = yield call(oinvorinRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              oinvorinList: [],
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
              oinvorinList: rows,
              pagination: {
                ...pagination,
                total: records,
                pageSize: payload.rows,
                current: page,
              },
            },
          });
        }
      }
    },
    *getOinvorinLine({ payload }, { call, put, select }) {
      const pagination = yield select(state => state.pagination);
      const response = yield call(oinvorinLineRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              oinvorinLineList: [],
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
              oinvorinLineList: rows,
              pagination: {
                ...pagination,
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
