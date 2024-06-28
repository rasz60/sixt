import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Vuetify
import vuetify from "./plugins/vuetify";
import common from "@/assets/js/common";

let app = createApp(App);
app.config.globalProperties.commonjs = common;

app.use(router).use(vuetify).mount("#app");
