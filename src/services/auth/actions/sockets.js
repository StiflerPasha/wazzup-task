export function createSockets () {
  return {
    socket_authenticate: ({state, commit}) => {
      console.log('socket auth')
    }
  }
}
