import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

export function createLogger (store, href) {
  let component

  if ((store.state.env === 'production') && (href.indexOf('__wz_debug=true') === -1)) {
    Raven
      .config('https://110cf64b52d34b5e95d69eca50d65f53@sentry.io/1282158')
      .addPlugin(RavenVue, Vue)
      .install()

    window.addEventListener('error', function (e) {
      if (e && ((e instanceof Error) || (e instanceof ErrorEvent))) {
        console.error(e)
        Raven.captureException(e, { extra: e })
      } else {
        Raven.captureException(new Error('Unhandled exeption'), { extra: e })
      }
      return false
    })

    component = new Vue({
      data: () => ({
        debugMode: false
      }),
      methods: {
        e (error, extra) { Raven.captureException(error, { extra: extra || {} }) },
        msg (error, extra) { Raven.captureMessage(error, { extra: extra || {} }) },
        setExtraContext (context) { Raven.setExtraContext(context) },
        setUserContext (context) { Raven.setUserContext(context) }
      }
    })
  } else {
    window.__wz_debug = true
    component = new Vue({
      data: () => ({
        debugMode: true
      }),
      methods: {
        e (error, extra) { console.error(error, { extra: extra || {} }) },
        msg (error, extra) { console.log(error, { extra: extra || {} }) },
        setExtraContext (context) { console.log('setExtraContext', context) },
        setUserContext (context) { console.log('setUserContext', context) }
      }
    })
  }

  window.__wz_set_debug_mode = (value) => {
    component.debugMode = value
  }

  return component
}
