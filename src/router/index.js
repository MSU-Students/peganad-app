import { createRouter, createWebHistory } from "@ionic/vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/download",
    component: () => import("../components/slider-screen/SliderScreen.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../pages/home/HomePage.vue"),
  },
  {
    path: "/learn",
    name: "Learn",
    component: () => import("../pages/LearnPage.vue"),
  },
  {
    path: "/learn/:id",
    component: () => import("../pages/learn/LearnPageContent.vue"),
  },
  {
    path: "/game",
    name: "Game",
    component: () => import("../pages/GamePage.vue"),
  },
  {
    path: "/game/:id",
    name: "Playing",
    component: () => import("../pages/game/GamePageContent.vue"),
  },
  {
    path: "/score",
    component: () => import("../pages/score/ScorePageContent.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
