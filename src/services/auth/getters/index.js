export function createGetters () {
  return {
    is_auth: (state) => {
      return state.isAuth
    },
    access_token: (state) => {
      return state.accessToken
    },
    dat: (state) => {
      return state.DAT
    },
    time_to_refresh: (state) => () => {
      if (state.DAT.iat) {
        return state.DAT.exp - Math.round(new Date().getTime() / 1000) <= 120 // 2 min
      } else {
        return null
      }
    },
    is_query_token: (state) => {
      return state.tokenFromQuery
    },
    integration: (state) => {
      return state.integration
    },
    integration_data: (state) => {
      return state.DAT.integration || false
    }
  }
}
