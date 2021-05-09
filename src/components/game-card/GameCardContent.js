// import { Media } from "@ionic-native/media";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonItem,
  IonLabel,
} from "@ionic/vue";
import { mic, checkmarkOutline, closeOutline, pause } from "ionicons/icons";
import componentUtil from "../../utils/component.util.js";
import Localbase from "localbase";

let localDB = new Localbase("db");
localDB.config.debug = false;

export default {
  props: ["routerParam", "color"],
  components: {
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonItem,
    IonLabel,
  },
  data() {
    return {
      contents: {},
      generateRandomAnswers: [],
      tappedAnswer: false,
      tappedIndex: null,
      showGameContent: true,
      answerSelected: null,
      correctAnswer: null,
      isAnswerCorrect: false,
      isAnswerWrong: false,
      continueAnswer: false,
      newHighScore: false,
      nameInputted: true,
      displayContents: null,
      colorTapBtn: this.color,
      colorCheckBtn: "successoutline",
      playerName: "",
      contentPosition: 1,
      answerCounter: 0,
      score: 0,
      gameTimer: 10,
      currentTimer: 0,
      soundDelay: 500,
      delay: 1000,
      // icon
      mic,
      checkmarkOutline,
      closeOutline,
      pause,
    };
  },
  created() {
    this.fetchContent();
  },
  unmounted() {
    console.log("here!");
    this.showGameContent = true;
    this.nameInputted = false;
    this.newHighScore = false;
    this.contentPosition = 1;
    this.answerCounter = 0;
    this.score = 0;
    this.gameTimer = 10;
    this.playerName = "";
    clearTimeout(this.currentTimer);
  },
  watch: {
    gamePreferences: function(val) {
      if (val.timer == "pause" || val.timer == "resume") {
        this.timer("", "", "", val.timer, val.timer);
      }
    },
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
    /** BUSINESS LOGIC **/
    fetchContent() {
      localDB
        .collection("contents")
        .get()
        .then((contents) => {
          contents.forEach((content) => {
            if (content[this.routerParam]) {
              this.contents = content;
              this.generateRandomContents();
              this.generateRandomAnswer();
              this.displayContentOneByOne();
            }
          });
        });
    },
    displayContentOneByOne() {
      let routerParam = this.routerParam;
      let extractContent = this.contents[routerParam];

      const paginate = (array, index, size) => {
        // transform values
        index = Math.abs(parseInt(index));
        index = index > 0 ? index - 1 : index;
        size = parseInt(size);
        size = size < 1 ? 1 : size;

        // filter
        return [
          ...extractContent.filter((value, n) => {
            return n >= index * size && n < (index + 1) * size;
          }),
        ];
      };

      if (this.contentPosition <= extractContent.length) {
        let transform = paginate(extractContent, this.contentPosition, 1);
        this.displayContents = transform;
        this.timer("start", "", "");
      }
    },
    generateRandomContents() {
      let routerParam = this.routerParam;
      let extractContent = this.contents[routerParam];
      extractContent.sort(() => Math.random() - 0.5);
      this.displayContents = extractContent;
    },
    generateRandomAnswer() {
      let routerParam = this.routerParam;
      let extractContent = this.contents[routerParam];
      let answerArr = [];

      extractContent.forEach((content) => {
        answerArr.unshift(content.translatedName);
      });

      this.correctAnswer = this.displayContents[0].translatedName; // store correct answer
      answerArr.sort(() => Math.random() - 0.5); // random the current elements
      let newAnsArr = answerArr.filter((item) => item != this.correctAnswer); // Remove answer in array
      newAnsArr.length = 3; // Limit length
      newAnsArr.unshift(this.correctAnswer); // Add answer array
      newAnsArr.sort(() => Math.random() - 0.5); // random the new elements
      this.generateRandomAnswers = newAnsArr;
    },
    tapAnswer(index, answer) {
      if (index + 1) {
        this.answerSelected = answer;
        this.tappedIndex = index;
        this.tappedAnswer = true;
      }
    },
    checkAnswer() {
      if (this.answerSelected == this.correctAnswer) {
        this.colorTapBtn = "success";
        this.continueAnswer = true;
        this.isAnswerCorrect = true;
        this.score += 10 * this.gameTimer;
        this.answerCounter += 1;
        this.playSound("correct")
          .then((audio) => {
            audio.play();
          })
          .catch((err) => console.log(err));
        this.timer("", "stop", "");
      } else {
        this.colorCheckBtn = "dangeroutline";
        this.colorTapBtn = "danger";
        this.continueAnswer = true;
        this.isAnswerWrong = true;
        this.playSound("wrong")
          .then((audio) => {
            audio.play();
          })
          .catch((err) => console.log(err));
        this.timer("", "stop", "");
      }
    },
    continueAnswering() {
      if (this.contentPosition < this.contents[this.routerParam].length) {
        this.nextAnimation();
        this.tappedAnswer = false;
        this.continueAnswer = false;
        this.colorCheckBtn = "successoutline";
        this.contentPosition += 1;
        this.timer("", "", "restart");
        this.gamePreferences = { score: this.score };
      } else {
        this.isAnswerCorrect = false;
        this.isAnswerWrong = false;
        this.continueAnswer = false;
        this.showGameContent = false;
        this.tappedAnswer = false;
        this.tappedIndex = null;
        this.colorCheckBtn = "successoutline";
        this.contentPosition += 1;
        this.displayInputPlayerName();
      }
    },
    async displayInputPlayerName() {
      const doc = await localDB
        .collection("score")
        .doc(this.$route.params.id)
        .get();

      if (doc) {
        if (doc.score.length != 5) {
          console.log("here!");
          this.newHighScore = true;
        }
      } else {
        console.log("here!");
        this.newHighScore = true;
      }
    },
    async gameScore() {
      this.nameInputted = false;
      let self = this;
      let dataArr = [];
      let addScore = function(dataArr) {
        console.log("Add New Score!");
        let data = {
          score: self.score,
          playerName: self.playerName == "" ? "Unknown" : self.playerName,
        };
        dataArr.push(data);
        localDB
          .collection("score")
          .add({ score: dataArr }, self.$route.params.id);
      };
      // get documents
      const doc = await localDB
        .collection("score")
        .doc(this.$route.params.id)
        .get();

      if (doc) {
        if (doc.score.length != 5) {
          // add until top 5
          addScore(doc.score);
        } else {
          // detect if has new high score
          let score = doc.score.sort((a, b) => b.score - a.score);
          if (score[4].score < this.score) {
            score[4] = {
              score: this.score,
              playerName: this.playerName == "" ? "Unknown" : this.playerName,
            };
            doc.score = score;
            localDB
              .collection("score")
              .doc(this.$route.params.id)
              .update({ score: doc.score });
          }
        }
      } else {
        // if doc not exist addScore
        addScore(dataArr);
      }
    },
    async playSound(id) {
      let offAudio = true;
      if (offAudio) {
        const audio = document.getElementById(id);
        return audio;
      }
    },
    timer(start, stop, restart, pause, resume) {
      let self = this;

      let countDownTimer = function(timer) {
        if (typeof timer != "undefined") {
          self.gameTimer = timer;
        }
        if (self.gameTimer > 0) {
          self.currentTimer = setTimeout(() => {
            self.gameTimer -= 1;
            countDownTimer();
          }, self.delay);
          if (self.gameTimer <= 4) {
            self
              .playSound("countdown")
              .then(async (audio) => {
                console.log("play: ", audio.currentTime);
                await audio.play();
              })
              .catch((err) => console.log(err));
          }
        } else if (self.gameTimer == 0) {
          console.log("Timer Over!");
          self.tappedAnswer = true;
          self.continueAnswer = true;
          self.isAnswerWrong = true;
          self.colorCheckBtn = "dangeroutline";
          self.colorTapBtn = "danger";
          self
            .playSound("wrong")
            .then((audio) => {
              audio.play();
            })
            .catch((err) => console.log(err));
        }
      };

      if (start == "start") {
        countDownTimer();
      } else if (stop == "stop") {
        this.soundDelay = 500;
        clearTimeout(this.currentTimer);
        this.playSound("countdown").then((audio) => {
          audio.pause();
          audio.currentTime = 0;
        });
      } else if (restart == "restart") {
        this.gameTimer = 10;
      } else if (pause == "pause") {
        if (this.gameTimer != 0) {
          clearTimeout(this.currentTimer);
          if (this.gameTimer <= 4) {
            this.playSound("countdown").then((audio) => {
              audio.pause();
              console.log("pause: ", audio.currentTime);
            });
          }
        }
      } else if (resume == "resume") {
        this.soundDelay = 1000;
        countDownTimer(this.gameTimer);
      }
    },
    playAgain() {
      this.showGameContent = true;
      this.nameInputted = false;
      this.newHighScore = false;
      this.contentPosition = 1;
      this.answerCounter = 0;
      this.score = 0;
      this.gameTimer = 10;
      this.playerName = "";
      this.gamePreferences = { score: 0, timer: 0 };
      clearTimeout(this.currentTimer);
    },
    exitQuiz() {
      this.$router.replace("/game").then(() => {
        this.showGameContent = true;
        this.nameInputted = false;
        this.newHighScore = false;
        this.contentPosition = 1;
        this.answerCounter = 0;
        this.score = 0;
        this.gameTimer = 10;
        this.playerName = "";
        this.gamePreferences = { score: 0, timer: 0 };
        clearTimeout(this.currentTimer);
      });
    },
    /** UI LOGIC **/
    async nextAnimation() {
      const animation = await componentUtil.slideAnimation(
        ".card-content",
        800,
        "translateX(0px)",
        "translateX(350px)",
        "1",
        "0.2"
      );
      animation.play();
      setTimeout(async () => {
        const animation = await componentUtil.slideAnimation(
          ".card-content",
          800,
          "translateX(-350px)",
          "translateX(0px)",
          "0.2",
          "1"
        );
        animation.play();
        this.displayContentOneByOne();
        this.generateRandomAnswer();
        this.isAnswerCorrect = false;
        this.isAnswerWrong = false;
        this.tappedIndex = null;
        this.colorTapBtn = this.color;
      }, 800);
    },
  },
};
