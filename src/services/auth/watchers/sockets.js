export function auth ({ store, moduleName }) {
  store.dispatch(`${moduleName}/socket_authenticate`)
}
