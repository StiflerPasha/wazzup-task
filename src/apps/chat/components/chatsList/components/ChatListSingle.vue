<template lang="html">
  <li @click="onClick" :class="{'active': isActive }" class="chat">
    <a>
      <i class="icon mdi" :class="GET_ICON(icon)" style="color: #28a745"></i>
      <span>{{ shortName }}</span>
      <span v-if="last_message || date > 0" style="float: right; font-size: 0.8rem">{{ GET_TIME_FORMATED(date, true) }}</span>
    </a>
    <div class="message">
      <template v-if="last_message">
        <b v-if="you">{{ $t(`chat.chatlist_you`) }}</b> {{ shortMessage }}
        <span v-if="you" class="h-0" :style="{'color': computedStatus.color}">
          <icon :name="computedStatus.icon"></icon>
        </span>
        <span v-if="unreaded" class="message_unreaded">{{ unreaded }}</span>
      </template>
      <template v-else>
        <span v-if="unreaded" class="message_unreaded">{{ unreaded }}</span>
      </template>
    </div>
  </li>

</template>

<script>

  import { ROUTES, APPS, EVENTS, MESSAGES } from '@/enums'

  export default {
    name: 'chats-list-single',
    props: {
      id: {
        type: String,
        required: true
      },
      icon: {
        type: String
      },
      name: {
        type: String
      },
      msg: {
        type: String
      },
      unreaded: {
        type: Number
      },
      status: {
        type: Number
      },
      you: {
        type: Boolean
      },
      date: {
        type: Number
      },
      last_message: {
        type: String
      }
    },
    computed: {
      isActive () {
        return this.$route.params.id === this.id
      },
      shortMessage () {
        if (!this.last_message) {
          return ''
        }
        return this.last_message.length > 25 ? this.last_message.slice(0, 25) + '...' : this.last_message
      },
      shortName () {
        if (!this.name) {
          return ''
        }
        return this.name.length > 18 ? this.name.slice(0, 18) + '...' : this.name
      },
      computedStatus () {
        const { status } = this

        return {
          icon: MESSAGES.ICONS[status] ? MESSAGES.ICONS[status] : MESSAGES.ICONS[0],
          color: MESSAGES.COLORS[status] ? MESSAGES.COLORS[status] : MESSAGES.COLORS[0]
        }
      }
    },
    methods: {
      onClick () {
        const { id } = this
        this.$router.push({
          name: ROUTES.CHAT_VIEW,
          params: {
            id,
            app: APPS.CHAT
          }
        })

        this.$store.dispatch('backend/getCurrentContact', {
          id: this.id
        })
        if (this.$store.getters['device_width'] > 992) {
          this.$store.commit('backend/OPEN_CONTACT')
        }
        this.$eb.$emit(EVENTS.CLOSE_MOBILE_MENU)
      }
    }
  }
</script>
