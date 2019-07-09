import { queryRule } from '../service';

export default {
  namespace: 'inquiryFetch',

  state: {
    inquiryList: [],
    queryData: {
      Content: {
        Owner: [],
        PDocStatus: '',
        SDocStatus: '',
        IsInquiry: '',
        Closed: 'N',
        SearchText: '',
        SearchKey: '',
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
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              inquiryList: [],
              pagination: {
                total: 0,
              },
              queryData: {
                ...payload,
              },
            },
          });
        } else {
          const { rows, records, page } = response.Content;
          yield put({
            type: 'save',
            payload: {
              inquiryList: rows,
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
