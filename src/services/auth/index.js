import cookie from 'js-cookie'
import jwt from 'jsonwebtoken'

import { createAdapter } from 'main/adapter'
import { createActions } from './actions/'
import { createMutations } from './mutations/'
import { createGetters } from './getters/'
import { createWatchers } from './watchers/'

export default function install ({ store, options, app }) {
  const moduleName = 'auth'
  const version = 'v1'
  const adapter = createAdapter({
    service: true,
    serviceBase: moduleName,
    version
  }, store, app)
  store.registerModule(moduleName, {
    namespaced: true,
    state: {
      expiresIn: false,
      accessToken: cookie.get('accessToken', { domain: adapter.baseHost }) || false,
      refreshToken: cookie.get('refreshToken', { domain: adapter.baseHost }) || false,
      isAuth: null,
      tokenFromQuery: false,
      integration: false,
      DAT: {},
      LOC: {}
    },
    actions: {
      init: async ({ commit, state }) => {
        if (window.__wz_debug) console.log('Auth service inits')

        let cookieLoc = cookie.get('__x_LOC', { domain: adapter.baseHost })
        let LOC
        if (cookieLoc) {
          try { LOC = JSON.parse(cookieLoc) } catch (e) { void (0) }
        }

        if (LOC && LOC.country) {
          commit('SET_LOC', LOC)
        } else {
          // TODO: кажется это какой-то костыль, переделать
          adapter.get('https://ipinfo.io/json', { full: true })
            .then(locationData => {
              commit('SET_LOC', locationData.data)
              cookie.set('__x_LOC', JSON.stringify(locationData.data), { domain: adapter.baseHost })
            }).catch(e => {
              setTimeout(() => {
                adapter.get('https://ipinfo.io/json', { full: true })
                  .then(locationData => {
                    commit('SET_LOC', locationData.data)
                    cookie.set('__x_LOC', JSON.stringify(locationData.data), { domain: adapter.baseHost })
                  }).catch(e => e)
              }, 5000)
            })
        }
        commit('SET_QUERY_TOKEN_FLAG', !!app.$route.query.token)

        // Set accessToken from email url
        if (app.$route.query.accessToken) {
          const { accessToken, refreshToken } = app.$route.query
          cookie.set('accessToken', accessToken, { domain: adapter.baseHost })
          cookie.set('refreshToken', refreshToken, { domain: adapter.baseHost })
          console.log('query accessToken', accessToken)
        }

        const urlToken = app.$route.query.token
        const cookieAccessToken = cookie.get('accessToken', { domain: adapter.baseHost })
        const cookieRefreshToken = cookie.get('refreshToken', { domain: adapter.baseHost })

        console.log(`Init cookies for ${adapter.baseHost}:`, `cookieAccessToken: ${cookieAccessToken}`)
        console.log(`Init cookies for ${adapter.baseHost}:`, `cookieRefreshToken: ${cookieRefreshToken}`)

        console.log('adapter.isApp', adapter.isApp)

        const accessToken = urlToken || cookieAccessToken
        const refreshToken = urlToken ? false : cookieRefreshToken

        let accessed = false
        if (accessToken) accessed = await adapter.post('/check-access', { accessToken }, { __temporary_oldScheme: true }).catch(e => { return false })
        if (!accessed) {
          if (refreshToken) {
            accessed = await store.dispatch('auth/make_refresh', refreshToken)
            console.log('refreshToken accessed', accessed)
          } else {
            commit('SET_AUTH', false)

            if (!adapter.isApp) {
              cookie.remove('accessToken', { domain: adapter.baseHost })
              store.dispatch('auth/redirectToSubdomain', 'app')
            }
          }
        }
        if (accessed) {
          console.log('SET_AUTH', true)
          commit('SET_AUTH', true)
          if (adapter.isApp) {
            store.dispatch('auth/redirectToSubdomain')
          } else {
            const decodedToken = jwt.decode(accessToken)
            store.commit(`${moduleName}/SET_DAT`, decodedToken)
            console.log('commit', decodedToken)
            store.dispatch('backend/get_account_info')
            store.dispatch('backend/getCurrentUser')
            console.log('backend/get_account_info dispatched')
          }
        }
      },
      ...createActions(adapter, store, app)
    },
    mutations: {
      ...createMutations(store)
    },
    getters: {
      ...createGetters()
    }
  })

  createWatchers({ store, moduleName, app })
}
