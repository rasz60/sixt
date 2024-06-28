import { createRouter, createWebHashHistory } from "vue-router";
import MainView from "@/components/MainView.vue";
import AboutView from "@/components/AboutView.vue";
import LoggingList from "@/components/LoggingList.vue";
import LoggingDetails from "@/components/LoggingDetails.vue";
const routes = [
  {
    path: "/",
    name: "main",
    component: MainView,
  },
  {
    path: "/about",
    name: "introduce",
    component: AboutView,
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
