import { queryRule } from '../service';

export default {
  namespace: 'supplierSearch',

  state: {
    supplierList: [],
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
      if (response.Status === 200) {
        if (!response.Content) {
          yield put({
            type: 'save',
            payload: {
              supplierList: [],
            },
          });
        } else {
          const { rows, records, page } = response.Content;
          yield put({
            type: 'save',
            payload: {
              supplierList: rows,
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