import { TYPES } from '@/enums'

export function promocodes (adapter, store) {
  return {
    getPromoCodes: async ({ state, commit }) => {
      const result = await adapter.get('/promocodes')
      commit(TYPES.SET_PROMOCODES, result.data)
    },
    deletePromoCode: async ({commit, state}, code) => {
      return adapter.delete(`/promocodes/${code}`, { pushToAlerts: true })
    },
    updatePromoCode: ({commit, state}, { data, arrayForErrors }) => {
      return adapter.patch(`/promocodes/${data.code}`, data, { arrayForErrors })
    },
    addPromoCode: ({commit, state}, { data, arrayForErrors }) => {
      return adapter.post(`/promocodes/`, data, { arrayForErrors })
    }
  }
}
