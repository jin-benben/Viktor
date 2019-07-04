import {
  queryRule,
  querySingleRule,
  getSendRule,
  saveSendRule,
  sendEmailRule,
  sendTestRule,
} from './service';

export default {
  namespace: 'sendEmail',

  state: {
    sendEmailList: [],
    queryData: {
      Content: {
        SearchText: '',
        SearchKey: 'Name',
      },
      page: 1,
      rows: 30,
      sidx: 'DocEntry',
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
    sendDetail: {},
    sendHistoryDetail: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              sendEmailList: [],
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
              sendEmailList: rows,
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
    *singlefetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            sendHistoryDetail: response.Content,
          },
        });
      }
    },
    *getEmail({ payload }, { call, put }) {
      const response = yield call(getSendRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            sendDetail: {
              ...response.Content,
            },
          },
        });
      }
    },
    *saveSend({ payload, callback }, { call }) {
      const response = yield call(saveSendRule, payload);
      if (callback) callback(response);
    },
    *sendTest({ payload, callback }, { call }) {
      const response = yield call(sendTestRule, payload);
      if (callback) callback(response);
    },
    *saveAgainSend({ payload, callback }, { call }) {
      const response = yield call(sendEmailRule, payload);
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
