export default {
  namespace: 'authority',

  state: {
    data: {
      list: [],
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
