import Vue from 'vue'

export function createMutations (store) {
  return {
    'SET_AUTH': (state, bool) => {
      Vue.set(state, 'isAuth', bool)
      if (bool === false) {
        // small kostil to null channels
        if (store.state.backend) {
          Vue.set(store.state.backend, 'channels', {})
        }
      }
    },
    'SET_JW_TOKENS': (state, { data, tokenInUrl }) => {
      for (const token in data) {
        if (!tokenInUrl) {
          // ls.set(token, data[token]) ???
        }

        Vue.set(state, token, data[token])
      }
    },
    'SET_DAT': (state, data) => {
      Vue.set(state, 'DAT', data)
    },
    'SET_QUERY_TOKEN_FLAG': (state, flag) => {
      Vue.set(state, 'tokenFromQuery', flag)
    },
    'SET_INTEGRATION_TRUE': (state) => {
      Vue.set(state, 'integration', true)
    },
    'SET_LOC': (state, data) => {
      Vue.set(state, 'LOC', data)
    }
  }
}
