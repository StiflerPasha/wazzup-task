/* eslint-disable max-lines-per-function */
import Vue from 'vue'
import axios from 'axios'
import config from './config'

const errorsGlossary = {
  oops: { ru: 'Ой, что-то пошло не так...', en: 'Oops, something went wrong...' },
  accessDenided: { ru: 'Нет доступа на выполнение этой операции', en: 'No access to perform this operation' },
  135: { ru: 'Промокод не может быть длиннее 50 символов', en: 'Promo code cannot be longer than 50 characters' },
  140: { ru: 'Пользователь заблокирован', en: 'The user is blocked' },
  280: { ru: 'Такой промокод уже существует, придумайте что-то оригинальнее', en: 'This promotional code already exists, think of something more original' },
  281: { ru: 'Некорректный срок действия', en: 'Incorrect expiration date' },
  282: { ru: 'Введите промокод', en: 'Enter promo code' },
  283: { ru: 'Промокод должен быть длиной от 1 до 50 символов', en: 'Promo code must be between 1 and 50 characters long.' },
  284: { ru: 'Промокод может содержать только латинские буквы, цифры и знак подчеркивания', en: 'Promo code can contain only latin letters, numbers and underscore' },
  285: { ru: 'Некорректный тип промокода', en: 'Invalid promo code type' },
  291: { ru: 'Некорректный e-mail', en: 'Invalid email' },
  292: { ru: 'Недопустимый язык', en: 'Invalid language' },
  293: { ru: 'Некорректный поддомен: допустимо только латиница, цифры и дефис', en: 'Invalid subdomain: only Latin, digits and hyphen are allowed' },
  294: { ru: 'Название аккаунта должно быть от 1 до 100 символов', en: 'Account name must be from 1 to 100 characters' },
  295: { ru: 'Некорректная валюта аккаунта', en: 'Invalid account currency' },
  296: { ru: 'Выберите часовой пояс', en: 'Select time zone' },
  297: { ru: 'Такой пользователь уже зарегистрирован', en: 'This user is already registered.' },
  298: { ru: 'У вас на балансе партнерского счета только {{balance}} {{currency}}', en: 'You only have {{balance}} {{currency}} on your affiliate account balance' },
  299: { ru: 'Ошибка пересчета валюты, обновите страницу и попробуйте еще раз', en: 'Error currency conversion, refresh the page and try again' },
  300: { ru: 'У аккаунта получателя еще не выбрана валюта', en: 'The recipient account has not yet chosen currency' }
}

