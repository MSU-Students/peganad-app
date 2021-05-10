import { createStore } from "vuex";
import downloadContent from "../services/download-content.service";

const store = createStore({
  state() {
    return {
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
  },
});

export default store;
