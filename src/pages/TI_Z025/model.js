import {
  uploadSearchRule,
  uploadRule,
  approveRule,
  approveSearchRule,
  searchRule,
  detailRule,
} from './service';

export default {
  namespace: 'batchManage',

  state: {
    batchList: [],
    batchApproveList: [],
    batchUploadList: [],
    queryData: {
      Content: {
        SearchText: '',
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
      const response = yield call(searchRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              batchList: [],
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
              batchList: rows,
              queryData: {
                ...payload,
              },
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
    *approvefetch({ payload }, { call, put }) {
      const response = yield call(approveSearchRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              batchApproveList: [],
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
              batchApproveList: rows,
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
    *approve({ payload, callback }, { call }) {
      const response = yield call(approveRule, payload);
      if (callback) callback(response);
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(detailRule, payload);
      if (callback) callback(response);
    },
    *uploadfetch({ payload }, { call, put }) {
      const response = yield call(uploadSearchRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              batchUploadList: [],
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
              batchUploadList: rows,
              queryData: {
                ...payload,
              },
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
    *upload({ payload, callback }, { call }) {
      const response = yield call(uploadRule, payload);
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
