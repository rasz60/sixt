import { MENUS } from "../mutations_type.js";
import menuJson from "/public/json/_menus.json";

export const menus = {
  namespaced: true,
  state: () => ({
    menu: [],
  }),

  mutations: {
    [MENUS.GET_MENUS]() {
      this.menu = menuJson;
    },
  },

  getters: {
    getAllMenus: (state) => {
      this.GET_MENUS();
      return state.menus;
    },
  },

  actions: {
    getMenus: ({ commit }, v) => {
      commit(MENUS.GET_MENUS, v);
    },
  },
};
