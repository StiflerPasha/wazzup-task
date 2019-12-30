import Socket from 'socket.io-client'
let cs
let events = {}

const methods = function (store, Vue) {
  store.watch(state => state.socket_connection, (isConnected) => {
    if (isConnected) {
      for (const ev in events) {
        cs.on(ev, events[ev])
      }
    }
  })
  return {
    connect: (host, accountId) => {
      if (!host || !accountId) {
        // TODO: make this error strong (again, like America)
        console.error('Socket connection error')
      }
      try {
        Socket.disconnect()
      } catch (e) {
        console.log('Socket disconnect error:', e)
      }
      const socket = Socket.connect(`${host}/accounts/${accountId}`, {
        query: `ns=/accounts/${accountId}`,
        resource: 'socket.io'
      })
      cs = socket
      socket.on('connect', () => {
        console.log('Socket is connected')
        store.commit('SOCKET_CONNECTION', true)
      })
      socket.on('disconnect', () => {
        store.commit('SOCKET_CONNECTION', false)
      })
      socket.on('reconnect_attempt', (attempt) => {
        store.commit('SOCKET_CONNECTION', false)
        console.log('Socket connections attempt: ', attempt)
        // TODO: временно убираем разлогин при проблеме с вебсокетом, просто переконнектимся всегда, надо посмотреть правмльно ли это
        /*
        if (attempt === 5) {
          store.commit('auth/SET_AUTH', false)
        }
        */
        if (attempt === 100) {
          Vue.prototype.$log.e(new Error(`Socket connections with ${attempt} attempt`))
        }
      })
      return socket
    },
    on: (event, callback) => {
      events[event] = callback
    }
  }
}

export default {
  install (Vue, store) {
    Vue.prototype.$socket = methods(store, Vue)
  }
}
