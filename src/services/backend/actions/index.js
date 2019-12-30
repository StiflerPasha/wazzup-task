import {
  auth,
  channels,
  account,
  promocodes,
  messages,
  contacts,
  contact,
  billing,
  integrations,
  referrals,
  users,
  clients,
  bookmarks
} from './cats'

export function createActions (adapter, store, app) {
  return {
    request_download: ({ state, commit }, url) => {
      return adapter.get(url, { download: true, __temporary_oldScheme: true })
    },
    ...auth(adapter, store, app),
    ...channels(adapter, store, app),
    ...account(adapter, store, app),
    ...promocodes(adapter, store, app),
    ...messages(adapter, store, app),
    ...contacts(adapter, store, app),
    ...contact(adapter, store, app),
    ...clients(adapter, store, app),
    ...billing(adapter, store, app),
    ...integrations(adapter, store, app),
    ...users(adapter, store, app),
    ...referrals(adapter, store, app),
    ...bookmarks(adapter, store, app)
  }
}
