export function bookmarks (adapter) {
  return {
    fetchBookmarks: async ({commit}) => {
      try {
        const bookmarks = await adapter.get(
          '/bookmarks/',
          {auth: true, __temporary_oldScheme: true})

        commit('SET_BOOKMARKS', bookmarks)
      } catch (err) {
        throw err
      }
    },
    fetchBookmarksFilteredByFav: async ({commit, dispatch}, isFav) => {
      if (isFav === 'all') {
        dispatch('fetchBookmarks')
      } else {
        try {
          const bookmarks = await adapter.get(
            `/bookmarks/?filter=favorites&filter_value=${isFav}`,
            {auth: true, __temporary_oldScheme: true})

          commit('SET_BOOKMARKS', bookmarks)
        } catch (err) {
          throw err
        }
      }
    },
    fetchBookmarksFilteredByDate: async ({commit}, {start, end}) => {
      try {
        const bookmarks = await adapter.get(
          `/bookmarks/?filter=createdAt&filter_from=${start}&filter_to=${end}`,
          {auth: true, __temporary_oldScheme: true})

        commit('SET_BOOKMARKS', bookmarks)
      } catch (err) {
        throw err
      }
    },
    addBookmark: async ({dispatch}, data) => {
      try {
        await adapter.post(
          `/bookmarks/`,
          data,
          {auth: true, __temporary_oldScheme: true})

        dispatch('fetchBookmarks')
      } catch (err) {
        throw err
      }
    },
    updateBookmark: async ({dispatch}, data) => {
      try {
        await adapter.patch(
          `/bookmarks/${data.guid}`,
          data,
          {auth: true, __temporary_oldScheme: true})

        dispatch('fetchBookmarks')
      } catch (err) {
        throw err
      }
    }
  }
}
