import { queryRule, querySingleRule, getPrintRule, savePrintRule } from './service';

export default {
  namespace: 'print',

  state: {
    printList: [],
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
    printDetail: {},
    printHistoryDetail: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              printList: [],
            },
          });
        } else {
          const { rows, records, page } = response.Content;
          yield put({
            type: 'save',
            payload: {
              printList: rows,
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
            printHistoryDetail: response.Content,
          },
        });
      }
    },
    *getPrint({ payload }, { call, put }) {
      const response = yield call(getPrintRule, payload);
      if (response && response.Status === 200) {
        const { PaperHTMLString, HtmlString } = response.Content;
        yield put({
          type: 'save',
          payload: {
            printDetail: {
              ...response.Content,
              HtmlString: `${PaperHTMLString + HtmlString}</div>`,
            },
          },
        });
      }
    },
    *savePrint({ payload, callback }, { call }) {
      const response = yield call(savePrintRule, payload);
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
