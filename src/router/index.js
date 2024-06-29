import { createRouter, createWebHashHistory } from "vue-router";
import MainPage from "@/components/MainPage.vue";
import AboutMe from "@/components/AboutMe.vue";
import LoggingList from "@/components/LoggingList.vue";
import LoggingDetails from "@/components/LoggingDetails.vue";
const routes = [
  {
    path: "/",
    name: "MainPage",
    component: MainPage,
  },
  {
    path: "/about",
    name: "AboutMe",
    component: AboutMe,
  },
  {
    path: "/logging",
    name: "loggingList",
    component: LoggingList,
  },
  {
    path: "/logging/:seq",
    name: "loggingDetails",
    component: LoggingDetails,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    // 항상 맨 위로 스크롤
    return {
      top: 0,
    };
  },
  routes,
});

export default router;
