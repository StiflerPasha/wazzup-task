import Chat from 'chat_views/Chat'
import Page404 from 'chat_views/404.vue'

export default [
  {
    path: '',
    name: 'chat-main',
    component: Chat
  },
  {
    path: ':id',
    name: 'chat-view',
    component: Chat
  },
  {
    path: '/chat/*',
    name: 'chat-404',
    component: Page404
  }
]
