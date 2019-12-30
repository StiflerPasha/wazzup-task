import Vue from 'vue'

const timeout = ms => { return new Promise(resolve => { setTimeout(resolve, ms) }) }
const scripts = {}
const links = {
  'chart.js': 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.js'
}

export function createExternalScriptsHandler (store) { // eslint-disable-line
  return new Vue({
    data: () => ({
    }),
    methods: {
      async waitForScript (name, callback) {
        if (!scripts[name]) {
          console.log(`start script loading: ${name}, ${links[name]}`)
          scripts[name] = { state: 'pending', waitFor: Date.now() + 10000 }
          let script = document.createElement('script')
          script.src = links[name]
          document.body.appendChild(script)
          script.onload = () => {
            console.log(`script loaded: ${name}`)
            scripts[name].state = 'loaded'
          }
          script.onerror = e => {
            if (!scripts[name] || (scripts[name].state !== 'loaded')) {
              delete scripts[name]
              Vue.prototype.$log.e(new Error('Error loading chartJS script'), e)
            }
          }
        }
        if (scripts[name]) {
          while ((scripts[name].state !== 'loaded') && (Date.now() < scripts[name].waitFor)) {
            console.log(`wait script: ${name}`)
            await timeout(100)
          }
          if (scripts[name].state === 'loaded') {
            callback()
          } else {
            Vue.prototype.$log.e(new Error('Error loading chartJS script: timeout'))
          }
        }
      }
    }
  })
}
