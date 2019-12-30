import TypeEventMessage from 'backend_views/TypeEventMessage.vue'
import Page404 from 'backend_views/404.vue'

export default [
  {
    path: ':type/:event',
    name: 'backend-type-message',
    component: TypeEventMessage
  },
  {
    path: '/backend/*',
    name: 'backend-404',
    component: Page404
  }
]
