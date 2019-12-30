import { TYPES } from '@/enums'
import cookie from 'js-cookie'

export function account (adapter, store, app) {
  return {
    get_account_info: async ({commit, state}) => {
      try {
        const account = await adapter.get('/accounts/current', { auth: true, __temporary_oldScheme: true })
        if (account) {
          app.$log.setExtraContext({ account })
          if (account && account.data) {
            app.$log.setUserContext({
              id: account.data.id,
              email: account.data.regEmail
            })
          }
        }
        // const account = await adapter.get('/accounts/', { auth: true, __temporary_oldScheme: true })
        cookie.set('lastAccountUse', account.data.subdomain, { domain: `.${adapter.baseHost}` })

        commit(TYPES.SET_ACCOUNT, account.data || {})
        return account
      } catch (e) {
        // TODO: 400 устарел, оставлен для совместимости, пока не обновлен бекенд, новый - 403
        if (e.error) {
          // TODO: сделать более вменяемую логику, а то получится несколько редиректов acc1 => app => acc2. и это все только из за получения всех аккаунтов
          if (((e.error.status === 401) || (e.error.status === 403)) && !adapter.isApp) {
            store.dispatch('auth/redirectToSubdomain', 'app')
          } else if ((e.error.status === 400) && adapter.isApp) {
            store.dispatch('auth/redirectToSubdomain')
          }
        }
      }
    },
    get_accounts_list: async ({commit, state}) => {
      const account = await adapter.get('/accounts', { auth: true, __temporary_oldScheme: true })
      commit(TYPES.SET_ACCOUNTS_LIST, account.data || {})
      return account
    },
    update_account_info: async ({commit, state}, data) => {
      await adapter.patch('/accounts/current', data, { auth: true, __temporary_oldScheme: true })
      return store.dispatch('backend/get_account_info')
    },
    getAccountCurrency: async ({commit, state}, id) => {
      const result = await adapter.get(`/accounts/${id}/currency`)
      return result.data
    },
    getSpecificAccount: async ({commit, state}, id) => {
      const result = await adapter.get(`/accounts/specific/${id}`)
      return result.data
    }
  }
}
