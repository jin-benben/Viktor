import { queryRule, addRule, updateRule } from './service';

export default {
  namespace: 'hscode',

  state: {
    hscodeList: [],
    queryData: {
      Content: {
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
      sidx: 'Code',
      sord: 'Desc',
    },
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
              hscodeList: [],
              queryData: {
                ...payload,
              },
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
              hscodeList: rows,
              pagination: {
                total: records,
                pageSize: payload.rows,
                current: page,
              },
            },
          });
        }
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
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
