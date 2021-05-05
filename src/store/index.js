import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      isHide: true,
      gamePreferences: {},
    };
  },
  getters: {
    // isHide(state) {
    //   return state.isHide;
    // },
  },
  mutations: {
    isHide(state, value) {
      state.isHide = value;
    },
    gamePreferences(state, value) {
      state.gamePreferences = value;
    },
  },
  actions: {
    isHide(context, value) {
      context.commit("isHide", value);
    },
  },
});

export default store;
