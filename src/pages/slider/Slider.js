import {
  IonContent,
  IonSlide,
  IonSlides,
  IonButton,
  IonIcon,
  IonProgressBar,
  IonSpinner,
} from "@ionic/vue";
import { downloadOutline } from "ionicons/icons";
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
    IonProgressBar,
    IonSpinner,
  },
  emits: ["hide-slider"],
  data() {
    return {
      isOnline: true,
      isStarting: false,
      isDownloading: false,
      // icons
      downloadOutline,
    };
  },
  created() {
    this.checkNetworkStatusChange();
  },
  computed: {
    status() {
      return this.$store.state.status;
    },
  },
  methods: {
    /** BUSINESS LOGIC **/
    async checkNetworkStatusChange() {
      let connectedRef = firebaseDB.ref(".info/connected");
      connectedRef.on("value", async (snap) => {
        if (snap.val() == true) {
          // If Online
          this.isOnline = true;
        } else if (snap.val() == false) {
          // Offline
          this.isOnline = false;
          this.isStarting = false;
          this.isDownloading = false;
        }
      });
    },
    async downloadContent() {
      this.isStarting = true;
      setTimeout(() => {
        this.$store.dispatch("startDownload");
        this.isDownloading = true;
        this.isStarting = false;
      }, 3000);
    },
  },
  ionViewWillLeaver() {
    this.isDownloading = false;
    console.log("done!");
  },
};
