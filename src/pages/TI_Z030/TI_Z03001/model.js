import moment from 'moment';
import {
  querySingleRule,
  addRule,
  updateRule,
  cancelRule,
  confirmRule,
  costCheckRule,
  companyRule,
  queryBaseEntryleRule,
} from '../service';
import { uploadRule } from '../../TI_Z026/service';

export default {
  namespace: 'agreementEdit',

  state: {
    orderDetail: {
      Comment: '',
      OrderType: '1',
      SourceType: '1',
      Transport: 'N',
      DocDate: moment().format('YYYY/MM/DD'),
      CreateDate: moment().format('YYYY/MM/DD'),
      ToDate: moment()
        .add('30', 'day')
        .format('YYYY/MM/DD'),
      CardCode: '',
      CardName: '',
      UserID: '',
      Contacts: '',
      CellphoneNO: '',
      PhoneNO: '',
      Email: '',
      CompanyCode: '',
      DueDate: null,
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
      Owner: '',
      TI_Z03002: [],
      TI_Z03004: [],
      TI_Z03005: [],
      TI_Z02603Fahter: [],
    },
    linkmanList: [],
    addList: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySingleRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            orderDetail: response.Content,
          },
        });
        yield put({
          type: 'company',
          payload: {
            Content: { Code: response.Content.CardCode },
          },
        });
      }
    },
    *getBaseEntry({ payload, callback }, { call }) {
      const response = yield call(queryBaseEntryleRule, payload);
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addRule, payload);
      if (callback) callback(response);
    },
    *company({ payload }, { put, call }) {
      const response = yield call(companyRule, payload);
      if (response && response.Status === 200) {
        yield put({
          type: 'save',
          payload: {
            addList: response.Content.TI_Z00603List,
            linkmanList: response.Content.TI_Z00602List,
          },
        });
      }
    },

    *update({ payload, callback }, { call }) {
      const response = yield call(updateRule, payload);
      if (callback) callback(response);
    },
    *cancel({ payload, callback }, { call }) {
      const response = yield call(cancelRule, payload);
      if (callback) callback(response);
    },
    *confirm({ payload, callback }, { call }) {
      const response = yield call(confirmRule, payload);
      if (callback) callback(response);
    },
    *costCheck({ payload, callback }, { call }) {
      const response = yield call(costCheckRule, payload);
      if (callback) callback(response);
    },
    *upload({ payload, callback }, { call }) {
      const response = yield call(uploadRule, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      console.log(action.payload);
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
