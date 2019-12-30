/* eslint-disable max-lines-per-function */
import Vue from 'vue'
import { TYPES } from '@/enums'

function sortByTime (aT, bT) {
  const a = new Date(aT.lastMsgDateTime).getTime()
  const b = new Date(bT.lastMsgDateTime).getTime()
  const aa = !!aT.unanswered
  const bb = !!bT.unanswered

  if (aa !== bb) {
    if (aa) return -1
    if (bb) return 1
  }
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

function upToDownTime (aT, bT) {
  const a = new Date(aT.dateTime).getTime()
  const b = new Date(bT.dateTime).getTime()
  const aa = aT.timestampMsg
  const bb = bT.timestampMsg

  if (a > b) return 1
  if (a < b) return -1
  if (aa > bb) return 1
  if (aa < bb) return -1
  return 0
}

export function createMutations () {
  return {
    [TYPES.SET_CURRENT_CONTACT]: (state, data) => {
      Vue.set(state, 'currentContact', data)
    },
    'OPEN_CONTACT': (state, data) => {
      let panels = state.panels
      panels.contact.opened = true
      Vue.set(state, 'panels', panels)
    },
    'CLOSE_CONTACT': (state, data) => {
      let panels = state.panels
      panels.contact.opened = false
      Vue.set(state, 'panels', panels)
    },
    [TYPES.SET_USERS]: (state, data) => {
      Vue.set(state, 'users', data)
    },
    [TYPES.SET_USER]: (state, data) => {
      Vue.set(state, 'user', data)
    },
    [TYPES.SET_ACCOUNT]: (state, data) => {
      console.log('set account', data)
      Vue.set(state, 'account', data)
    },
    [TYPES.SET_ACCOUNTS_LIST]: (state, data) => {
      Vue.set(state, 'accounts', data)
    },
    [TYPES.SET_PROMOCODES]: (state, data) => {
      Vue.set(state, 'promocodes', data)
    },
    [TYPES.SET_REFERRALS]: (state, data) => {
      Vue.set(state, 'referrals', data)
    },
    [TYPES.SET_CLIENTS]: (state, data) => {
      Vue.set(state, 'clients', data)
    },
    [TYPES.SET_REFERRALS_PAYMENTS]: (state, data) => {
      Vue.set(state, 'refPayments', data)
    },
    [TYPES.SET_AFFILIATE_PAYMENTS]: (state, data) => {
      Vue.set(state.billing, 'affiliate', data)
    },
    'SET_CHANNELS': (state, data) => {
      const object = {}
      data.forEach(channel => {
        object[channel.guid] = channel
      })
      Vue.set(state, 'channels', object)
    },
    'UPDATE_CHANNEL': (state, data) => {
      Vue.set(state.channels, data.guid, Object.assign({}, state.channels[data.guid] || {}, data))
    },
    [TYPES.SET_CONTACTS]: (state, data) => {
      if (data.length > 0) {
        /*
        HOTFIX
        let dataToSet = state.contacts.concat(data)
        dataToSet = dataToSet.sort(sortByTime)

        dataToSet = state.contacts.concat(dataToSet)
        */
        let dataToSet = data
        for (let contact of state.contacts) {
          if (dataToSet.findIndex(el => { return (el.guid === contact.guid) }) === -1) {
            dataToSet.push(contact)
          }
        }
        dataToSet = dataToSet.sort(sortByTime)

        Vue.set(state, 'contacts', dataToSet)
      }
    },
    'UPDATE_CONTACTS': (state, data) => {
      let startData = state.contacts
      let dataToSet = []
      startData.forEach(contact => {
        if (contact.guid !== data.guid) {
          dataToSet.push(contact)
        }
      })

      // TODO: временная затычка для Chat.vue
      data.timestamp = Date.now()

      dataToSet = dataToSet.concat([data])
      dataToSet = dataToSet.sort(sortByTime)
      Vue.set(state, 'contacts', dataToSet)
    },
    [TYPES.SET_MESSAGES]: (state, { data, contact }) => {
      const messages = {}
      const guids = data.map(message => { return message.guid })
      if (data) {
        if (state.messages[contact]) {
          Object.keys(state.messages[contact]).forEach(key => {
            if (guids.indexOf(key) === -1) {
              data.push(state.messages[contact][key])
            }
          })
        }
        data = data.sort(upToDownTime)
        data.forEach(message => {
          messages[message.guid] = message
        })

        Vue.set(state.messages, contact, messages)
      }
    },
    'SET_BALANCE': (state, balance) => {
      Vue.set(state.billing, 'balance', balance)
    },
    'SET_AFFILIATE_BALANCE': (state, balance) => {
      Vue.set(state.billing, 'affiliate_balance', balance)
    },
    'SET_PAYMENTS': (state, payments) => {
      Vue.set(state.billing, 'payments', payments)
    },
    'SET_PAYMENTS_OFFS': (state, payments) => {
      Vue.set(state.billing, 'offs', payments)
    },
    'SET_INTEGRATIONS': (state, integrations) => {
      Vue.set(state, 'integrations', integrations)
    },
    'SET_AMOCRM_USERS': (state, { users }) => {
      Vue.set(state, 'amocrm_users', users)
    }
  }
}
