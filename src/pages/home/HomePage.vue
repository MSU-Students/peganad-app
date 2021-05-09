<template>
  <base-layout>
    <div class="wrapper ion-padding">
      <ion-text color="medium">
        <h1
          class="sub-header ion-no-margin ion-padding-horizontal 
          animate__animated animate__bounceInDown"
        >
          Meranaw Learning App
        </h1>
      </ion-text>
      <div class="sub-content ion-padding-top">
        <div>
          <ion-card
            v-for="(card, index) in cards"
            :key="index"
            :class="`animate__animated ${card.animateCard}`"
            :color="card.color"
            button="true"
            :routerLink="card.route"
          >
            <ion-grid>
              <ion-row>
                <ion-col size="8">
                  <ion-card-header
                    class="card-header ion-no-padding ion-padding-start"
                  >
                    <ion-card-title>{{ card.title }}</ion-card-title>
                    <ion-card-subtitle>{{ card.subtitle }}</ion-card-subtitle>
                  </ion-card-header>
                  <img
                    :src="require(`../../../public/assets/design/${card.img}`)"
                    width="180"
                  />
                </ion-col>
                <ion-col class="second-column">
                  <ion-button shape="round" :routerLink="card.route">
                    <ion-icon
                      :class="
                        `animate__animated animate__headShake animate__slow animate__infinite ${card.animateArrow}`
                      "
                      slot="icon-only"
                      :icon="arrowForwardOutline"
                    ></ion-icon>
                  </ion-button>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card>
        </div>
      </div>
    </div>
  </base-layout>
</template>

<script>
import HomePage from "./HomePage.js";
export default HomePage;
</script>

<style scoped src="./HomePage.css"></style>
