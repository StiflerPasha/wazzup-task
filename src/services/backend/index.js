import { createAdapter } from 'main/adapter'
import { createActions } from './actions/'
import { createMutations } from './mutations/'
import { createGetters } from './getters/'
import { createWatchers } from './watchers/'

export default function install ({ store, options, app }) {
  const moduleName = 'backend'
  const version = 'v1'
  const adapter = createAdapter({
    service: true,
    version
  }, store, app)
  store.registerModule(moduleName, {
    namespaced: true,
    state: {
      account: {},
      accounts: [],
      user: {},
      users: [],
      clients: [],
      panels: {
        contact: {
          opened: false
        },
        menu: {
          opened: true
        }
      },
      promocodes: [],
      channels: {},
      contacts: [],
      currentContact: {},
      messages: {},
      amocrm_users: {},
      integrations: [],
      referrals: [],
      refPayments: [],
      billing: {
        offs: [],
        payments: [],
        affiliate: []
      }
    },
    actions: {
      init: async ({ commit, state }) => {
        // store.dispatch('backend/get_channels')
        // console.log('Backend service inits')
      },
      ...createActions(adapter, store, app)
    },
    mutations: {
      ...createMutations()
    },
    getters: {
      ...createGetters(store)
    }
  })

  createWatchers({ store, moduleName, app })
}
