<template>
  <base-layout
    toolbarColor="pink"
    :statusBarColor="statusBarColor"
    pageDefaultBackLink="/game"
  >
    <div class="wrapper">
      <div class="sub-header-container ion-padding-top">
        <ion-text>
          <h1
            class="sub-header ion-text-center 
          ion-no-margin ion-padding-horizontal 
          animate__animated animate__tada"
          >
            Game Best Scores
          </h1>
        </ion-text>
      </div>

      <div class="sub-content">
        <ion-grid>
          <ion-row class="ion-justify-content-center ion-align-items-center">
            <ion-col class="ion-no-padding" size="12">
              <ion-card>
                <ion-card-content>
                  <ion-row
                    class="ion-justify-content-between ion-align-items-center"
                  >
                    <ion-col size="3">
                      <div>
                        <img src="../../../public/assets/design/animals.png" />
                      </div>
                    </ion-col>
                    <ion-col class="game-name ion-text-center" size="9"
                      ><h1>Animal Best Scores</h1></ion-col
                    >
                    <ion-col size="12">
                      <ion-list>
                        <ion-item
                          class="ion-text-center"
                          v-for="(score, index) in animalScore"
                          :key="index"
                        >
                          <ion-label color="pink">
                            {{ score.playerName + " - " + score.score }}
                          </ion-label>
                        </ion-item>
                      </ion-list>
                    </ion-col>
                  </ion-row>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col class="ion-no-padding" size="12">
              <ion-card>
                <ion-card-content>
                  <ion-row
                    class="ion-justify-content-between ion-align-items-center"
                  >
                    <ion-col size="3">
                      <div>
                        <img src="../../../public/assets/design/colors.png" />
                      </div>
                    </ion-col>
                    <ion-col class="game-name ion-text-center" size="9"
                      ><h1>Color Best Scores</h1></ion-col
                    >
                  </ion-row>
                  <ion-col size="12">
                    <ion-list>
                      <ion-item
                        class="ion-text-center"
                        v-for="(score, index) in colorScore"
                        :key="index"
                      >
                        <ion-label color="pink">
                          {{ score.playerName + " - " + score.score }}
                        </ion-label>
                      </ion-item>
                    </ion-list>
                  </ion-col>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col class="ion-no-padding" size="12">
              <ion-card>
                <ion-card-content>
                  <ion-row
                    class="ion-justify-content-between ion-align-items-center"
                  >
                    <ion-col size="3">
                      <div>
                        <img src="../../../public/assets/design/numbers.png" />
                      </div>
                    </ion-col>
                    <ion-col class="game-name ion-text-center" size="9"
                      ><h1>Number Best Scores</h1></ion-col
                    >
                    <ion-col size="12">
                      <ion-list>
                        <ion-item
                          class="ion-text-center"
                          v-for="(score, index) in numberScore"
                          :key="index"
                        >
                          <ion-label color="pink">
                            {{ score.playerName + " - " + score.score }}
                          </ion-label>
                        </ion-item>
                      </ion-list>
                    </ion-col>
                  </ion-row>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col class="ion-no-padding" size="12">
              <ion-card>
                <ion-card-content>
                  <ion-row
                    class="ion-justify-content-between ion-align-items-center"
                  >
                    <ion-col size="3">
                      <div>
                        <img src="../../../public/assets/design/words.png" />
                      </div>
                    </ion-col>
                    <ion-col class="game-name ion-text-center" size="9"
                      ><h1>Word Best Scores</h1></ion-col
                    >
                    <ion-col size="12">
                      <ion-list>
                        <ion-item
                          class="ion-text-center"
                          v-for="(score, index) in wordScore"
                          :key="index"
                        >
                          <ion-label color="pink">
                            {{ score.playerName + " - " + score.score }}
                          </ion-label>
                        </ion-item>
                      </ion-list>
                    </ion-col>
                  </ion-row>
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
import {
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/vue";
import { gameControllerOutline, trophy } from "ionicons/icons";
import componentUtil from "../../utils/component.util.js";
import Localbase from "localbase";

let localDB = new Localbase("db");
localDB.config.debug = false;

export default {
  name: "ScorePageContent",
  components: {
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
  },
  data() {
    return {
      animalScore: {},
      colorScore: {},
      numberScore: {},
      wordScore: {},
      // icons
      gameControllerOutline,
      trophy,
      statusBarColor: "#f3128a",
    };
  },
  ionViewWillEnter() {
    this.statusBar();
  },
  created() {
    this.getScore();
  },
  methods: {
    // Business Login
    async getScore() {
      await Promise.all([
        (async () => {
          let animals = await localDB
            .collection("score")
            .doc("animals")
            .get();
          if (animals != null) {
            let animalScore = animals.score.sort((a, b) => b.score - a.score);
            this.animalScore = animalScore;
            console.log(this.animalScore);
          }
        })(),
        (async () => {
          let colors = await localDB
            .collection("score")
            .doc("colors")
            .get();
          if (colors != null) {
            let colorScore = colors.score.sort((a, b) => b.score - a.score);
            this.colorScore = colorScore;
            console.log(this.colorScore);
          }
        })(),
        (async () => {
          let numbers = await localDB
            .collection("score")
            .doc("numbers")
            .get();
          if (numbers != null) {
            let numberScore = numbers.score.sort((a, b) => b.score - a.score);
            this.numberScore = numberScore;
            console.log(this.numberScore);
          }
        })(),
        (async () => {
          let words = await localDB
            .collection("score")
            .doc("words")
            .get();
          if (words != null) {
            let wordScore = words.score.sort((a, b) => b.score - a.score);
            this.wordScore = wordScore;
            console.log(this.wordScore);
          }
        })(),
      ]).catch((err) => console.log(err));
    },
    // UI Logic
    async statusBar() {
      await componentUtil.statusBar(this.statusBarColor);
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

.game-name {
  font-size: 15px;
  font-family: "Exo", sans-serif;
}

.game-score {
  font-size: 15px;
  font-family: "Exo", sans-serif;
  color: rgb(10, 170, 10);
}

.wrapper {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.sub-header-container {
  background: url("../../../public/assets/design/game1.png");
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
  margin: 0px 10px 0px 10px;
  font-size: 20px;
  font-family: "Exo", sans-serif;
  font-weight: bold;
}

h1 {
  font-family: "Exo", sans-serif;
  font-weight: 550;
}
</style>
