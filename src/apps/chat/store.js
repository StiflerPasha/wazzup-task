import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    page_name: {},
    contact_open: false,
    is_mobile_searching: false
  },
  actions: {},
  mutations: {
    OPEN_MENU: (state) => {
      Vue.set(state, 'menu_open', true)
    },
    CLOSE_MENU: (state) => {
      Vue.set(state, 'menu_open', false)
    },
    TOGGLE_MOBILE_SEARCH: (state) => {
      Vue.set(state, 'is_mobile_searching', !state.is_mobile_searching)
    },
    SET_PAGE_NAME: (state, data) => {
      Vue.set(state, 'page_name', data)
    },
    SET_DEFAULT_STATES: (state) => {
      Vue.set(state, 'menu_open', false)
      Vue.set(state, 'is_mobile_searching', false)
    }
  },
  getters: {
    menu_state: (state) => {
      return state.menu_open
    }
  }
}
