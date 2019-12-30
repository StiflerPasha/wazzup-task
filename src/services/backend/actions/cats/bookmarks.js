export function bookmarks (adapter, store) {
  return {
    getBookmarks: async ({ state, commit }) => {
      const bookmarks = await adapter.get('/bookmarks/', { auth: true, __temporary_oldScheme: true })
      commit('SET_BOOKMARKS', bookmarks.data)
    },
    addBookmark: async ({state, commit}, data) => {
      return adapter.post(`/bookmarks/`, data, { auth: true, __temporary_oldScheme: true })
    },
    updateBookmark: async ({state, commit}, data) => {
      await adapter.patch(`/bookmarks/${data.guid}`, data, { auth: true, __temporary_oldScheme: true })
      store.dispatch('backend/getBookmarks')
    }
  }
}