export function createAdapter (params, store, app = {}) {
  async function ___new_requestFunc (method, route, optionsArgs = {}, body) { // eslint-disable-line
    if (optionsArgs.auth !== false) {
      // TODO: установить метку "токен в процессе обновления" с таймаутом, чтобы параллельно в обработчика не обновляли токен
      // TODO: рефреш-токен (да и акцесс, наверное, тоже) всегла проверять из куков на случай работы в двух вкладках
      let tokensIsOkay = await store.dispatch('auth/local_check_and_reload_token')
      if (!tokensIsOkay) {
        let error = {
          error: 'local_check_and_reload_token fail'
        }
        throw error
      }
    }

    const options = {
      headers: {}
    }

    if (optionsArgs.auth !== false) options.headers.authorization = store.getters['auth/access_token']
    if (optionsArgs.contentType) options.headers['Content-Type'] = optionsArgs.contentType
    if (optionsArgs.query) options.params = optionsArgs.query
    if (optionsArgs.timeout) options.timeout = optionsArgs.timeout
    if (optionsArgs.blob === true) options.responseType = 'blob'
    if (optionsArgs.upload === true) options.headers['Content-Type'] = 'multipart/form-data'

    let url = route.match(/https:\/\/|http:\/\//) ? route : `/${this.version}${route}`

    if (process.env.NODE_ENV === 'local') {
      // Вместо типового прокси
      let subdomain = window.location.hostname.split('.')[0]
      url = `https://${subdomain}.dev-wazzup24.com/api/v1${route}`
      console.log(url)
      /*
      let account = store.getters['backend/account']
      if (account && account.subdomain) {
        url = `https://${account.subdomain}.dev-wazzup24.com/api/v1${route}`
      }
      */
    }

    let requestPromise

    switch (method) {
      case 'HEAD': { requestPromise = this.a.head(url, options); break }
      case 'GET': { requestPromise = this.a.get(url, options); break }
      case 'POST': { requestPromise = this.a.post(url, body, options); break }
      case 'PATCH': { requestPromise = this.a.patch(url, body, options); break }
      case 'PUT': { requestPromise = this.a.put(url, body, options); break }
      case 'DELETE': { requestPromise = this.a.delete(url, options); break }
    }

    if (app.$debug) console.log('adapter:', method, url, body, options)

    return new Promise((resolve, reject) => {
      requestPromise.then(result => {
        resolve(optionsArgs.full ? result : result.data)
      }).catch(async error => {
        if (error.response && (error.response.status === 401)) {
          store.commit('auth/SET_AUTH', false)
        }

        const errors = []

        if (error.response && error.response.data && Array.isArray(error.response.data.errors) && error.response.data.errors.length) {
          error.response.data.errors.forEach(error => {
            let description = error.code && errorsGlossary[error.code] && errorsGlossary[error.code][store.state.language]
            if (description) {
              if (optionsArgs.errorArguments) {
                for (let key in optionsArgs.errorArguments) {
                  // TODO: заменить на регулярки
                  description = description.replace(`{{${key}}}`, optionsArgs.errorArguments[key])
                }
              }
              errors.push(description)
            } else if (error.error) {
              errors.push(error.error)
              app.$log.e(new Error('Missing error description'), { extra: error })
            } else {
              errors.push(errorsGlossary.oops[store.state.language])
            }
          })
        } else {
          if (error.response && error.response.status === 403) {
            errors.push(errorsGlossary.accessDenided[store.state.language])
          } else {
            errors.push(errorsGlossary.oops[store.state.language])
          }
        }
        if (optionsArgs.pushToAlerts) errors.forEach(e => { app.$a.push({ type: 'danger', text: e }) })
        if (optionsArgs.arrayForErrors) errors.forEach(e => { optionsArgs.arrayForErrors.push(e) })

        const errorObject = {
          status: error.response ? error.response.status : 0,
          data: error.response ? error.response.data : 'Network error',
          errors
        }

        if (window.__wz_debug) console.log('errorObject', errorObject)

        reject(errorObject)
      })
    })
  }

  // function timeout (ms) { return new Promise(resolve => { setTimeout(resolve, ms) }) }
  async function requestFunc (method, route, optionsArgs = {}, data) {
    if (!optionsArgs.__temporary_oldScheme) {
      return ___new_requestFunc.call(this, method, route, optionsArgs, data)
    }

    if (optionsArgs.auth === true) {
      // TODO: установить метку "токен в процессе обновления" с таймаутом, чтобы параллельно в обработчика не обновляли токен
      // TODO: рефреш-токен (да и акцесс, наверное, тоже) всегла проверять из куков на случай работы в двух вкладках
      let tokensIsOkay = await store.dispatch('auth/local_check_and_reload_token')
      if (!tokensIsOkay) {
        let error = {
          error: 'local_check_and_reload_token fail'
        }
        throw error
      }
    }

    const options = {
      headers: {}
    }

    if (optionsArgs.auth === true) options.headers.authorization = store.getters['auth/access_token']
    if (optionsArgs.upload === true) options.headers['Content-Type'] = 'multipart/form-data'
    if (optionsArgs.query) options.params = optionsArgs.query
    if (optionsArgs.timeout) options.timeout = optionsArgs.timeout
    if (optionsArgs.download === true) options.responseType = 'blob'
    if (optionsArgs.form === true) options.headers['Content-Type'] = 'application/x-www-form-urlencoded'

    let url = route.match(/https:\/\/|http:\/\//) ? route : `/${this.version}${route}`

    if (process.env.NODE_ENV === 'local') {
      // Вместо типового прокси
      let subdomain = window.location.hostname.split('.')[0]
      url = `https://${subdomain}.dev-wazzup24.com${this.baseUrl()}/${this.version}${route}`
      console.log(url)
      /*
      let account = store.getters['backend/account']
      if (account && account.subdomain) {
        url = `https://${account.subdomain}.dev-wazzup24.com/api/v1${route}`
      }
      */
    }

    let requestPromise

    switch (method) {
      case 'GET': { requestPromise = this.a.get(url, options); break }
      case 'POST': { requestPromise = this.a.post(url, data, options); break }
      case 'PATCH': { requestPromise = this.a.patch(url, data, options); break }
      case 'PUT': { requestPromise = this.a.put(url, data, options); break }
      case 'DELETE': { requestPromise = this.a.delete(url, options); break }
    }

    if (!requestPromise) {
      let error = {
        error: `Unknown method ${method}`
      }
      throw error
    }

    if (window.__wz_debug) console.log('adapter:', method, url, data, options)

    return new Promise((resolve, reject) => {
      requestPromise.then(result => {
        resolve(optionsArgs.full ? result : result.data)
      }).catch(async error => {
        if (error.response && (error.response.status === 401)) {
          store.commit('auth/SET_AUTH', false)
        }
        // TODO: подумать над тем, чтобы перевызывать метод с таймаутом при ошибке сети (а может и при 5ХХ)
        let errorObject = {
          error: {
            status: error.response ? error.response.status : 0,
            data: error.response ? error.response.data.errors : 'Network error'
          }
        }
        // TODO: Temporary - посомтреть что за ошибки бывают
        if (!error.response) {
          reject(error)
          return
        }
        reject(errorObject)
        /*
        let errorObject = {
          error: {
            status: error.response ? error.response.status : 0,
            data: error.response ? error.response.data.errors : 'Network error'
          }
        }
        if (optionsArgs.auth && error.response && (error.response.status === 401)) {
          console.log(401, store.getters['auth/access_token'], this.auth)
          store.commit('auth/SET_AUTH', false)
          if (method === 'GET') {
            console.log('пробуем повторно')
            let waitFor = Date.now() + 1500
            while (!this.auth && (Date.now() < waitFor)) {
              await timeout(100)
            }
            console.log(store.getters['auth/access_token'], this.auth)
            if (!this.auth) {
              reject(errorObject)
            } else {
              options.headers.authorization = store.getters['auth/access_token']
              this.a.get(url, options).then(result => {
                resolve(optionsArgs.full ? result : result.data)
              }).catch(async error => {
                let errorObject = {
                  error: {
                    status: error.response ? error.response.status : 0,
                    data: error.response ? error.response.data.errors : 'Network error'
                  }
                }
                reject(errorObject)
              })
            }
            return
          }
        }
        reject(errorObject)
        */
      })
    })
  }

  return new Vue({
    data: () => ({
      ...params,
      a: null,
      prod: false,
      port: store.state.port || 80
    }),
    computed: {
      defaulSchema () {
        return this.isLocal ? 'http://' : 'https://'
      },
      isApp () {
        const pattern = /^app\.(dev-|)wazzup24.(com|loc)$/gm
        const host = window.location.hostname
        return pattern.test(host)
      },
      isProduction () {
        return this.$APP_ENV === 'production'
      },
      isLocal () {
        return this.$APP_ENV === 'local'
      },
      isDevelopment () {
        return this.$APP_ENV === 'development'
      },
      baseHost () {
        if (this.isProduction || this.isDevelopment) {
          return `${this.isDevelopment ? 'dev-' : ''}wazzup24.com`
        }

        return `dev-wazzup24.loc`
      },
      auth () {
        return store.getters['auth/is_auth'] && store.getters['auth/access_token']
      }
    },
    mounted () {
      if (window.__wz_debug) console.log('this.$APP_ENV', this.$APP_ENV)
    },
    methods: {
      baseUrl () {
        return this.serviceBase ? `/${this.serviceBase}/api` : '/api'
      },
      get (route, optionsArgs) {
        return requestFunc.call(this, 'GET', route, optionsArgs)
      },
      post (route, data, optionsArgs) {
        return requestFunc.call(this, 'POST', route, optionsArgs, data)
      },
      patch (route, data, optionsArgs) {
        return requestFunc.call(this, 'PATCH', route, optionsArgs, data)
      },
      put (route, data, optionsArgs) {
        return requestFunc.call(this, 'PUT', route, optionsArgs, data)
      },
      delete (route, optionsArgs) {
        return requestFunc.call(this, 'DELETE', route, optionsArgs)
      }
    },
    created () {
      this.a = axios.create({
        timeout: config.timeout,
        baseURL: this.baseUrl()
      })
    }
  })
}
