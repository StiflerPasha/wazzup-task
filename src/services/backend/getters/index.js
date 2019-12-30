export function createGetters (store) {
  return {
    available_modules: (state) => {
      if (state.account && state.account.details && Array.isArray(state.account.details.__modules)) {
        return state.account.details.__modules
      } else {
        return []
      }
    },
    account: (state) => {
      return state.account
    },
    user: (state) => {
      return state.user
    },
    clients: (state) => {
      return state.clients
    },
    promocodes: (state) => {
      return state.promocodes
    },
    channels: (state) => {
      return state.channels
    },
    panels: (state) => {
      return state.panels
    },
    active_channels: (state) => {
      const object = {}
      const isIntegration = store.getters['auth/integration']
      let filter
      if (isIntegration) {
        const integration = store.getters['auth/integration_data']
        filter = integration && integration.channelsFilter
      }

      for (const channelId in state.channels) {
        if (state.channels[channelId].state !== 'blocked' && (!filter || filter.indexOf(channelId) >= 0)) {
          object[channelId] = state.channels[channelId]
        }
      }

      return object
    },
    channel: (state) => (channel) => {
      return state.channels[channel]
    },
    colors: (state) => (channel) => {
      return state.colors
    },
    amocrm_users: (state) => {
      return state.amocrm_users
    },
    messages: (state) => (contact) => {
      return state.messages[contact]
    },
    last_message: (state) => (contact) => {
      if (state.messages[contact]) {
        if (Object.keys(state.messages[contact]).length > 0) {
          return state.messages[contact][Object.keys(state.messages[contact])[Object.keys(state.messages[contact]).length - 1]]
        } else {
          return false
        }
      } else {
        return false
      }
    },
    contacts: (state) => {
      return state.contacts
    },
    currentContact: (state) => {
      return state.currentContact
    },
    contact: (state) => (contact, field = 'guid') => {
      let neededContact
      state.contacts.forEach((cont, i) => {
        if (cont[field] === contact) {
          neededContact = state.contacts[i]
        }
      })
      return neededContact
    },
    balance: (state) => {
      return state.billing.balance
    },
    affiliate_balance: (state) => {
      return state.billing.affiliate_balance
    },
    payments: (state) => {
      return state.billing.payments
    },
    offs: (state) => {
      return state.billing.offs
    },
    integrations: (state) => {
      return state.integrations
    }
  }
}
