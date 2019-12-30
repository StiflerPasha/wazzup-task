<template>
    <div @dragenter="fileLoadingPage = true" ref="chat" class="chat-window" :class="{'color': have_chat}">
        <div key="1" class="chat-wrapper" v-if="have_chat">
          <div class="chat-topname" v-if="$DEVICE === 3">
            <span v-if="page_name">
              <i
                v-if="page_name.icon"
                class="icon mdi"
                :class="get_icon(page_name.icon)"
                style="margin-right: 10px"
                :style="{'color': page_name.color}"
              ></i>
              {{ get_page_name(page_name) }}
            </span>
          </div>
          <chat-messages></chat-messages>
          <chat-input
            :current_channel="current_channel"
            :channels="channels"
            :there_are_enabled_channels="there_are_enabled_channels"
            :deals="deals"
            :contact="contact"
            v-model="chatText"
            @send="sendMessage"
            @changeChannel="changeChannel"
            @files="showFileLoader"
            @gotoDeal="gotoDeal"
            @createDeal="createDeal"
          />
          <transition name="slide-up">
            <chat-attachment
              v-if="fileLoadingPage"
              :files="files"
              :uploading="isUploading"
              @deleteFile="deleteFile"
              @files="addFiles"
              @send="loadFilesAndSendMesssage"
              @exit="closeAttachment()"
             />
          </transition>
        </div>
        <div key="2" v-else>
          <i class="big-icon mdi mdi-message-reply-text"></i>
          {{ $t(`chat.choose_chat`) }}
        </div>
    </div>
</template>

