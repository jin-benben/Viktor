import { TI_Z02907 } from '../service';

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
      if (response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              SalesQuotationSkuList: [],
            },
          });
        } else {
          const { rows, records, page } = response.Content;
          yield put({
            type: 'save',
            payload: {
              SalesQuotationSkuList: rows,
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
