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
    pagination2: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['20', '40', '60'],
      total: 0,
      pageSize: 20,
      current: 1,
    },
    pagination3: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['20', '40', '60'],
      total: 0,
      pageSize: 20,
      current: 1,
    },
    pagination4: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['20', '40', '60'],
      total: 0,
      pageSize: 20,
      current: 1,
    },
    pagination5: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['20', '40', '60'],
      total: 0,
      pageSize: 20,
      current: 1,
    },
    pagination6: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['20', '40', '60'],
      total: 0,
      pageSize: 20,
      current: 1,
    },
    pagination7: {
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['20', '40', '60'],
      total: 0,
      pageSize: 20,
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
              pagination1: {
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
              pagination1: {
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条`,
                pageSizeOptions: ['20', '40', '60'],
                total: records,
                pageSize: payload.rows,
                current: page,
              },
            },
          });
        }
      }
    },
    *getOrdrLine({ payload }, { call, put }) {
      const response = yield call(ordrLineRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              ordrLineList: [],
              pagination5: {
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
              pagination5: {
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条`,
                pageSizeOptions: ['20', '40', '60'],
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
              pagination2: {
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
              pagination2: {
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条`,
                pageSizeOptions: ['20', '40', '60'],
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
              pagination3: {
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
              pagination3: {
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条`,
                pageSizeOptions: ['20', '40', '60'],
                total: records,
                pageSize: payload.rows,
                current: page,
              },
            },
          });
        }
      }
    },
    *getOdlnordnLine({ payload }, { call, put }) {
      const response = yield call(odlnordnLineRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              odlnordnLineList: [],
              pagination6: {
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
              pagination6: {
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条`,
                pageSizeOptions: ['20', '40', '60'],
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
              pagination4: {
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
              pagination4: {
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条`,
                pageSizeOptions: ['20', '40', '60'],
                total: records,
                pageSize: payload.rows,
                current: page,
              },
            },
          });
        }
      }
    },
    *getOinvorinLine({ payload }, { call, put }) {
      const response = yield call(oinvorinLineRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              oinvorinLineList: [],
              pagination7: {
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
              pagination7: {
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条`,
                pageSizeOptions: ['20', '40', '60'],
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
