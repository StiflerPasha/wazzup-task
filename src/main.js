/* eslint-disable */
import Vue from 'vue'
import VueClipboards from 'vue-clipboards';
import App from './App'
import Alerts from './Alerts'
import router from './router.js'
import CreateStore from './store'
import customPlugin from './plugins/custom'
import socketsPlugin from './plugins/sockets/'
import storeServices from 'main/services'
import eventBus from './utils/eventBus'
import cookie from 'js-cookie'

import VeeValidate, { Validator } from 'vee-validate'
import en from 'vee-validate/dist/locale/en'
import ru from 'vee-validate/dist/locale/ru'

Validator.localize('en', en)
Validator.localize('ru', ru)
Vue.use(VueClipboards);

require('./utils/filters');

// Bootstrap
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@mdi/font/css/materialdesignicons.css'
import Icon from 'vue-material-icon'

// Media query helper
import vMediaQuery from 'v-media-query'

const store = CreateStore ()

Vue.config.productionTip = false
Vue.config.devtools = (store.state.env !== 'production')

// Translations
import { createTranslations } from './utils/translations'
const translateFunc = createTranslations(store)
Vue.prototype.$translations = translateFunc
Vue.prototype.$t = translateFunc.resolve

import { createFormattingUtils } from './utils/formatting'
Vue.prototype.$f = createFormattingUtils(store)

import { createExternalScriptsHandler } from './utils/external-scripts'
Vue.prototype.$waitForScript = createExternalScriptsHandler(store).waitForScript

import { createLogger } from './utils/logger'
const logger = createLogger(store, window.location.href)
Vue.prototype.$log = logger
Vue.prototype.$debug = logger.debugMode
if (window.__wz_debug) {
  console.log('VUE', Vue, logger)
}


Vue.use(BootstrapVue)
Vue.use(vMediaQuery)
Vue.use(customPlugin, store)
Vue.use(socketsPlugin, store)

Vue.use(VeeValidate, {
  events: 'change',
  inject: false,
  locale: store.state.language || ' ru',
  strict: process.env.NODE_ENV !== 'production'
})

const alerts = Vue.prototype.$a = new Vue(Alerts).$mount()
document.body.appendChild(alerts.$el)



// TODO: времянка, сделать нормально
if (document.referrer) {
  cookie.set((document.referrer.indexOf('wazzup24.com') >= 0) ? '__x_own_referrer' : '__x_referrer', document.referrer, { domain: 'wazzup24.com' })
}

Vue.component('icon', Icon)

function createApp () {
  const app = new Vue({
    router,
    store,
    components: { App },
    template: '<App/>'
  })

  for (const service in storeServices) {
    storeServices[service]({ store, app })
    store.dispatch(`${service}/init`)
  }

  Vue.prototype.$eb = new Vue({ ...eventBus, store })

  app.$mount('#app')
}

export default createApp
