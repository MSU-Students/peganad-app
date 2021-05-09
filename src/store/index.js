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
        done: false,
      },
    };
  },
  getters: {},
  mutations: {
    gamePreferences(state, value) {
      state.gamePreferences = value;
    },
    loading(state, value) {
      state.loading = value;
      console.log(state.loading);
    },
    status(state, value) {
      state.status = value;
    },
  },
  actions: {
    startDownload(context) {
      downloadContent.downloadContent((status) => {
        context.commit("status", status);
        // context.commit("progress", status.progress);
        downloadContent.updateContent(status.payload, status.category);
      });
    },
    loading(context, value) {
      context.commit("loading", value);
    },
  },
});

export default store;
