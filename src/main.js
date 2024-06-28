import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// Vuetify
import vuetify from "./plugins/vuetify";
import common from "@/assets/js/common";
let app = createApp(App);
app.config.globalProperties.commonjs = common;

app.use(store).use(router).use(vuetify).mount("#app");