<script>
  import ChatMessages from 'chat_components/ChatMessages/List.vue'
  import ChatInput from 'chat_components/ChatInput/index.vue'
  import ChatAttachment from 'chat_components/chatAttachment/index.vue'

  let resizeEventBinded

  export default {
    data: () => ({
      chatText: '',
      wasChat: false,
      fileLoadingPage: false,
      count: 30,
      current_channel: {},
      files: [],
      isUploading: false,
      contactPending: false,
      contactPendingMessages: false,
      lastSetChatId: null,
      types: {
        'image': 2,
        'audio': 3,
        'video': 4
      },
      deals: null
    }),
    components: {
      ChatMessages,
      ChatInput,
      ChatAttachment
    },
    computed: {
      integration () {
        return this.$store.getters['auth/integration']
      },
      have_chat () {
        return this.$route.params.id && this.contact && true
      },
      contact () {
        return this.$store.getters['backend/contact'](this.$route.params.id)
      },
      chat_timestamp () {
        const contact = this.$store.getters['backend/contact'](this.$route.params.id)
        return `${this.$route.params.id}!${contact ? contact.timestamp : null}`
      },
      page_name () {
        if (window.__wz_debug) console.log('computed page_name', this.$store.state.chat.page_name)
        return Object.keys(this.$store.state.chat.page_name).length ? this.$store.state.chat.page_name : false
      },
      channels () {
        return this.$store.getters['backend/active_channels']
      },
      there_are_enabled_channels () {
        const channels = this.$store.getters['backend/channels']
        for (const channelId in channels) {
          if (channels[channelId].state !== 'blocked') {
            return true
          }
        }
        return false
      },
      menu_state () {
        return this.$store.getters['chat/menu_state']
      }
    },
    watch: {
      'fileLoadingPage' (n) {
        if (n) {
          setTimeout(() => {
            this.resizeEvent()
          }, 200)
        } else {
          this.resizeEvent()
        }
      },
      '$route' () {
        if (window.__wz_debug) console.log('$route', this.$route, this.contact)
        if (this.$route.params.id) {
          this.resizeEvent()
          this.set_chat()
        }
        this.chatText = ''
        this.closeAttachment()
      },
      'chat_timestamp' () {
        if (this.$route.params.id && (this.lastSetChatId !== this.$route.params.id)) {
          this.resizeEvent()
          this.set_chat()
        } else {
          this.updateMessages()
        }
      },
      'menu_state' (n) {
        if (window.__wz_debug) console.log('watch menu_state', n, this)
        if (n) {
          this.$store.commit('chat/SET_PAGE_NAME', {
            name: '',
            channel: '',
            answer: null,
            back: false,
            icon: '',
            color: ''
          })
        } else {
          this.resizeEvent()
          if (!this.contact) {
            this.set_chat()
          } else if (this.$DEVICE <= 2) {
            this.$store.commit('chat/SET_PAGE_NAME', {
              name: this.contact.name || this.contact.phone,
              channel: this.current_channel ? this.current_channel.name : false,
              answer: !!this.contact.unanswered,
              back: true,
              icon: 'mdi-whatsapp',
              color: 'rgb(40, 167, 69)'
            })
          }
        }
      }
    },
    methods: {
      resizeEvent () {
        try {
          const add = this.have_chat ? this.fileLoadingPage ? (this.$DEVICE <= 2 ? -3 : 52) : 0 : 50
          const idk = window.innerHeight - (this.$DEVICE <= 2 ? 106 : this.$DEVICE === 3 ? 116 : 61)
          this.$refs.chat.style.height = idk - add + 'px'
        } catch (error) {
          // TODO: временно, ловим ошибку, убрать
          this.$log.e(error, {extra: { errNumber: 4 }})
        }
      },
      get_icon (icon) {
        const object = {}
        object[icon] = true
        return object
      },
      gotoDeal (deal, event) {
        if (window.__wz_debug) console.log('gotoDeal', deal, event)
        const data = {data: {}}
        if (deal) {
          if (deal.id === 0) {
            this.createDeal(event)
            return
          } else {
            data.message = 'goto_deal'
            data.data.id = deal.id
          }
        } else if (this.deals.length > 0) {
          data.message = 'goto_deal'
          data.data.id = this.deals[0].id
        }
        data.data.routeId = this.$route.params.id
        data.data.phone = this.contact.phone
        data.data.inANewWindow = event && (event.ctrlKey || event.metaKey) && true
        this.$eb.send_to_parent(data, this.contact.contactDetailsId)
      },
      createDeal (event) {
        if (window.__wz_debug) console.log('createDeal', event)
        const data = {data: {}}
        data.message = 'create_deal'
        data.data.contactDetails = this.contact.contactDetailsId
        data.data.routeId = this.$route.params.id
        data.data.phone = this.contact.phone
        data.data.inANewWindow = event && (event.ctrlKey || event.metaKey) && true
        this.$eb.send_to_parent(data, this.contact.contactDetailsId)
      },
      deleteFile (i) {
        const rest = []
        this.files.forEach(file => {
          if (file.i !== i) {
            rest.push(file)
          }
        })
        this.files = rest
      },
      closeAttachment () {
        this.fileLoadingPage = false
        this.files = []
      },
      showFileLoader (files) {
        if (!this.current_channel || !this.current_channel.guid) {
          this.$a.push({ type: 'danger', text: this.$t(`chat.errors.need_choose_channel`) })
          return
        }
        this.files = files
        this.fileLoadingPage = true
      },
      addFiles (files) {
        if (!this.current_channel || !this.current_channel.guid) {
          this.$a.push({ type: 'danger', text: this.$t(`chat.errors.need_choose_channel`) })
          return
        }
        files.forEach(file => {
          this.files.push(file)
        })
      },
      loadFilesAndSendMesssage () {
        // TODO: move to attachment component

        if (window.__wz_debug) console.log('files 1', this.files)

        const array = []
        this.isUploading = true
        this.files.forEach((file, i) => {
          array.push(new Promise(async (resolve, reject) => {
            const formData = new FormData()
            formData.append('data', file.file)
            if (file.thumb) {
              formData.append('thumb', file.thumb)
            }
            formData.append('contact', this.contact.guid)
            formData.append('channel', this.current_channel.guid)
            formData.append('text', '')
            formData.append('type', this.types[file.type] || 5)

            let uploadResult = await this.$store.dispatch('backend/send_message', {
              data: formData,
              upload: true,
              timeout: 120000
            }).catch(e => {
              if (window.__wz_debug) console.log('uploadResult', uploadResult, e)
              let errText = 'ERROR'
              this.$a.push({type: 'danger', text: errText}) // TODO: временно, переделать
            })
            if (uploadResult) {
              if (window.__wz_debug) console.log('uploadResult', uploadResult)
              this.deleteFile(file.i)
            }
            resolve(true)
          }))
        })
        if (window.__wz_debug) console.log('this 0', this)
        Promise.all(array).then(() => {
          this.isUploading = false
          if (window.__wz_debug) console.log('this', this)
          if (!this.files.length) {
            this.closeAttachment()
          }
        }).catch(error => {
          this.isUploading = false
          this.$log.e(error, {extra: 'upload files error'})
        })
      },
      set_chat () {
        if (window.__wz_debug) console.log('set_chat', this, this.$route, this.have_chat, this.contact)
        if (this.have_chat && !this.contactPending) {
          this.deals = null
          this.contactPending = true
          this.$store.commit('chat/CLOSE_MENU')
          this.$store.dispatch('backend/get_messages', { contact: this.$route.params.id, count: this.count })
            .then(res => {
              if (this.$store.getters['auth/integration']) {
                const integration = this.$store.getters['auth/integration_data']
                if (integration.crm === 'amocrm_v2') {
                  this.$store.dispatch('backend/amocrm_get_deals', { contactDetailsId: this.contact.contactDetailsId }).then(res => {
                    if (res && res.result && res.data && res.data.deals) {
                      this.deals = res.data.deals
                      const users = this.$store.getters['backend/amocrm_users'] || {}
                      let amocrmPageName = (this.deals.length && this.deals[0].contactName) || this.contact.name
                      if (this.deals.length && this.deals[0].id && !this.deals[0].closed) {
                        // TODO: i18n
                        amocrmPageName += `, сделка: ${this.deals[0].name || this.deals[0].id}${this.deals[0].responsibleUserId ? `, ответственный: ${users[this.deals[0].responsibleUserId] || this.deals[0].responsibleUserId}` : ''}`
                        let counter = -1
                        this.deals.forEach(deal => { if (deal.id && !deal.closed) counter++ })
                        if (counter > 0) amocrmPageName += ` + еще акктивных ${counter}`
                      }
                      this.$store.commit('chat/SET_PAGE_NAME', {
                        name: this.contact.name || this.contact.phone,
                        amocrmPageName, // TODO: костыль, сделать нормально
                        channel: this.current_channel ? this.current_channel.name : false,
                        answer: !!this.contact.unanswered,
                        back: true,
                        icon: 'mdi-whatsapp',
                        color: 'rgb(40, 167, 69)'
                      })
                    }
                  })
                }
              }
              this.$store.commit('chat/SET_PAGE_NAME', {
                name: this.contact.name || this.contact.phone,
                channel: this.current_channel ? this.current_channel.name : false,
                answer: !!this.contact.unanswered,
                back: true,
                icon: 'mdi-whatsapp',
                color: 'rgb(40, 167, 69)'
              })

              if (Object.keys(this.channels).length) {
                const lastMessage = this.$store.getters['backend/last_message'](this.$route.params.id)

                if (lastMessage && lastMessage.channel && this.channels[lastMessage.channel]) {
                  this.current_channel = this.channels[lastMessage.channel]
                } else {
                  const isIntegration = this.$store.getters['auth/integration']

                  let defaultChannel
                  if (isIntegration) {
                    const integration = this.$store.getters['auth/integration_data']
                    if (integration && integration.defaultChannel) {
                      defaultChannel = integration.defaultChannel.toLowerCase()
                    }
                  }

                  if (defaultChannel && this.channels[defaultChannel]) {
                    this.current_channel = this.channels[defaultChannel]
                  } else {
                    this.current_channel = this.channels[Object.keys(this.channels)[0]]
                  }
                }
              }
              this.lastSetChatId = this.$route.params.id
              this.contactPending = false
            })
        } else {
          this.$store.commit('chat/SET_PAGE_NAME', {
            name: '',
            channel: '',
            answer: null,
            back: false,
            icon: '',
            color: ''
          })
        }
      },
      updateMessages () {
        if (window.__wz_debug) console.log('updateMessages', this, this.$route, this.have_chat, this.contact)
        if (this.have_chat && !this.contactPendingMessages && !this.contactPending) {
          this.contactPendingMessages = true
          this.$store.dispatch('backend/get_messages', { contact: this.$route.params.id, count: this.count })
            .then(res => {
              this.contactPendingMessages = false
            })
        }
      },
      sendMessage () {
        this.$store.dispatch('backend/send_message', {
          data: {
            contact: this.contact.guid,
            channel: this.current_channel.guid,
            text: this.chatText,
            type: 1,
            count: this.count
          }
        })
          .then(res => {
            this.chatText = ''
          })
          .catch(e => {
            let string = ''
            for (const key in e.error.data) {
              e.error.data[key].forEach(msg => {
                string += `${msg}. `
              })
            }
            this.$a.push({
              type: 'danger',
              text: string
            })
          })
      },
      changeChannel (channel) {
        this.current_channel = channel
      },
      get_page_name (pageName) {
        // TODO: костыль, сделать нормально
        if (pageName.amocrmPageName) {
          return pageName.amocrmPageName
        } else {
          // return `${pageName.channel ? pageName.channel + ':' : ''} ${pageName.name}`
          return pageName.name
        }
      }
    },
    mounted () {
      if ((!this.current_channel || !this.current_channel.guid) && Object.keys(this.channels).length) {
        this.current_channel = this.channels[Object.keys(this.channels)[0]]
      }
      this.resizeEvent()
      resizeEventBinded = this.resizeEvent.bind(this)
      window.addEventListener('resize', resizeEventBinded)
      this.set_chat()
    },
    beforeMount () {
      if (this.$DEVICE < 3) {
        this.$store.commit('chat/OPEN_MENU')
      }
    },
    beforeDestroy () {
      window.removeEventListener('resize', resizeEventBinded)
    }
  }
