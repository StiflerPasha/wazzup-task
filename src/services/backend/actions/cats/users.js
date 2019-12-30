import { TYPES } from '@/enums'

export function users (adapter, store) {
  return {
    getUsers: async ({ state, commit }) => {
      const users = await adapter.get('/users', { auth: true, __temporary_oldScheme: true })
      commit(TYPES.SET_USERS, users.data)
    },
    getCurrentUser: async ({ state, commit }) => {
      const user = await adapter.get('/users/current', { auth: true, __temporary_oldScheme: true })
      commit(TYPES.SET_USER, user.data)
    },
    deleteUser: async ({commit, state}, guid) => {
      await adapter.delete(`/users/${guid}`, { auth: true, __temporary_oldScheme: true })
      store.dispatch('backend/getUsers')
    },
    updateUser: async ({commit, state}, data) => {
      await adapter.patch(`/users/${data.userId}`, data, { auth: true, __temporary_oldScheme: true })
      store.dispatch('backend/getUsers')
    },
    updateCurrentUser: async ({commit, state}, data) => {
      console.log(data)
      await adapter.patch(`/users/current`, data, { auth: true, __temporary_oldScheme: true })
      store.dispatch('backend/getCurrentUser')
    },
    addUser: ({commit, state}, data) => {
      return adapter.post(`/users/`, data, { auth: true, __temporary_oldScheme: true })
    }
  }
}
