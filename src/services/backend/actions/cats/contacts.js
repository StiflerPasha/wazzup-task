
import { TYPES } from '@/enums'

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

export function contacts (adapter, store, app) {
  return {
    add_contact: ({commit, state}, { name, phone }) => {
      return adapter.post('/contacts', { name, phone }, { auth: true, __temporary_oldScheme: true })
        .then(res => {
          store.dispatch('backend/getContacts')
          return res
        })
    },
    getContacts: async ({ state, commit }, params) => {
      const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = params || {}
      // не очень хорошее решение каждый раз проверку делать, но лучше так
      if (Object.keys(state.channels).length === 0) {
        await store.dispatch('backend/get_channels')
      }
      const result = await adapter.get('/contacts', {auth: true, __temporary_oldScheme: true, query: { limit, offset }})
      // TODO: временно, ловим ошибку, убрать
      if (!result.data) {
        app.$log.e(new Error(`Cannot read property 'length' of undefined`), {extra: {
          errNumber: 3,
          method: 'GET /contacts',
          query: { limit, offset },
          result
        }})
      } else {
        commit(TYPES.SET_CONTACTS, result.data)
      }
      return result
    },
    update_contact_no_answer: ({ state, commit }, { guid, channel }) => {
      return adapter.patch(`/contacts/${guid}`, { unanswered: 0 }, { auth: true, __temporary_oldScheme: true })
    }
  }
}
