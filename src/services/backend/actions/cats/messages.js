import { TYPES } from '@/enums'

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

export function messages (adapter, store) {
  return {
    init_message_content: ({commit, state}, { filename, contentType, base64Thumb }) => {
      return adapter.post('/messageContents', { filename, contentType, base64Thumb }, { auth: true, __temporary_oldScheme: true })
    },
    upload_original_file: ({commit, state}, { guid, formData }) => {
      return adapter.post(`/store/upload/${guid}`, formData, { upload: true, __temporary_oldScheme: true })
    },
    send_message: ({ state, commit }, { data, upload, timeout }) => {
      return adapter.post('/messages', data, { auth: true, __temporary_oldScheme: true, upload, timeout })
    },
    [TYPES.GET_MESSAGES]: async ({ state, commit }, params) => {
      const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET, contact } = params || {}
      const result = await adapter.get('/messages', {
        auth: true,
        __temporary_oldScheme: true,
        query: {
          contact,
          limit,
          offset,
          direction: 'desc'
        }
      })
      commit(TYPES.SET_MESSAGES, { data: result.data, contact })
      return result
    }
  }
}
