<template>
  <base-layout>
    <ion-slides>
      <ion-slide>
        <div class="slide">
          <img src="../../../public/assets/design/numbers.png" />
          <h1 class="slide1-text ">Peganad App</h1>
          <p class="ion-text-justify">
            The <b>Pegenad App</b> is from the Meranaw word which means “To
            learn”. <b>Peganad App is a mobile learning application</b> that
            teaches basic Meranaw vocabulary that will focus on the children as
            the primary user from ages 4-8. The learning application aims to
            help the children by providing alternative and interactive learning
            materials. It offers 70 words through a series of lesson and game
            with native speaker audio clips.
          </p>
        </div>
      </ion-slide>

      <ion-slide>
        <div class="slide">
          <img src="../../../public/assets/design/study.png" />
          <h1 class="slide2-text">Learn</h1>
          <p>
            Learn useful basic Meranaw language like Numbers, Colors, Animals
            and some Basic words (noun). Every words would guide the children by
            showing a picture and listening to a native speaker audio clip
            provided by the application.
          </p>
        </div>
      </ion-slide>

      <ion-slide>
        <div class="slide">
          <img src="../../../public/assets/design/game.png" />
          <h1 class="slide3-text">Game</h1>
          <p>
            Peganad App has mini-game (Multiple choice game) at the end to test
            the learners of what they have learned. This mini-game will have a
            set of words to be translated depends on the category you choose.
          </p>
        </div>
      </ion-slide>

      <ion-slide>
        <div class="slide-4">
          <div v-if="!isOnline">
            <div class="internet">Internet Lost!</div>
            <div class="note">
              Please connect to the internet to Download the content. Thank you!
            </div>
          </div>
          <div v-if="isOnline">
            <img src="../../../public/assets/design/congrats.png" />
            <h1 class="slide4-text">Download Contents</h1>
            <ion-button
              @click="downloadContent()"
              :disabled="!isOnline"
              color="success"
              >Download<ion-icon slot="end" :icon="downloadOutline"></ion-icon
            ></ion-button>
          </div>
        </div>
      </ion-slide>
    </ion-slides>
  </base-layout>
</template>

<script>
import SliderScreen from "./SliderScreen.js";
export default SliderScreen;
</script>

<style scoped src="./SliderScreen.css"></style>
