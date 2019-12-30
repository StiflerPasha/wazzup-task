export function createSockets ({ store, moduleName, app }) {
  app.$socket.on('channelInit', (data) => {
    console.log('channelInit', data)

    // TODO: Костыль от блокировки телефонов !!!
    if ((data.state === 'qr') && data.qr) {
      data.qrIdleAt = Date.now() + 8000
    }

    app.$eb.$emit('backend/channelInit', data)
    if (store.state.backend.channels[data.guid]) {
      store.commit('backend/UPDATE_CHANNEL', data)
    }
  })

  app.$socket.on('channelUpdate', (data) => {
    console.log('channelUpdate', data)

    // TODO: Костыль от блокировки телефонов !!!
    if ((data.state === 'qr') && data.qr) {
      data.qrIdleAt = Date.now() + 8000
    }

    app.$eb.$emit('backend/channelUpdate', data)
    store.commit('backend/UPDATE_CHANNEL', data)
  })

  app.$socket.on('channelReInit', (data) => {
    app.$eb.$emit('backend/channelReInit', data)
    console.log('channelReInit', data)
  })

  app.$socket.on('channelDelete', (data) => {
    console.log('channelDelete', data)
  })

  app.$socket.on('channelAccept', (data) => {
    console.log('channelAccept', data)
  })

  app.$socket.on('contactUpdate', (data) => {
    // TODO: костыль, исправить в бекуенде
    if (typeof data.lastMsgDateTime === 'string') data.lastMsgDateTime = new Date(data.lastMsgDateTime).getTime()
    if (!store.state.auth.DAT.integration) {
      store.commit('backend/UPDATE_CONTACTS', data)
    } else {
      const contacts = store.getters['backend/contacts']
      if (contacts.findIndex((item) => item.guid === data.guid) >= 0) {
        store.commit('backend/UPDATE_CONTACTS', data)
      }
    }
  })
}
