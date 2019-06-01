import { querySingleRule } from '../service';

export default {
  namespace: 'supplierAskPreview',

  state: {
    supplierAskDetail: {
      Comment: '',
      SDocStatus: '',
      PDocStatus: '',
      Closed: '',
      ClosedBy: '',
      SourceType: '1',
      OrderType: '1',
      DocDate: '',
      CreateDate: '',
      CardCode: '',
      CardName: '',
      Contacts: '',
      CellphoneNO: '',
      PhoneNO: '',
      Email: '',
      DueDate: null,
      ToDate: null,
      InquiryDocTotal: '',
      DocTotal: '',
      ProvinceID: '',
      Province: '',
      CityID: '',
      City: '',
      AreaID: '',
      Area: '',

      Address: '',
      NumAtCard: '',
      IsInquiry: '',
      TI_Z02702: [],
      TI_Z02703: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            supplierAskDetail: response.Content,
          },
        });
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
