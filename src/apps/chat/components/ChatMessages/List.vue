<template>
  <div class="chat-spacer">
    <template v-if="messages">
      <VuePerfectScrollbar
        id="chatScroll"
        class="chat-scroll"
        :class="{'nativeScroll': $DEVICE <= 3}"
        :is="$DEVICE <= 3 ? 'div' : 'VuePerfectScrollbar'"
        style="overflow: auto;"
        infinite-wrapper
        v-if="Object.keys(messages).length > 0"
      >
        <div class="chat-content" >
          <div class="chat-pre-content" :style="{'height': should_add_height ? '100%': 'inherit'}">
            <vue-infinite-loading
              :distance="300"
              @infinite="infiniteHandler"
              direction="top"
            >
              <span slot="no-more"></span>
            </vue-infinite-loading>
            <ul class="chat-elements">
              <chat-message-single
                v-for="message in messages"
                v-bind="message"
                :key="message.guid"
              />
            </ul>
          </div>
        </div>
      </VuePerfectScrollbar>
      <div v-else class="no_messages">
        <div>
          <icon class="big-icon" name="add_box"></icon>
          {{ $t(`chat.no_messages_with_contact`) }}
        </div>
      </div>
    </template>
    <preloader v-else class="place-flex"></preloader>

  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { TYPES } from '@/enums'
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'
  import VueInfiniteLoading from 'vue-infinite-loading'
  import ChatMessageSingle from './components/ChatMessageSingle'

  export default {
    data: () => ({
      should_add_height: false
    }),
    components: {
      VuePerfectScrollbar,
      ChatMessageSingle,
      VueInfiniteLoading
    },
    computed: {
      messages () {
        const { id } = this.$route.params
        return this.$store.getters['backend/messages'](id)
      }
    },
    methods: {
      initScroll () {
        this.$nextTick(() => {
          this.refreshHeight()
        })
        this.startSrcoll()
      },
      startSrcoll (position = null) {
        const chatScroll = document.getElementById('chatScroll')
        if (chatScroll) {
          if (!position) {
            chatScroll.scrollTop = chatScroll.scrollHeight
          } else {
            chatScroll.scrollTop = position
          }
        }
      },
      ...mapActions('backend', [TYPES.GET_MESSAGES]),
      async infiniteHandler ($state) {
        try {
          const result = await this[TYPES.GET_MESSAGES]({
            contact: this.$route.params.id,
            offset: Object.keys(this.messages).length })
          if (result.data.length) {
            $state.loaded()
            this.startSrcoll(600)
            if (Object.keys(this.messages).length === result.length) {
              $state.complete()
            }
          } else {
            $state.complete()
          }
        } catch (e) {
          console.warn(e)
          $state.complete()
        }
      },
      refreshHeight () {
        const chatScroll = document.getElementById('chatScroll')

        if (chatScroll) {
          this.$set(this, 'should_add_height', chatScroll.scrollHeight <= chatScroll.clientHeight)
        } else {
          this.$set(this, 'should_add_height', false)
        }
      }
    },
    watch: {
      'messages' () {
        this.$set(this, 'should_add_height', false)
        this.$nextTick(() => {
          this.startSrcoll()
        })
      },
      '$mq.resize' () {
        this.initScroll()
      }
    },
    mounted () {
      this.initScroll()
    }
  }
</script>

<style lang="scss" scoped>
  .modal-content {
    max-width: inherit;
  }
</style>

<style lang="scss">
  .nativeScroll {
    overflow-y: scroll !important
  }
  .video-helper {
    position: relative;
    display: flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    .icon {
      font-size: 4rem;
      position: absolute;
      display: flex;
      align-items: center;
    }
  }
  .no_messages {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    div:not(.color) {
      color: #646464;
      user-select: none;
      text-align: center;
      font-size: 1.3rem;
      .material-icon {
        display: block;
        font-size: 6rem !important;
        margin-bottom: 20px;
      }
    }
  }
  .chat-wrapper {
    display: table;
    table-layout: fixed;
    width: 100%;
    height: 100%;
  }
  .chat-spacer {
    height: 100%;
    display: table-row;
  }
  .chat-scroll {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .chat-content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding-top: 8px;
    .chat-pre-content {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
  }
  .chat-elements {
    margin: 0;
    padding: 0;
  }
  .chat-element {
    margin: 10px 25px;
    list-style-type: none;
    position: relative;
    display: flex;
    align-content: flex-end;
    .chat-element-content {
      min-height: 41px;
      background-color: #fff;
      padding: 10px;
      box-shadow: -1px 0px 1px #dedede;
      border-radius: 0.25rem;
      max-width: 85%;
      &.chat-element-content-you {
        margin-left: auto;
        background-color: #d8f7ca;
        color: #000;
        box-shadow: 1px 0px 1px #a7efb7;
      }
      &.chat-element-content-system {
        margin-left: auto;
        margin-right: auto;
        background-color: #ffbcbc;
      }
      .chat-element-content__time {
        font-size: 0.8rem;
        text-align: right;
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        .h-0{
          height: 0
        }
        .material-icon {
          font-size: 14px !important;
          margin-left: 5px;
        }
      }
      .chat-element-content__who {
        font-size: 0.9rem;
        margin-bottom: 15px;
      }
      .chat-element-content__message {
        font-size: 1.2rem;
        pre {
          color: inherit;
          white-space: pre-line;
          font-size: inherit;
          display: inherit;
          font-family: inherit;
          word-break: break-word;
        }
        img {
          cursor: pointer;
          max-width: 200px;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .chat-element {
      margin: 10px;
    }
  }
</style>
