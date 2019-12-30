import Vue from 'vue'
import Vuex from 'vuex'

import chat from 'chat/store.js'
import settings from 'settings/store.js'

if (window.__wz_debug) {
  console.log('ENV:', `${process.env.NODE_ENV}:${process.env.PORT}`)
}

Vue.use(Vuex)
let ENV
if (process.env.NODE_ENV === 'production') {
  ENV = 'production'
} else if (process.env.NODE_ENV === 'development') {
  ENV = 'development'
} else {
  ENV = 'local'
}

if (window.__wz_debug) {
  console.log('ENV:', `${process.env.NODE_ENV}:${process.env.PORT}`)
}

function getNvaigatorLanguage () {
  let lang = navigator.language.substr(0, 2)
  if ((lang === 'ru') || (lang === 'be') || (lang === 'uk') || (lang === 'ky') || (lang === 'ab') || (lang === 'mo') || (lang === 'et') || (lang === 'lv') || (lang === 'kk')) {
    return 'ru'
  } else {
    return 'en'
  }
}

const CreateStore = function () {
  const store = new Vuex.Store({
    modules: {
      chat,
      settings
    },
    state: {
      language: getNvaigatorLanguage(),
      screen_width: 0,
      screen_height: 0,
      menu_open_mobile: false,
      app: 'chat',
      env: ENV,
      port: process.env.PORT || 80,
      socket_connection: false
    },
    actions: {},
    mutations: {
      SOCKET_CONNECTION: (state, status) => {
        state.socket_connection = status
      },
      SET_DEVICE_WIDTH: (state, { data, height }) => {
        const object = {
          width: data,
          height: height,
          device: data >= 1200 ? 5
            : data >= 992 ? 4
              : data >= 768 ? 3 : data >= 544 ? 2 : 1
        }
        Vue.set(state, 'screen_width', object)
      },
      OPEN_MOBILE_MENU: (state) => {
        Vue.set(state, 'menu_open_mobile', true)
      },
      CLOSE_MOBILE_MENU: (state) => {
        Vue.set(state, 'menu_open_mobile', false)
      },
      SET_APP: (state, app) => {
        Vue.set(state, 'app', app)
      }
    },
    getters: {
      device (state) {
        return state.screen_width.device
      },
      device_width (state) {
        return state.screen_width.width
      },
      device_height (state) {
        return state.screen_width.height
      },
      env (state) {
        return state.env
      }
    }
  })

  // store.watch(state => state.socket_connection, (newValue) => {
  //   if (newValue === false) {
  //     store.commit('auth/SET_AUTH', false)
  //   }
  // })
  return store
}

export default CreateStore
