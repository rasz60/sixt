import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Vuetify
import vuetify from "./plugins/vuetify";
import common from "@/assets/js/common";
import "@/assets/style/_common.scss";

//Vuex
import { store } from "./store";

let app = createApp(App);
app.config.globalProperties.commonjs = common;

app.use(router).use(store).use(vuetify).mount("#app");
