<template>
  <base-layout
    :pageTitle="`Play ${routerParam}`.toUpperCase()"
    toolbarColor="pink"
    statusBarColor="#f3128a"
    pageDefaultBackLink="/game"
    :routerParam="routerParam"
  >
    <div class="wrapper ion-padding">
      <game-card-content
        :routerParam="routerParam"
        color="violet"
      ></game-card-content>
    </div>
  </base-layout>
</template>

<script>
import GameCardContent from "../../components/game-card/GameCardContent.vue";
import componentUtil from "../../utils/component.util.js";

export default {
  name: "GamePageContent",
  components: {
    GameCardContent,
  },
  data() {
    return {
      routerParam: this.$route.params.id,
    };
  },
  ionViewWillEnter() {
    this.statusBar();
  },
  methods: {
    async statusBar() {
      await componentUtil.statusBar("#f3128a");
    },
  },
};
</script>

<style scoped>
.wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  height: 100%;
}
</style>
