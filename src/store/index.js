import { createStore } from "vuex";
import downloadContent from "../services/download-content.service";

const store = createStore({
  state() {
    return {
      gamePreferences: {},
      status: {
        docSize: 0,
        progress: 0,
        payload: null,
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
      downloadContent.downloadContent(async (status) => {
        context.commit("status", status);
        await downloadContent.updateContent(status.payload, status.category);
      });
    },
  },
});

export default store;
