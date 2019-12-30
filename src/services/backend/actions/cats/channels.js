export function channels (adapter, store) {
  return {
    get_channels: async ({ state, commit }) => {
      const channels = await adapter.get('/channels', { auth: true, __temporary_oldScheme: true })
      commit('SET_CHANNELS', channels.data)
    },
    delete_channel: async ({commit, state}, guid) => {
      await adapter.delete(`/channels/${guid}`, { auth: true, __temporary_oldScheme: true })
      return store.dispatch('backend/get_channels')
    },
    add_channel: ({commit, state}) => {
      return adapter.post('/channels', { transport: 'whatsapp' }, { auth: true, __temporary_oldScheme: true })
    },
    reinit_channel: ({commit, state}, guid) => {
      return adapter.post(`/channels/${guid}/reinit`, { guid }, { auth: true, __temporary_oldScheme: true })
    },
    accept_channel: ({commit, state}, { guid, name }) => {
      return adapter.post(`/channels/${guid}/accept`, { guid, name }, { auth: true, __temporary_oldScheme: true })
    },
    update_channel: ({commit, state}, { guid, name, tariff, blocked }) => {
      const blockedState = state.channels[guid].state === 'blocked' === blocked
      const body = {
        guid, name, tariff
      }
      if (!blockedState) {
        body['blocked'] = blocked
      }
      return adapter.patch(`/channels/${guid}`, body, { auth: true, __temporary_oldScheme: true })
    }
  }
}
