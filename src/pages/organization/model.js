export default {
  namespace: 'organization',

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
