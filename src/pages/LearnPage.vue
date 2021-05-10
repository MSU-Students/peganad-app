<template>
  <base-layout
    toolbarColor="danger"
    statusBarColor="#eb445a"
    pageDefaultBackLink="/home"
  >
    <div class="wrapper">
      <div class="sub-header-container ion-padding-top">
        <ion-text>
          <h1
            class="sub-header ion-text-center 
          ion-no-margin ion-padding-horizontal 
          animate__animated animate__tada"
          >
            Ready To Learn?
          </h1>
        </ion-text>
      </div>
      <div class="sub-content">
        <ion-grid>
          <ion-row>
            <ion-col
              v-for="(card, index) in cards"
              :key="index"
              class="ion-no-padding"
              size="6"
            >
              <ion-card
                class="animate__animated animate__pulse"
                button="true"
                :routerLink="card.link"
              >
                <div class="ion-text-center ion-padding-top">
                  <ion-button
                    v-if="card.hasNewData"
                    color="success"
                    size="small"
                    fill="solid"
                    @click.prevent.stop="downloadContent(card.title)"
                  >
                    <ion-icon slot="start" :icon="downloadOutline"></ion-icon>
                    New content!</ion-button
                  >
                </div>
                <ion-card-content>
                  <img
                    :src="require(`../../public/assets/design/${card.img}`)"
                  />

                  <ion-text>
                    <h1 class="ion-padding-top ion-text-center">
                      {{ card.title }}
                    </h1>
                  </ion-text>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </div>
  </base-layout>
</template>

<script>
import downloadContent from "../services/download-content.service.js";
import {
  IonText,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { bookOutline, downloadOutline } from "ionicons/icons";
import {
  animalsQuery,
  colorsQuery,
  wordsQuery,
  numbersQuery,
  firebaseDB,
} from "../firestore/firebaseInit.js";
import componentUtil from "../utils/component.util.js";
import Localbase from "localbase";

let localDB = new Localbase("db");
localDB.config.debug = false;

const cards = [
  {
    title: "Animals",
    img: "animals.png",
    link: "/learn/animals",
    hasNewData: false,
  },
  {
    title: "Colors",
    img: "colors.png",
    link: "/learn/colors",
    hasNewData: false,
  },
  {
    title: "Numbers",
    img: "numbers.png",
    link: "/learn/numbers",
    hasNewData: false,
  },
  {
    title: "Words",
    img: "words.png",
    link: "/learn/words",
    hasNewData: false,
  },
];

export default {
  name: "LearnPage",
  components: {
    IonText,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
  },
  data() {
    return {
      cards: cards,
      loading: "",
      // icons
      bookOutline,
      downloadOutline,
    };
  },
  ionViewWillEnter() {
    this.statusBar();
  },
  created() {
    this.checkNetworkStatusChange();
  },
  watch: {
    // to hide slider when successfully downloaded the content!
    isHide: function(val) {
      this.loading.dismiss().then(() => {
        clearTimeout(this.currentTimer);
        if (val == 0) {
          this.cards[0].hasNewData = false;
        } else if (val == 1) {
          this.cards[1].hasNewData = false;
        } else if (val == 2) {
          this.cards[2].hasNewData = false;
        } else if (val == 3) {
          this.cards[3].hasNewData = false;
        }
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
    async statusBar() {
      await componentUtil.statusBar("#faa329");
    },
    async presentLoading() {
      const loading = await componentUtil.presentLoading(
        "Downloading please wait..."
      );
      this.loading = loading;
      return loading.present();
    },
    async popupToast(message, color, duration, position) {
      await componentUtil.popupToast(message, color, duration, position);
    },
    async checkNetworkStatusChange() {
      let connectedRef = firebaseDB.ref(".info/connected");
      connectedRef.on("value", (snap) => {
        if (snap.val() == true) {
          // If Online
          this.checkNewContentOnline();
        } else if (snap.val() == false) {
          this.cards[0].hasNewData = false;
          this.cards[1].hasNewData = false;
          this.cards[2].hasNewData = false;
          this.cards[3].hasNewData = false;
        }
      });
    },
    async checkNewContentOnline() {
      let checkDatabase = async (dbName) => {
        const db = await localDB
          .collection("contents")
          .doc(dbName)
          .get();
        return db;
      };
      await Promise.all([
        (async () => {
          animalsQuery.onSnapshot((snapshot) => {
            checkDatabase("animals").then((doc) => {
              if (snapshot.docs.length != doc["animals"].length) {
                this.cards[0].hasNewData = true;
              } else {
                this.cards[0].hasNewData = false;
              }
            });
          });
        })(),
        (async () => {
          colorsQuery.onSnapshot((snapshot) => {
            checkDatabase("colors").then((doc) => {
              if (snapshot.docs.length != doc["colors"].length) {
                this.cards[1].hasNewData = true;
              } else {
                this.cards[1].hasNewData = false;
              }
            });
          });
        })(),
        (async () => {
          numbersQuery.onSnapshot((snapshot) => {
            checkDatabase("numbers").then((doc) => {
              if (snapshot.docs.length != doc["numbers"].length) {
                this.cards[2].hasNewData = true;
              } else {
                this.cards[2].hasNewData = false;
              }
            });
          });
        })(),
        (async () => {
          wordsQuery.onSnapshot((snapshot) => {
            checkDatabase("words").then((doc) => {
              if (snapshot.docs.length != doc["words"].length) {
                this.cards[3].hasNewData = true;
              } else {
                this.cards[3].hasNewData = false;
              }
            });
          });
        })(),
      ]);
    },
    async downloadContent(title) {
      const loading = await this.presentLoading();
      this.loading = loading;
      await loading.present();
      downloadContent.downloadContentByName(title.toLowerCase());
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Exo:wght@400;500&display=swap");

ion-grid {
  --ion-grid-padding: 10px;
  --ion-grid-width-xs: 100px;
}

.wrapper {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.sub-header-container {
  background: url("../../public/assets/design/study1.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 250px;
}
.sub-header {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3em;
  font-family: "Exo", sans-serif;
  font-weight: bold;
}
.sub-content {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
h1 {
  font-family: "Exo", sans-serif;
  font-weight: 550;
}
</style>
