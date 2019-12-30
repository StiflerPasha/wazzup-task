import { TYPES } from '@/enums'

export function clients (adapter, store) {
  return {
    getClients: async ({ state, commit }) => {
      const result = await adapter.get('/partners', { auth: true, __temporary_oldScheme: true })
      commit(TYPES.SET_CLIENTS, result.data)
    },
    addClient: async ({ state, commit }, { data }) => {
      let res = await adapter.post('/partners', data)
      store.dispatch('backend/getClients').catch(e => e)
      return res
    }
  }
}
