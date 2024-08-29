import { createStore } from "vuex";
import { menus } from "./modules/Menus";

export const store = createStore({
  modules: { menus },
});
