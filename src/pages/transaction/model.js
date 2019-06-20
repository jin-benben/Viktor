import { odlnordnRule, orctovpmRule, oinvorinRule, ordrRule } from './service';

export default {
  namespace: 'transaction',

  state: {
    odlnordnList: [],
    orctovpmList: [],
    oinvorinList: [],
    ordrList: [],
    queryData: {
      Content: {
        SearchText: '',
        SearchKey: '',
      },
      page: 1,
      rows: 30,
      sidx: 'Code',
      sord: 'Desc',
    },
    pagination1: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['30', '60', '90'],
      total: 0,
      pageSize: 30,
      current: 1,
    },
    pagination2: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['30', '60', '90'],
      total: 0,
      pageSize: 30,
      current: 1,
    },
    pagination3: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['30', '60', '90'],
      total: 0,
      pageSize: 30,
      current: 1,
    },
    pagination4: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['30', '60', '90'],
      total: 0,
      pageSize: 30,
      current: 1,
    },
  },

  effects: {
    *getOrdr({ payload }, { call, put }) {
      const response = yield call(ordrRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              ordrList: [],
            },
          });
        } else {
          const { rows, records, page } = response.Content;
          yield put({
            type: 'save',
            payload: {
              ordrList: rows,
              pagination1: {
                total: records,
                pageSize: payload.rows,
                current: page,
              },
            },
          });
        }
      }
    },
    *getOrctovpm({ payload }, { call, put }) {
      const response = yield call(orctovpmRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              orctovpmList: [],
            },
          });
        } else {
          const { rows, records, page } = response.Content;
          yield put({
            type: 'save',
            payload: {
              orctovpmList: rows,
              pagination2: {
                total: records,
                pageSize: payload.rows,
                current: page,
              },
            },
          });
        }
      }
    },
    *getOdlnordn({ payload }, { call, put }) {
      const response = yield call(odlnordnRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              odlnordnList: [],
            },
          });
        } else {
          const { rows, records, page } = response.Content;
          yield put({
            type: 'save',
            payload: {
              odlnordnList: rows,
              pagination3: {
                total: records,
                pageSize: payload.rows,
                current: page,
              },
            },
          });
        }
      }
    },

    *getOinvorin({ payload }, { call, put }) {
      const response = yield call(oinvorinRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              oinvorinList: [],
            },
          });
        } else {
          const { rows, records, page } = response.Content;
          yield put({
            type: 'save',
            payload: {
              oinvorinList: rows,
              pagination4: {
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
