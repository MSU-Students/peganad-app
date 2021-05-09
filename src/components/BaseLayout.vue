<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar :color="toolbarColor">
        <ion-buttons slot="start">
          <ion-back-button
            v-if="
              $route.fullPath != '/home' &&
                $route.fullPath != '/learn' &&
                $route.fullPath != '/game'
            "
            :icon="closeOutline"
            @click="routerBack(pageDefaultBackLink)"
          ></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="start">
          <ion-button v-if="$route.fullPath == '/learn'" routerLink="/home">
            <ion-icon slot="icon-only" :icon="arrowBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="start">
          <ion-button v-if="$route.fullPath == '/game'" routerLink="/home">
            <ion-icon slot="icon-only" :icon="arrowBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button v-if="$route.fullPath == '/game'" routerLink="/score">
            <ion-icon slot="icon-only" :icon="trophy"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :color="toolbarColor">
      <slot />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonToolbar,
  IonHeader,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  alertController,
} from "@ionic/vue";
import { grid, trophy, arrowBackOutline, closeOutline } from "ionicons/icons";
import componentUtil from "../utils/component.util.js";

export default {
  name: "BaseLayout",
  props: [
    "pageTitle",
    "toolbarColor",
    "statusBarColor",
    "pageDefaultBackLink",
    "routerParam",
  ],
  components: {
    IonPage,
    IonToolbar,
    IonHeader,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
  },
  data() {
    return {
      isPause: false,
      //   icon
      grid,
      trophy,
      arrowBackOutline,
      closeOutline,
    };
  },
  mounted() {
    this.statusBar();
  },
  computed: {
    gamePreferences: {
      get() {
        return this.$store.state.gamePreferences;
      },
      set(val) {
        this.$store.commit("gamePreferences", val);
      },
    },
  },
  methods: {
    async statusBar() {
      await componentUtil.statusBar(this.statusBarColor);
    },
    async presentAlertConfirm(pageDefaultBackLink) {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Confirm",
        message: "Are you sure you want to leave?",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              this.gamePreferences = {
                timer: "resume",
                score: this.gamePreferences.score,
              };
            },
          },
          {
            text: "Okay",
            handler: async () => {
              this.gamePreferences = { score: 0 };
              await this.$router.replace(pageDefaultBackLink);
            },
          },
        ],
      });
      return alert.present();
    },
    async routerBack(pageDefaultBackLink) {
      if (
        this.gamePreferences.score != 0 &&
        typeof this.gamePreferences.score != "undefined"
      ) {
        // pause timer when dialog is popup
        this.gamePreferences = {
          timer: "pause",
          score: this.gamePreferences.score,
        };
        this.presentAlertConfirm(pageDefaultBackLink);
      } else {
        await this.$router.replace(pageDefaultBackLink);
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Exo:wght@400;500&display=swap");

ion-title {
  font-family: "Exo", sans-serif;
  font-weight: bold;
}
</style>
