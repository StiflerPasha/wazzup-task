export function bookmarks (adapter, store) {
  return {
    getBookmarks: async ({ state, commit }) => {
      try {
        const bookmarks = await adapter.get(
          '/bookmarks/',
          { auth: true, __temporary_oldScheme: true })
        commit('SET_BOOKMARKS', bookmarks)
      } catch (err) {
        throw err
      }
    },
    getBookmarksFilteredByFav: async ({state, commit}, isFav) => {
      if (isFav === 'all') {
        store.dispatch('backend/getBookmarks')
      } else {
        try {
          const bookmarks = await adapter.get(
            `/bookmarks/?filter=favorites&filter_value=${isFav}`,
            { auth: true, __temporary_oldScheme: true })
          commit('SET_BOOKMARKS', bookmarks)
        } catch (err) {
          throw err
        }
      }
    },
    getBookmarksFilteredByDate: async ({state, commit}, {start, end}) => {
      try {
        const bookmarks = await adapter.get(
          `/bookmarks/?filter=createdAt&filter_from=${start}&filter_to=${end}`,
          { auth: true, __temporary_oldScheme: true })
        commit('SET_BOOKMARKS', bookmarks)
      } catch (err) {
        throw err
      }
    },
    addBookmark: async ({state, commit}, data) => {
      try {
        await adapter.post(
          `/bookmarks/`,
          data,
          { auth: true, __temporary_oldScheme: true })
      } catch (err) {
        throw err
      }
    },
    updateBookmark: async ({state, commit}, data) => {
      try {
        await adapter.patch(
          `/bookmarks/${data.guid}`,
          data,
          { auth: true, __temporary_oldScheme: true })
      } catch (err) {
        throw err
      }
    }
  }
}
