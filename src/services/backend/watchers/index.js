import { createSockets } from './sockets'

export function createWatchers ({ store, moduleName, app }) {
  createSockets({ store, moduleName, app })
}
