import { TI_Z03007 } from '../service';
import {getTotal} from '@/utils/utils'

export default {
  namespace: 'agreementLine',

  state: {
    ProfitTotal:0, // 利润合计
    DocTotal:0, // 总计
    InquiryDocTotalLocal:0, // 询价本总计
    agreementLineList: [],
    queryData: {
      Content: {
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
      const response = yield call(TI_Z03007, payload);
      if (response && response.Status === 200) {
        if (!response.Content) {
          const {InquiryDocTotalLocal,ProfitTotal,DocTotal} = getTotal([]);
          yield put({
            type: 'save',
            payload: {
              InquiryDocTotalLocal,ProfitTotal,DocTotal,
              agreementLineList: [],
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
          const {InquiryDocTotalLocal,ProfitTotal,DocTotal} = getTotal(rows);
          yield put({
            type: 'save',
            payload: {
              InquiryDocTotalLocal,ProfitTotal,DocTotal,
              agreementLineList: rows,
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
