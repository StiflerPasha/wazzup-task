import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    page_name: {},
    menu_open: true
  },
  actions: {},
  mutations: {
    OPEN_MENU: (state) => {
      Vue.set(state, 'menu_open', true)
    },
    CLOSE_MENU: (state) => {
      Vue.set(state, 'menu_open', false)
    },
    SET_PAGE_NAME: (state, data) => {
      state.page_name = data
    }
  },
  getters: {}
}
