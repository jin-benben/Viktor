import { TI_Z02907, confirmRule } from '../service';

export default {
  namespace: 'SalesQuotationSku',

  state: {
    SalesQuotationSkuList: [],
    queryData: {
      Content: {
        SearchText: '',
        SearchKey: '',
        QueryType: '1',
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
      const response = yield call(TI_Z02907, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              SalesQuotationSkuList: [],
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
              SalesQuotationSkuList: rows,
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
    *confirm({ payload, callback }, { call }) {
      const response = yield call(confirmRule, payload);
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
