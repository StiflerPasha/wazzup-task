import sha256 from 'js-sha256'

function getCookie (name) {
  // TODO: может использовать готовый метод? как в другом месте?
  const matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)' // eslint-disable-line no-useless-escape
  ))
  return matches ? decodeURIComponent(matches[1]) : undefined
}

export function auth (adapter, store) {
  return {
    get_promocode: async ({ state, commit }) => {
      const promocode = await adapter.post('/promoCodes/random', {}, { __temporary_oldScheme: true })
      return promocode
    },
    register_new_user: async ({ state, commit }, {
      email,
      promo = ''
    }) => {
      // const encryptedPass = sha256(`${email}!${password}`)
      const unurgent = {}
      const ref = getCookie('__ref') // TODO: сделать единообразно
      const referrer = getCookie('__x_referrer') // TODO: сделать единообразно
      const ownReferrer = getCookie('__x_own_referrer') // TODO: сделать единообразно

      if (ref) {
        unurgent['ref'] = ref
      }
      if (promo) {
        unurgent['promo'] = promo
      }
      if (referrer) {
        unurgent['referrer'] = referrer
      }
      if (ownReferrer) {
        unurgent['ownReferrer'] = ownReferrer
      }
      const newuser = await adapter.post('/users/signup', {
        // hashPassword: encryptedPass,
        lang: store.state.language,
        email: email.toLowerCase(),
        ...unurgent
      }, { __temporary_oldScheme: true })
      return newuser
    },
    password_recover: async ({ state, commit }, { email }) => {
      const result = await adapter.post('/users/password/recovery', { email: email.toLowerCase() }, { auth: false })
      return result
    },
    password_change: async ({ state, commit }, { email, password }) => {
      const newPassword = await adapter.post('/users/password/change', {
        email: email.toLowerCase(),
        hashPassword: sha256(`${email.toLowerCase()}!${password}`)
      }, { auth: true, __temporary_oldScheme: true })
      store.commit(`auth/SET_JW_TOKENS`, { data: newPassword })
      store.commit(`auth/SET_AUTH`, true)
      return newPassword
    },
    password_change_register: async ({ state, commit }, { password, email }) => {
      const newPassword = await adapter.post(`/users/password/change`, {
        hashPassword: sha256(`${email.toLowerCase()}!${password}`)
      }, { auth: true, __temporary_oldScheme: true })
      store.commit(`auth/SET_JW_TOKENS`, { data: newPassword })
      store.commit(`auth/SET_AUTH`, true)
      return newPassword
    }
  }
}
