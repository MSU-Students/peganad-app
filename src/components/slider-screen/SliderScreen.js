import {
  IonContent,
  IonSlide,
  IonSlides,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { downloadOutline } from "ionicons/icons";
import componentUtil from "../../utils/component.util.js";
import { firebaseDB } from "../../firestore/firebaseInit.js";
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
      isOnline: true,
      // icons
      downloadOutline,
    };
  },
  created() {
    this.checkNetworkStatusChange();
  },
  methods: {
    /** BUSINESS LOGIC **/
    async checkNetworkStatusChange() {
      let connectedRef = firebaseDB.ref(".info/connected");
      connectedRef.on("value", (snap) => {
        if (snap.val() == true) {
          // If Online
          this.isOnline = true;
        } else if (snap.val() == false) {
          // Offline
          this.isOnline = false;
        }
      });
    },
    async downloadContent() {
      this.$store.dispatch("startDownload");
      const loading = await componentUtil.presentLoading(
        "Downloading please wait..."
      );
      await loading.present();
      this.$store.dispatch("loading", loading);
    },
  },
};
