import { createRouter, createWebHashHistory } from "vue-router";
import MainPage from "@/components/MainPage.vue";
import AboutMe from "@/components/about/AboutMe.vue";
import LoggingList from "@/components/devlog/LoggingList.vue";
import LoggingDetails from "@/components/devlog/LoggingDetails.vue";
import CodingTest from "@/components/codingTest/CodingTest.vue";

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
    path: "/logging/:g/:p",
    name: "loggingDetails",
    component: LoggingDetails,
  },
  {
    path: "/codingTest",
    name: "CodingTest",
    component: CodingTest,
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
