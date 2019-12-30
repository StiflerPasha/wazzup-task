import Vue from 'vue'
import Router from 'vue-router'
import chatRouter from 'chat/router'
import settingsRouter from 'settings/router'
import errorRouter from 'error/router'
import backendRouter from 'backend/router'

import Chat from 'chat/index.vue'
import Settings from 'settings/index.vue'
import Page404 from 'main_views/404.vue'
import Error from 'error/index.vue'
import Backend from 'backend/index.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: {
        render: () => ({}),
        beforeCreate () {
          this.$router.push({ name: 'chat-main', params: { app: 'chat' } })
        }
      }
    },
    {
      path: '/:app(chat)',
      component: Chat,
      children: chatRouter
    },
    {
      path: '/:app(settings)',
      component: Settings,
      children: settingsRouter
    },
    {
      path: '/:app(error)',
      component: Error,
      children: errorRouter
    },
    {
      path: '/:app(backend)',
      component: Backend,
      children: backendRouter
    },
    {
      path: '/*',
      name: 'page404',
      component: Page404
    }
  ]
})