</script>

<style lang="scss">
  .chat-window {
    &.color {
      margin: -25px;
    }
    &:not(.color) {
      display: flex;
      justify-content: center;
      align-items: center;
      div:not(.color) {
        color: #646464;
        user-select: none;
        text-align: center;
        font-size: 1.3rem;
        .big-icon {
          display: block;
          font-size: 6rem;
        }
      }
    }
  }
  .chat-topname {
    background-color: #fff;
    padding: 14px 20px;
    font-size: 1.3rem;
    border-bottom: 1px solid #e6e5e5;
  }
  .chat-textfield {
    .icon {
      font-size: 2rem;
      padding: 0 10px;
      display: inherit;
      // border: 1px solid #ced4da;
      border-right: none;
      border-radius: 0.25rem;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      cursor: pointer
    }
    input {
      padding: 10px;
    }
    background-color: #eee;
    border-top: 1px solid #e6e5e5;
    padding: 25px;
  }

  .chat-textfield-mobile{
    position: absolute;
    bottom: -55px;
    width: 100%;
    #noanswer {
      width: 100%
    }
    .input-group-append {
      min-width: 100%;
    }
    .show-mobile {
      button {
        height: 37px;
        border-radius: 0;
        .icon {
          padding: 0 3px;
          font-size: 1.2rem;
          border: none;
          height: 0;
        }
        &.bigg {
          border-radius: 0 0.25rem .25rem 0;
          .icon {
            padding: 0;
            font-size: 1.7rem;
          }
        }
      }
      #ddown1 {
        button {
          border-radius: 0.25rem 0 0 0.25rem;
        }
      }
    }
    .icon {
      display: flex;
      align-items: center;
      font-size: 1.7rem;
      height: 37px;
      padding: 0 10px;
      border: 1px solid #ced4da;
      border-right: none;
      border-radius: 0.25rem;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      cursor: pointer
    }
    input {
      padding: 10px;
    }
    .form-control textarea {
      height: 35px;
      padding: 5px
    }
    .input-group-append {
      #ddown2 {
        position: absolute;
        top: 0;
        right: 0;
        button {
          height: 37px;
          border-radius: 0;
          .icon {
            padding: 0 3px;
            font-size: 1.2rem;
            border: none;
            height: 0;
          }
          &.bigg {
            margin-left: -3px ;
            border-radius: 0 0.25rem .25rem 0;
            .icon {
              padding: 0;
              font-size: 1.7rem;
            }
          }
        }
      }
    }
    #textarea {
      max-width: calc(100% - 130px);
    }
    background-color: #eee;
    border-top: 1px solid #e6e5e5;
    padding: 10px;
  }

  .slide-up-enter-active, .slide-up-leave-active {
    transition: all .4s;
    transform: translate(0, 0);
  }
  .slide-up-enter, .slide-up-leave-to {
    transition: all .4s;
    transform: translate(0, 100%);
  }

  @media (max-width: 768px) {
    .slide-up-enter, .slide-up-leave-to {
      transition: all .4s;
      transform: translate(0, 120%);
    }
  }
</style>
