import {
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { arrowForwardOutline } from "ionicons/icons";
import { Plugins } from "@capacitor/core";
import SliderScreen from "../../components/slider-screen/SliderScreen.vue";

const { StatusBar } = Plugins;

const cards = [
  {
    title: "Learn",
    subtitle: "Maganad tano!",
    color: "danger",
    img: "study.png",
    route: "/learn",
    animateCard: "animate__bounceInLeft",
    animateArrow: "animate__delay-1s",
  },
  {
    title: "Game",
    subtitle: "Gitagita tano!",
    color: "orange",
    img: "game.png",
    route: "/game",
    animateCard: "animate__bounceInRight",
    animateArrow: "animate__delay-2s",
  },
];

export default {
  name: "HomePage",
  components: {
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    SliderScreen,
  },
  data() {
    return {
      cards: cards,
      showSlider: false,
      // icon
      arrowForwardOutline,
    };
  },
  ionViewWillEnter() {
    this.statusBar();
  },
  methods: {
    /** UI Logic **/
    async statusBar() {
      const statusBar = await StatusBar.setBackgroundColor({
        color: "#f4f5f8",
      });
      return statusBar;
    },
  },
};
