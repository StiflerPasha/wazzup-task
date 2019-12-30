import Preloader from 'main_components/Preloader.vue'

const addZeros = function (number, chars = 2) {
  return ('0' + number).substr(-chars)
}

export default {
  install (Vue, store) {
    Vue.mixin({
      computed: {
        $DEVICE () {
          return store.getters.device
        },
        $DEVICE_WIDTH () {
          return store.getters.device_width
        },
        $APP () {
          return store.state.app
        },
        $USER () {
          return store.getters['auth/is_auth']
        },
        $APP_ENV () {
          return store.getters.env
        }
      },
      methods: {
        GET_ICON (icon) {
          const object = {}
          object[icon] = true
          return object
        },
        GET_TIME_FORMATED (timeString, crop = false) {
          const currDate = new Date()
          const date = new Date(timeString)
          // 02.03.2018, 13:11
          const Day = addZeros(date.getDate())
          const Month = addZeros(date.getMonth() + 1)
          const Year = addZeros(date.getFullYear() - 2000)
          // const Second = addZeros(date.getSeconds())
          const Minute = addZeros(date.getMinutes())
          const Hour = addZeros(date.getHours())
          if (+Day === currDate.getDate() - 1 && currDate.getMonth() + 1 === +Month && crop) {
            return this.$t(`__old__.yesterday`)
          } else if (+Day === currDate.getDate() && currDate.getMonth() + 1 === +Month) {
            return `${Hour}:${Minute}`
          } else {
            if (!crop) {
              return `${Day}.${Month}.${Year}, ${Hour}:${Minute}`
            } else {
              return `${Day}.${Month}.${Year}`
            }
          }
        }
      },
      components: {
        Preloader
      }
    })
  }
}
