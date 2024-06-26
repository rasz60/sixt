import { createRouter, createWebHistory } from "vue-router";
import AboutView from "@/components/AboutView.vue";
import LoggingList from "@/components/LoggingList.vue";
import LoggingDetails from "@/components/LoggingDetails.vue";
const routes = [
  {
    path: "/",
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
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
