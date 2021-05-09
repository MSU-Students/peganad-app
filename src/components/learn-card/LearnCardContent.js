import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { volumeHigh, volumeMute } from "ionicons/icons";
import Localbase from "localbase";

let localDB = new Localbase("db");
localDB.config.debug = false;

export default {
  props: ["routerParam", "color"],
  components: {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonIcon,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
  },
  data() {
    return {
      contents: {},
      audioPlaying: false,
      tappedIndex: null,
      // icon
      volumeHigh,
      volumeMute,
    };
  },
  created() {
    this.fetchContent();
  },
  methods: {
    playAudio(base64string, index) {
      if (base64string) {
        if (index + 1) {
          this.tappedIndex = index;
          this.audioPlaying = true;
          let audioBase64 = "data:audio/wav;base64," + base64string;
          const audio = new Audio(audioBase64);
          audio.play();
          audio.onended = () => {
            this.audioPlaying = false;
          };
        }
      }
    },
    fetchContent() {
      localDB
        .collection("contents")
        .get()
        .then((contents) => {
          contents.forEach((content) => {
            if (content[this.routerParam]) {
              this.contents = content;
            }
          });
        });
    },
  },
};
