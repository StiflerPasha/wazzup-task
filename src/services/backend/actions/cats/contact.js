
import { TYPES } from '@/enums'

export function contact (adapter, store) {
  return {
    getCurrentContact: async ({ state, commit }, params) => {
      const result = await adapter.get(`/contacts/${params.id}`, {auth: true, __temporary_oldScheme: true})
      if (result) {
        result.id = params.id
      }
      commit(TYPES.SET_CURRENT_CONTACT, result)
    },
    updateCurrentContact: async ({ state, commit }, params) => {
      await adapter.patch(`/contacts/${params.id}`, params, {auth: true, __temporary_oldScheme: true})
      await store.dispatch('backend/getCurrentContact', {id: params.id})
    },
    updateContactTags: async ({ state, commit }, params) => {
      await adapter.patch(`/contacts/${params.id}/tags`, {
        tags: params.tags
      }, {auth: true, __temporary_oldScheme: true})
      await store.dispatch('backend/getCurrentContact', {id: params.id})
    },
    addContactDetail: async ({ state, commit }, params) => {
      const result = await adapter.post(`/contacts/${params.id}/contactDetails`, params.data, {auth: true, __temporary_oldScheme: true})
      await store.dispatch('backend/getCurrentContact', {id: params.id})
      return result
    },
    updateContactDetailComment: async ({ state, commit }, params) => {
      const result = await adapter.patch(`/contacts/${params.id}/contactDetails/${params.detailId}`, params.data, {auth: true, __temporary_oldScheme: true})
      await store.dispatch('backend/getCurrentContact', {id: params.id})
      return result
    },
    deleteContactDetail: async ({ state, commit }, params) => {
      const result = await adapter.delete(`/contacts/${params.contactId}/contactDetails/${params.contactDetailsId}`, {auth: true, __temporary_oldScheme: true})
      await store.dispatch('backend/getCurrentContact', {id: params.contactId})
      return result
    }
  }
}
