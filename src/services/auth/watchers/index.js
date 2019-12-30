// import * as socket from './sockets'
import cookie from 'js-cookie'

export function createWatchers ({ store, moduleName, app }) {
  // HOT FIX
  // const wsHost = app.$APP_ENV === 'production' ? `https://ws.wazzup24.com` : `https://ws.dev-wazzup24.com`
  const wsHost = app.$APP_ENV === 'production' ? `https://ws1.wazzup24.com` : `https://ws.dev-wazzup24.com`
  // const localhost = 'http://localhost:4000'
  const haveTokenInUrl = app.$route.query.token
  const baseHost = `${app.$APP_ENV !== 'production' ? 'dev-' : ''}wazzup24.com`

  store.watch(state => state[moduleName].isAuth, (newValue) => {
    if (newValue) {
      store.commit(`${moduleName}/SET_JW_TOKENS`, {
        data: {
          accessToken: haveTokenInUrl || cookie.get('accessToken', { domain: baseHost }),
          refreshToken: haveTokenInUrl ? false : cookie.get('refreshToken', { domain: baseHost })
        },
        tokenInUrl: haveTokenInUrl
      })
    } else {
      store.commit(`${moduleName}/SET_JW_TOKENS`, {
        data: {
          accessToken: false,
          refreshToken: false
        },
        tokenInUrl: haveTokenInUrl })
    }
  })

  store.subscribe((mutation, state) => {
    if (mutation.type === 'backend/set_account') {
      const { account } = state.backend
      if (account && account.id) {
        console.log('Socket connect account.id:', account.id)
        app.$socket.connect(wsHost, account.id)
      } else {
        store.commit(`${moduleName}/SET_DAT`, {})
        const tokenFromQuery = store.getters[`${moduleName}/is_query_token`]
        if (tokenFromQuery) {
          const dat = store.getters[`${moduleName}/dat`]
          const integrations = dat.integrations
          if (integrations) {
            if (integrations.crm === 'bitrix' && BX24) { // eslint-disable-line
              BX24.closeApplication() // eslint-disable-line
            }
          }
        }
      }
    }
  })

  store.watch(state => state[moduleName].DAT, (newValue) => {
    if (newValue.integration && !store.state.auth.integration) {
      store.commit(`${moduleName}/SET_INTEGRATION_TRUE`)
    }
    store.commit(`${moduleName}/SET_JW_TOKENS`, { data: {
      expiresIn: newValue.exp || false
    }})
  })
}
