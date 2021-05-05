import {
  IonContent,
  IonSlide,
  IonSlides,
  IonButton,
  IonIcon,
  loadingController,
  toastController,
} from "@ionic/vue";
import { downloadOutline } from "ionicons/icons";
import { firebaseDB } from "../../firestore/firebaseInit.js";
import downloadContent from "../../services/download-content.service.js";
import Localbase from "localbase";

let localDB = new Localbase("db");
localDB.config.debug = false;

export default {
  components: {
    IonContent,
    IonSlide,
    IonSlides,
    IonButton,
    IonIcon,
  },
  emits: ["hide-slider"],
  data() {
    return {
      contents: {},
      internetStatus: false,
      counter: 0,
      loading: "",
      currentTimer: 0,
      // icons
      downloadOutline,
    };
  },
  created() {
    this.checkNetworkStatusChange();
  },
  watch: {
    // to hide slider when successfully downloaded the content!
    isHide: function(val) {
      this.$emit("hide-slider", val);
      this.loading.dismiss().then(() => {
        clearTimeout(this.currentTimer);
      });
    },
  },
  computed: {
    isHide: {
      get() {
        return this.$store.state.isHide;
      },
      set(val) {
        this.$store.commit("isHide", val);
      },
    },
  },
  methods: {
    /** UI LOGIC */
    async presentLoading() {
      const loading = await loadingController.create({
        message: "Downloading please wait...",
      });
      this.loading = loading;
      return loading;
    },
    async popupToast(message, color, duration, position) {
      const toast = await toastController.create({
        message: message,
        color: color,
        duration: duration,
        position: position,
      });
      return toast.present();
    },
    /** BUSINESS LOGIC **/
    async checkNetworkStatusChange() {
      let connectedRef = firebaseDB.ref(".info/connected");
      connectedRef.on("value", (snap) => {
        if (!snap.val()) {
          // If Offline
          this.internetStatus = true;
          this.checkLocalContent();
          loadingController.dismiss();
        } else {
          // Online
          this.internetStatus = false;
        }
      });
    },
    async checkLocalContent() {
      const hasDB = await downloadContent.checkLocalContent();
      if (hasDB) {
        this.internetStatus = false;
        this.$emit("hide-slider", false);
      } else {
        this.internetStatus = true;
        this.$emit("hide-slider", true);
      }
    },
    async downloadContent() {
      const loading = await this.presentLoading();
      this.loading = loading;
      await loading.present();
      downloadContent.downloadContent();
      this.currentTimer = setTimeout(() => {
        localDB
          .collection("contents")
          .delete()
          .then(async () => {
            await loading.dismiss().then(async () => {
              await this.popupToast("Network Interrupted!", "danger", 5000, "bottom");
            });      
          });
      }, 2 * 60000);
    },
  },
};
