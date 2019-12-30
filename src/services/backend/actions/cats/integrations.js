export function integrations (adapter, store, app) {
  return {
    get_integrations: async ({commit, state}) => {
      const integrations = await adapter.get('/integrations', { auth: true, __temporary_oldScheme: true })
      commit('SET_INTEGRATIONS', integrations.data)
      return integrations.data
    },
    add_integration: async ({commit, state}, { crm, domain, marketplace, clientId, clientSecret, login, apiKey, choice, channel }) => {
      const object = {
        crm, domain
      }
      if (channel) {
        object.channel = channel
      }
      if (marketplace) {
        object.marketplace = marketplace
      }
      if (clientId) {
        object.clientId = clientId
      }
      if (login) {
        object.login = login
      }
      if (apiKey) {
        object.apiKey = apiKey
      }
      if (choice) {
        object.choice = choice
      }
      if (clientSecret) {
        object.clientSecret = clientSecret
      }
      const options = {}
      if (crm === 'amocrm_v2') {
        options.timeout = 25000
      }
      const integration = await adapter.post('/integrations', object, { auth: true, __temporary_oldScheme: true, ...options })
      store.dispatch('backend/get_integrations')
      return integration
    },
    get_amo_tariff: ({ commit, state }, { domain, login, apiKey, choice }) => {
      return adapter.get('/integrations/amoTariff', { auth: true, __temporary_oldScheme: true, query: { domain, login, apiKey, choice }, timeout: 10000 })
    },
    delete_integration: async ({ commit, state }, guid) => {
      const deleted = await adapter.delete(`/integrations/${guid}`, { auth: true, __temporary_oldScheme: true })
      store.dispatch('backend/get_integrations')
      return deleted
    },
    amocrm_get_deals: async ({ state, commit }, params) => {
      const result = await adapter.get(`/integrations/amocrm/deals/${params.contactDetailsId}`, {auth: true, __temporary_oldScheme: true})
      if (window.__wz_debug) console.log('amocrm_get_deals', result)
      if (result && result.data && result.data.deals && result.data.deals.length && (result.data.deals[result.data.deals.length - 1].id !== 0)) {
        result.data.deals.push({
          id: 0,
          name: app.$t('integrations.amocrm.add_new_deal')
        })
      }
      return result
    }
  }
}
