import { TYPES } from '@/enums'

export function referrals (adapter, store) {
  return {
    getReferrals: async ({ state, commit }) => {
      const result = await adapter.get('/referrals', { auth: true, __temporary_oldScheme: true })
      commit(TYPES.SET_REFERRALS, result.data)
    },
    getPayments: async ({ state, commit }, query = {}) => {
      const result = await adapter.get('/referrals/payments', { auth: true, __temporary_oldScheme: true, query })
      commit(TYPES.SET_REFERRALS_PAYMENTS, result.data)
    }
  }
}
