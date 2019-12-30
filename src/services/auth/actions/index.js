import sha256 from 'js-sha256'
import cookie from 'js-cookie'
import config from '../config'
import jwt from 'jsonwebtoken'

// import { createSockets } from './sockets.js'

const timeout = ms => { return new Promise(resolve => { setTimeout(resolve, ms) }) }

const Authorize = function (commit, data, domain) {
  const { accessToken, refreshToken } = data

  // Define cookie tokens on login
  if (accessToken && refreshToken) {
    if (window.__wz_debug) console.log('Set cookie for domain:', domain)
    cookie.set('accessToken', accessToken, { domain: `.${domain}` })
    cookie.set('refreshToken', refreshToken, { domain: `.${domain}` })
    const decodedToken = jwt.decode(accessToken)
    commit(`SET_DAT`, decodedToken)
  }

  commit('SET_JW_TOKENS', { data })
  commit('SET_AUTH', true)
}

export function createActions (adapter, store, app) {
  return {
    make_auth: async ({ commit, state }, { login, password }) => {
      let result = false
      if (!state.isAuth) {
        result = await adapter.post('/login', { login: login.toLowerCase(), password: sha256(`${login.toLowerCase()}!${password}`) }, { __temporary_oldScheme: true })
      }
      if (result) {
        Authorize(commit, result, adapter.baseHost)
        store.dispatch('auth/redirectToSubdomain')
      }
    },
    redirectToSubdomain ({ commit, state }, redirectTo = null) {
      console.log('redirectTo', redirectTo)
      // TODO: refactoring this method

      /*
      ВНИМАНИЕ! НЕ УДАЛЯТЬ! Заблокировал временно, т.к. что-то странное происходит, когда в куках есть последний аккаунт, а логинишься под другим пользователем
      const lastAccountUse = cookie.get('lastAccountUse', { domain: adapter.baseHost })
      */
      const lastAccountUse = null

      if (redirectTo) {
        window.location.href = `${adapter.defaulSchema}${redirectTo}.${adapter.baseHost}${adapter.isLocal ? `:${adapter.port}` : ''}${window.__wz_debug ? '?__wz_debug=true' : ''}`
      } else if (lastAccountUse) {
        window.location.href = `${adapter.defaulSchema}${lastAccountUse}.${adapter.baseHost}${adapter.isLocal ? `:${adapter.port}` : ''}${window.__wz_debug ? '?__wz_debug=true' : ''}`
      } else {
        // Get first account from account list if lastAccountUse is empty
        store.dispatch('backend/get_accounts_list').then(res => {
          let subdomain
          res.data.forEach(acc => { if (acc.role === 'owner' || !subdomain) subdomain = acc.subdomain })
          if (subdomain) window.location.href = `${adapter.defaulSchema}${subdomain}.${adapter.baseHost}${adapter.isLocal ? `:${adapter.port}` : ''}${window.__wz_debug ? '?__wz_debug=true' : ''}`
        })
      }
    },
    make_logout: async ({ commit, state }) => {
      adapter.post('/logout', { refreshToken: state.refreshToken }, { __temporary_oldScheme: true }) // TODO: проверить, тот ли токен используем, может акцесс?

      cookie.remove('accessToken', { domain: adapter.baseHost })
      cookie.remove('refreshToken', { domain: adapter.baseHost })

      store.dispatch('auth/redirectToSubdomain', 'app')

      commit('SET_AUTH', false)
    },
    make_refresh: async ({ commit, state }, token) => {
      if (window.__wz_debug) console.log('make_refresh', token, state.refreshToken)
      if (!token && !state.refreshToken) {
        app.$log.e(new Error('make_refresh: empty refresh token'), {extra: state})
        commit('SET_AUTH', false)
        return false
      }
      let refreshPending = parseInt(cookie.get('refreshPending', { domain: adapter.baseHost }))
      if (refreshPending) {
        // TODO: как-то запутано получилось, сделать нормально
        let oldAccessToken = state.accessToken
        if (window.__wz_debug) {
          console.log(`refreshPending: ${refreshPending}, oldAccessToken: ${oldAccessToken}`)
        }
        const pendingTimeout = 5000 // TODO: в константы, описать нормально
        if ((refreshPending < Date.now()) && (refreshPending >= Date.now() - pendingTimeout)) {
          let waitFor = Date.now() + pendingTimeout
          while (refreshPending && (Date.now() < waitFor)) {
            await timeout(150)
            refreshPending = parseInt(cookie.get('refreshPending', { domain: adapter.baseHost }))
          }
        } else {
          cookie.remove('refreshPending', { domain: adapter.baseHost })
        }
        let accessToken = cookie.get('accessToken', { domain: adapter.baseHost })
        let refreshToken = cookie.get('refreshToken', { domain: adapter.baseHost })
        if (accessToken && accessToken !== oldAccessToken) {
          let accessed = await adapter.post('/check-access', { accessToken }, { __temporary_oldScheme: true })
            .catch(e => {
              return false
            })
          if (accessed) {
            Authorize(commit, { accessToken, refreshToken }, adapter.baseHost)
            return true
          }
        }
      }

      cookie.set('refreshPending', Date.now().toString(), { domain: adapter.baseHost })
      const refreshData = await adapter.post('/refresh-tokens', { refreshToken: token || state.refreshToken }, { __temporary_oldScheme: true })
        .catch(e => {
          if (e.status === 401) {
            cookie.remove('refreshToken', { domain: adapter.baseHost })
            cookie.remove('lastAccountUse', { domain: adapter.baseHost })
          }
          return false
        })
      if (refreshData) {
        Authorize(commit, refreshData, adapter.baseHost)
      } else {
        commit('SET_AUTH', false)
        cookie.remove('refreshToken', { domain: adapter.baseHost })
        cookie.remove('lastAccountUse', { domain: adapter.baseHost })
      }
      cookie.remove('refreshPending', { domain: adapter.baseHost })

      return !!refreshData
    },
    local_check_and_reload_token ({ commit, state }) {
      if (window.__wz_debug) console.log('local_check_and_reload_token')
      if (state.DAT.exp - Math.round(new Date().getTime() / 1000) <= (window.__wz_debug ? 59.5 * 60 : config.time_before_expire)) {
        return store.dispatch('auth/make_refresh')
      } else {
        if (window.__wz_debug) console.log('true')
        return true // seems like tokens are okay
      }
    }
    // ...createSockets()
  }
}
