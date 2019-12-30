/* eslint-disable no-constant-condition */
import Vue from 'vue'
import translations from 't/index.js'

// this module is temporary& Maybe
export function createTranslations (store) {
  return new Vue({
    data: () => ({
      locale: 'ru',
      list: [{
        value: 'ru',
        text: 'Русский (RU)'
      }, {
        value: 'en',
        text: 'English (EN)'
      }]
    }),
    watch: {
      locale (locale) {
        store.state.language = locale
      },
      userLang () {
        const availableLanguages = ['en', 'ru']
        if (this.userLang && availableLanguages.indexOf(this.userLang) >= 0) {
          this.locale = this.userLang
        }
      }
    },
    computed: {
      userLang () {
        return store.state && store.state.backend && store.state.backend.user && store.state.backend.user.lang
      }
    },
    methods: {
      resolve (key, data = {}) {
        // this.text.match(/\:[\_\-a-z]

        if (!key.trim()) return ''

        let translation
        let branch = translations
        let keys = key.split('.')
        let success = true

        for (let _key of keys) {
          if (!branch[_key]) {
            success = false
            break
          }
          branch = branch[_key]
        }
        if (success) {
          translation = branch[this.locale]
        }
        if (!translation) {
          translation = '*** ' + key + ' ***'
          this.$log.e(new Error(`Can't find translate`), {extra: { key }})
        }
        for (let key in data) {
          let f = `{{${key}}}`
          // TODO: заменить на регулярки
          while (translation.indexOf(f) >= 0) translation = translation.replace(f, data[key])
        }
        return translation
      }
    },
    created () {
      this.locale = store.state.language || 'ru'
    }
  })
}
