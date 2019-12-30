import TypeEvent from 'error_views/TypeEvent.vue'
import TypeEventMessage from 'error_views/TypeEventMessage.vue'
import Page404 from 'error_views/404.vue'

export default [
  {
    path: ':type(internal-error)',
    name: 'error-type',
    component: TypeEvent
  },
  {
    path: ':type/:event',
    name: 'error-type-message',
    component: TypeEventMessage
  },
  {
    path: '/error/*',
    name: 'error-404',
    component: Page404
  }
]
