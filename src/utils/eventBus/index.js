const iframeWatcher = function () {
  const vm = this
  this.iframeWatcher = function (event) {
    if (event.data.provider !== 'wazzup' || !event.data.message) {
      return false
    }
    const data = event.data
    if (data.message === 'users') {
      vm.$store.commit('backend/SET_AMOCRM_USERS', { users: data.data })
    }
  }
}

export default {
  data: () => ({
    iframeWatcher: null
  }),
  computed: {
    integration () {
      return this.$store.getters['auth/integration']
    }
  },
  watch: {
    'integration' (n) {
      if (n) {
        console.log('integration detected')
        iframeWatcher.call(this)
        window.addEventListener('message', this.iframeWatcher, false)
        this.send_to_parent({ message: 'get_users' })
      } else {
        window.removeEventListener('message', this.iframeWatcher)
      }
    }
  },
  methods: {
    send_to_parent (data, contactDetail) {
      if (window.__wz_debug) console.log('send_to_parent', data, this.integration)
      if (this.integration) {
        data.provider = 'wazzup'
        window.parent.postMessage(data, '*')
      }
    }
  }
}
