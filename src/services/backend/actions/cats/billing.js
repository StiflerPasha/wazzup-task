import { TYPES } from '@/enums'

export function billing (adapter, store) {
  return {
    get_account_balance: async ({commit, state}) => {
      const balance = await adapter.get('/billing/balance', { auth: true, __temporary_oldScheme: true })
      commit('SET_BALANCE', balance.data.balance || 0)
      return balance
    },
    get_account_affiliate_balance: async ({commit, state}) => {
      const balance = await adapter.get('/billing/balance?affiliate=true', { auth: true, __temporary_oldScheme: true })
      commit('SET_AFFILIATE_BALANCE', balance.data.balance || 0)
      return balance
    },
    get_history_payments: async ({commit, state}) => {
      const payments = await adapter.get('/billing', {query: { credit: true, limit: 10000, direction: 'desc' }, auth: true, __temporary_oldScheme: true})
      commit('SET_PAYMENTS', payments.data)
      return payments.data
    },
    get_history_payments_offs: async ({commit, state}) => {
      const payments = await adapter.get('/billing', {query: { credit: false, limit: 10000, direction: 'desc' }, auth: true, __temporary_oldScheme: true})
      commit('SET_PAYMENTS_OFFS', payments.data)
      return payments.data
    },
    pay_yandex: async ({commit, state}, { formData }) => {
      return adapter.post('https://money.yandex.ru/eshop.xml', formData, { form: true, __temporary_oldScheme: true })
    },
    add_payment: async ({commit, state}, {provider, currency, sum, paymentId}) => {
      const object = {
        provider, currency, sum
      }
      if (paymentId) {
        object.paymentId = paymentId
      }
      return adapter.post('/billing', object, { auth: true, __temporary_oldScheme: true })
    },
    approve_payment: async ({commit, state}, data) => {
      return adapter.patch('/billing/approve', data, { auth: true, __temporary_oldScheme: true })
    },
    getAffiliateHistory: async ({commit, state}) => {
      const payments = await adapter.get('/billing', {query: { affiliate: true }, auth: true, __temporary_oldScheme: true})
      commit(TYPES.SET_AFFILIATE_PAYMENTS, payments.data)
      return payments.data
    },
    transferPayment: async ({commit, state}, { data, errorArguments }) => {
      const result = await adapter.post('/billing/transfer', data, { errorArguments })
      store.dispatch('backend/getAffiliateHistory').catch(e => e)
      store.dispatch('backend/get_account_affiliate_balance').catch(e => e)
      return result
    },
    withdrawPayment: async ({commit, state}, data) => {
      const result = await adapter.post('/billing/withdrawal', data, {auth: true, __temporary_oldScheme: true})
      store.dispatch('backend/getAffiliateHistory').catch(e => e)
      store.dispatch('backend/get_account_affiliate_balance').catch(e => e)
      return result
    },
    getExchangeRates: async ({commit, state}) => {
      const result = await adapter.get('/billing/exchangeRates')
      return result
    },
    getAffiliateAccountState: async ({commit, state}) => {
      const result = await adapter.get('/billing/affiliateAccountState')
      return result
    }
  }
}
