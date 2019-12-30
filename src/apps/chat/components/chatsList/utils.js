export function transformChat (chat) {
  return {
    id: chat.guid,
    name: chat.name || chat.phone,
    icon: 'mdi-whatsapp',
    last_message: chat.lastMsgText,
    date: chat.lastMsgDateTime,
    you: chat.lastMsgStatus !== 99,
    status: chat.lastMsgStatus,
    unreaded: chat.unanswered
  }
}
