<template>
  <base-layout
    :pageTitle="`Learn ${routerParam}`.toUpperCase()"
    toolbarColor="violet"
    statusBarColor="#ec29fa"
    pageDefaultBackLink="/learn"
    :routerParam="routerParam"
  >
    <div class="wrapper ion-padding">
      <learn-card-content :routerParam="routerParam" color="pink">
      </learn-card-content>
    </div>
  </base-layout>
</template>

<script>
import LearnCardContent from "../../components/learn-card/LearnCardContent.vue";
import componentUtil from "../../utils/component.util.js";

export default {
  name: "LearnContentPage",
  components: {
    LearnCardContent,
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
      await componentUtil.statusBar("#ec29fa");
    },
  },
};
</script>
