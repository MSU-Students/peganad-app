import { createStore } from "vuex";
import downloadContent from "../services/download-content.service";

const store = createStore({
  state() {
    return {
      loading: undefined,
      gamePreferences: {},
      status: {
        progress: 0,
        payload: null, // array
        category: "",
      },
    };
  },
  getters: {},
  mutations: {
    loading(state, value) {
      state.loading = value;
      console.log(state.loading);
    },
    gamePreferences(state, value) {
      state.gamePreferences = value;
    },
    status(state, value) {
      state.status = value;
    },
  },
  actions: {
    startDownload(context) {
      downloadContent.downloadContent((status) => {
        context.commit("status", status);
        downloadContent.updateContent(status.payload, status.category);
      });
    },
    loading(context, value) {
      context.commit("loading", value);
    },
  },
});

export default store;
