import { queryRule,addRule,querySingleRule,updateRule } from './service';

export default {
  namespace: 'homeSet',

  state: {
    homeSetList: [],
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
              homeSetList: [],
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
              homeSetList: rows,
              pagination: {
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条`,
                pageSizeOptions: ['30', '60', '90'],
                total: records,
                pageSize: payload.rows,
                current: page,
              },
              queryData: {
                ...payload,
              },
            },
          });
        }
      }
    },
    *add({ payload,callback }, { call }){
      const response = yield call(addRule, payload);
      if(callback) callback(response)
    },
    *singleFetchs({ payload,callback }, { call }){
      const response = yield call(querySingleRule, payload);
      if(callback) callback(response)
    },
    *update({ payload,callback }, { call }){
      const response = yield call(updateRule, payload);
      if(callback) callback(response)
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
